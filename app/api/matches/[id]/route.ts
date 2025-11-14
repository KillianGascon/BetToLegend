import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

/**
 * Route params schema for /api/matches/[id]
 * - Ensures "id" is a valid UUID.
 */
const MatchParamsSchema = z.object({
  id: z.uuid("Invalid match id"),
});

type MatchRouteParams = z.infer<typeof MatchParamsSchema>;

/**
 * Body schema for updating a match.
 * - All fields are optional and/or nullable so that partial updates are possible.
 * - match_date accepts either a string or a Date (then converted to Date).
 */
const UpdateMatchBodySchema = z.object({
  tournament_id: z.string().uuid().nullable().optional(),
  team1_id: z.string().uuid().nullable().optional(),
  team2_id: z.string().uuid().nullable().optional(),
  game_id: z.string().uuid().nullable().optional(),
  match_date: z.union([z.string(), z.date()]).nullable().optional(),
  status: z.string().optional(),
  team1_score: z.number().int().nullable().optional(),
  team2_score: z.number().int().nullable().optional(),
  winner_id: z.string().uuid().nullable().optional(),
  format: z.string().optional(),
});

type UpdateMatchBody = z.infer<typeof UpdateMatchBodySchema>;

/**
 * GET /api/matches/[id]
 *
 * Returns a full match detail:
 * - Basic match fields
 * - Linked teams (team1 / team2 / winner)
 * - Game, tournament, and odds
 * - Each odds row includes the related team
 */
export async function GET(
  _req: Request,
  { params }: { params: MatchRouteParams },
) {
  try {
    // Validate and extract "id" from params
    const { id } = MatchParamsSchema.parse(params);

    // Fetch match and all related entities
    const match = await prisma.matches.findUnique({
      where: { id },
      include: {
        teams_matches_team1_idToteams: true,
        teams_matches_team2_idToteams: true,
        teams_matches_winner_idToteams: true,
        games: true,
        tournaments: true,
        match_odds: {
          include: {
            teams: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(match);
  } catch (error: unknown) {
    console.error("Error in GET /api/matches/[id]:", error);

    // Params validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Generic server error
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/matches/[id]
 *
 * Complex match update with betting side-effects:
 * 1. Validate route params and body.
 * 2. In a transaction:
 *    - Load previous match state.
 *    - Build a partial update object from provided fields.
 *    - If status becomes "completed" and winner not explicitly provided:
 *      * Infer winner from scores (no draws allowed without custom logic).
 *    - Update match.
 *    - Maintain match_odds:
 *      * Ensure odds rows exist for team1 and team2.
 *      * Remove odds rows for teams no longer attached to match.
 *    - If match transitions from not-completed → completed:
 *      * Settle all "pending" bets:
 *        · Mark as "won"/"lost".
 *        · Compute payout for winners.
 *        · Credit user balance and total_won.
 * 3. Return full updated match with relations.
 */
export async function PUT(
  req: Request,
  { params }: { params: MatchRouteParams },
) {
  try {
    // Validate route params
    const { id } = MatchParamsSchema.parse(params);

    // Parse and validate body
    const body = UpdateMatchBodySchema.parse(
      await req.json(),
    ) as UpdateMatchBody;

    const {
      tournament_id,
      team1_id,
      team2_id,
      game_id,
      match_date,
      status,
      team1_score,
      team2_score,
      winner_id,
      format,
    } = body;

    // Default odds used when creating new match_odds entries
    const START_ODDS = new Decimal(1.0);

    const updated = await prisma.$transaction(async (tx: Tx) => {
      // Current state before update (for diff and logic)
      const before = await tx.matches.findUnique({
        where: { id },
        select: {
          id: true,
          tournament_id: true,
          team1_id: true,
          team2_id: true,
          game_id: true,
          match_date: true,
          status: true,
          team1_score: true,
          team2_score: true,
          winner_id: true,
        },
      });

      if (!before) {
        throw new Error("Match not found");
      }

      const wasFinished = before.status === "completed";

      // Build partial update payload from body
      const data: Prisma.matchesUncheckedUpdateInput = {};

      if (tournament_id !== undefined) data.tournament_id = tournament_id;
      if (team1_id !== undefined) data.team1_id = team1_id;
      if (team2_id !== undefined) data.team2_id = team2_id;
      if (game_id !== undefined) data.game_id = game_id;

      if (match_date !== undefined) {
        // Accept null (clear date) or string/Date (parsed to Date)
        data.match_date = match_date
          ? new Date(match_date as any)
          : null;
      }

      if (status !== undefined) data.status = status;
      if (team1_score !== undefined) data.team1_score = team1_score;
      if (team2_score !== undefined) data.team2_score = team2_score;
      if (winner_id !== undefined) data.winner_id = winner_id;
      if (format !== undefined) data.format = format;

      /**
       * If the match is being marked as "completed" and no winner_id is provided:
       * - Try to infer winner from scores.
       * - Reject draws here (custom draw logic would need to be added explicitly).
       */
      if (status === "completed" && winner_id === undefined) {
        const s1 = team1_score ?? before.team1_score ?? 0;
        const s2 = team2_score ?? before.team2_score ?? 0;

        if (s1 === s2) {
          throw new Error(
            "Impossible de terminer le match sur une égalité sans logique spécifique.",
          );
        }

        const winnerTeamId = s1 > s2 ? before.team1_id : before.team2_id;

        if (!winnerTeamId) {
          throw new Error(
            "Impossible de déterminer le vainqueur (équipes manquantes).",
          );
        }

        data.winner_id = winnerTeamId;
      }

      // Apply match update and retrieve minimal info needed for subsequent logic
      const after = await tx.matches.update({
        where: { id },
        data,
        select: {
          id: true,
          team1_id: true,
          team2_id: true,
          winner_id: true,
          status: true,
        },
      });

      // --- Maintain match_odds consistency with current teams ---

      // Teams that should have odds now (team1, team2 if defined)
      const desired = new Set<string>(
        [after.team1_id, after.team2_id].filter(Boolean) as string[],
      );

      // Existing odds rows for this match
      const existingOdds = await tx.match_odds.findMany({
        where: { match_id: after.id },
        select: { id: true, team_id: true },
      });

      const existingSet = new Set(existingOdds.map((r) => r.team_id));

      // Create missing odds rows for newly attached teams
      for (const tid of desired) {
        if (!existingSet.has(tid)) {
          await tx.match_odds.create({
            data: { match_id: after.id, team_id: tid, odds: START_ODDS },
          });
        }
      }

      // Remove odds rows that belong to teams no longer attached to this match
      for (const row of existingOdds) {
        if (!desired.has(row.team_id)) {
          await tx.match_odds.delete({ where: { id: row.id } });
        }
      }

      // --- Settle bets if match transitions to "completed" ---

      const isNowFinished = after.status === "completed";
      const winnerTeamId = after.winner_id;

      if (!wasFinished && isNowFinished && winnerTeamId) {
        // Find all pending bets on this match
        const pendingBets = await tx.bets.findMany({
          where: {
            match_id: after.id,
            status: "pending",
          },
          select: {
            id: true,
            user_id: true,
            team_id: true,
            amount: true,
            odds: true,
          },
        });

        for (const bet of pendingBets) {
          const isWinner = bet.team_id === winnerTeamId;

          // Payout = amount * odds if bet is on the winning team, else 0
          const payout: Decimal = isWinner
            ? (bet.amount as Decimal).mul(bet.odds as Decimal)
            : new Decimal(0);

          // Update bet status and potential_payout
          await tx.bets.update({
            where: { id: bet.id },
            data: {
              status: isWinner ? "won" : "lost",
              potential_payout: payout,
            },
          });

          // Credit user if the bet won and payout is positive
          if (isWinner && bet.user_id && payout.gt(0)) {
            await tx.users.update({
              where: { id: bet.user_id },
              data: {
                balance: { increment: payout },
                total_won: { increment: payout },
              },
            });
          }
        }
      }

      // Return full match with all relations after the update & settlements
      return tx.matches.findUnique({
        where: { id: after.id },
        include: {
          teams_matches_team1_idToteams: true,
          teams_matches_team2_idToteams: true,
          teams_matches_winner_idToteams: true,
          games: true,
          tournaments: true,
          match_odds: { include: { teams: true } },
          bets: true,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Error in PUT /api/matches/[id]:", error);

    // Body/params validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Generic server error
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/matches/[id]
 *
 * Deletes a match and its related data:
 * - Deletes all bets associated with the match.
 * - Deletes all match_odds for the match.
 * - Deletes the match itself.
 *
 * Everything runs inside a transaction to ensure referential integrity.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: MatchRouteParams },
) {
  try {
    // Validate and extract "id" from params
    const { id } = MatchParamsSchema.parse(params);

    // Transactionally delete dependent rows then the match
    await prisma.$transaction(async (tx: Tx) => {
      await tx.bets.deleteMany({
        where: { match_id: id },
      });

      await tx.match_odds.deleteMany({
        where: { match_id: id },
      });

      await tx.matches.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/matches/[id]:", error);

    // Params validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Generic server error
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

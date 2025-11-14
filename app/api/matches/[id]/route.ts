    
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * 🎮 GET /api/matches/[id]
 * Retrieve detailed information for a single match.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // Fetch the match by ID, including team relations (team1, team2, winner)
        const match = await prisma.matches.findUnique({
            where: { id: params.id },
            include: {
                teams_matches_team1_idToteams: true,
                teams_matches_team2_idToteams: true,
                teams_matches_winner_idToteams: true,
                games: true,
                tournaments: true,
                match_odds: {
                    include: {
                        teams: true,
                    }
                },
            },
        });

        // Return a 404 response if the match was not found
        if (!match) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 });
        }

        // Return the match as JSON
        return NextResponse.json(match);
    } catch (error: unknown) {
        // Log the error for debugging
        console.error("❌ Error in GET /api/matches/[id]:", error);

        // Return an appropriate error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}


/**
 * ✏️ PUT /api/matches/[id]
 * Met à jour le match et synchronise match_odds si team1_id/team2_id changent.
 */


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

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

    const START_ODDS = new Decimal(1.0);

    const updated = await prisma.$transaction(async (tx) => {
      // 🔍 État avant update
      const before = await tx.matches.findUnique({
        where: { id: params.id },
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

      if (!before) throw new Error("Match not found");

      const wasFinished = before.status === "completed";

      // Construire data d'update "partiel"
      const data: any = {};
      if (tournament_id !== undefined) data.tournament_id = tournament_id;
      if (team1_id !== undefined) data.team1_id = team1_id;
      if (team2_id !== undefined) data.team2_id = team2_id;
      if (game_id !== undefined) data.game_id = game_id;
      if (match_date !== undefined)
        data.match_date = match_date ? new Date(match_date) : null;
      if (status !== undefined) data.status = status;
      if (team1_score !== undefined) data.team1_score = team1_score;
      if (team2_score !== undefined) data.team2_score = team2_score;
      if (winner_id !== undefined) data.winner_id = winner_id;
      if (format !== undefined) data.format = format;

      // 🧠 Si on passe en "completed" sans winner_id explicite → déduire à partir des scores
      if (status === "completed" && winner_id === undefined) {
        const s1 = team1_score ?? before.team1_score ?? 0;
        const s2 = team2_score ?? before.team2_score ?? 0;

        if (s1 === s2) {
          throw new Error(
            "Impossible de terminer le match sur une égalité sans logique spécifique."
          );
        }

        const winnerTeamId = s1 > s2 ? before.team1_id : before.team2_id;

        if (!winnerTeamId) {
          throw new Error("Impossible de déterminer le vainqueur (équipes manquantes).");
        }

        data.winner_id = winnerTeamId;
      }

      // 👉 Update principal du match
      const after = await tx.matches.update({
        where: { id: params.id },
        data,
        select: {
          id: true,
          team1_id: true,
          team2_id: true,
          winner_id: true,
          status: true,
        },
      });

      // --- Sync match_odds comme avant ---
      const desired = new Set<string>(
        [after.team1_id, after.team2_id].filter(Boolean) as string[]
      );

      const existingOdds = await tx.match_odds.findMany({
        where: { match_id: after.id },
        select: { id: true, team_id: true },
      });

      const existingSet = new Set(existingOdds.map((r) => r.team_id));

      // Créer les odds manquantes
      for (const tid of desired) {
        if (!existingSet.has(tid)) {
          await tx.match_odds.create({
            data: { match_id: after.id, team_id: tid, odds: START_ODDS },
          });
        }
      }

      // Supprimer les odds orphelines
      for (const row of existingOdds) {
        if (!desired.has(row.team_id)) {
          await tx.match_odds.delete({ where: { id: row.id } });
        }
      }

      // --- 💰 RÈGLEMENT DES PARIS ---
      const isNowFinished = after.status === "completed";
      const winnerTeamId = after.winner_id;

      // On ne règle que si on vient de passer en finished et qu'on connaît le winner
      if (!wasFinished && isNowFinished && winnerTeamId) {
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

          // amount & odds sont déjà des Decimal d'après ton schéma
          const payout: Decimal = isWinner
            ? (bet.amount as Decimal).mul(bet.odds as Decimal)
            : new Decimal(0);

          // 1) Update du bet
          await tx.bets.update({
            where: { id: bet.id },
            data: {
              status: isWinner ? "won" : "lost",
              potential_payout: payout, // ici tu peux décider que ça devient le "payout réel"
            },
          });

          // 2) Créditer le user si gagnant
          if (isWinner && bet.user_id && payout.gt(0)) {
            await tx.users.update({
              where: { id: bet.user_id },
              data: {
                balance: { increment: payout },
                total_won: { increment: payout },
                // total_bet normalement déjà incrémenté à la création du pari
              },
            });
          }
        }
      }

      // Retourner le match complet pour le front
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
    console.error("❌ Error in PUT /api/matches/[id]:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



/**
 * 🗑️ DELETE /api/matches/[id]
 * Permanently delete a match from the database.
 */
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    await prisma.$transaction(async (tx) => {
      // 1) Supprimer les paris liés au match
      await tx.bets.deleteMany({
        where: { match_id: id },
      });

      // 2) Supprimer les cotes liées au match
      await tx.match_odds.deleteMany({
        where: { match_id: id },
      });

      // 3) Supprimer le match
      await tx.matches.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("❌ Error in DELETE /api/matches/[id]:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

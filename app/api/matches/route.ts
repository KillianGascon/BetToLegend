import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

/**
 * Schema for creating a match.
 *
 * All fields are optional/nullable to allow flexible creation:
 * - tournament_id, team1_id, team2_id, game_id, winner_id: UUIDs or null.
 * - match_date: string or Date, or null.
 * - status: string (e.g. "scheduled", "live", "completed"...).
 * - team1_score / team2_score: nullable integer scores.
 * - format: optional string (e.g. "BO1", "BO3"...).
 */
const CreateMatchBodySchema = z.object({
  tournament_id: z.uuid().nullable().optional(),
  team1_id: z.uuid().nullable().optional(),
  team2_id: z.uuid().nullable().optional(),
  game_id: z.uuid().nullable().optional(),
  match_date: z.union([z.string(), z.date()]).nullable().optional(),
  status: z.string().optional(),
  team1_score: z.number().int().nullable().optional(),
  team2_score: z.number().int().nullable().optional(),
  winner_id: z.uuid().nullable().optional(),
  format: z.string().nullable().optional(),
});

type CreateMatchBody = z.infer<typeof CreateMatchBodySchema>;

/**
 * POST /api/matches
 *
 * Creates a new match and initializes odds:
 *
 * 1. Validates body with Zod.
 * 2. In a transaction:
 *    - Create the match with defaulted values:
 *      * status defaults to "scheduled"
 *      * scores default to 0
 *      * nullable relations default to null
 *    - For each defined team (team1 / team2), create a match_odds row
 *      with START_ODDS.
 *    - Reload the match with all its relations (teams, game, tournament, odds).
 * 3. Returns the full match JSON with status 201.
 *
 * Error handling:
 * - Zod errors → 400 with issues.
 * - Other errors → 500 with generic message.
 */
export async function POST(req: Request) {
  try {
    // Parse and validate incoming JSON body
    const body = CreateMatchBodySchema.parse(
      await req.json(),
    ) as CreateMatchBody;

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

    // Default odds assigned when creating match_odds rows
    const START_ODDS = new Decimal(1.0);

    const result = await prisma.$transaction(async (tx: Tx) => {
      // Create the match with normalized/default values
      const match = await tx.matches.create({
        data: {
          tournament_id: tournament_id ?? null,
          team1_id: team1_id ?? null,
          team2_id: team2_id ?? null,
          game_id: game_id ?? null,
          match_date: match_date ? new Date(match_date as any) : null,
          status: status ?? "scheduled",
          team1_score: team1_score ?? 0,
          team2_score: team2_score ?? 0,
          winner_id: winner_id ?? null,
          format: format ?? null,
        },
        select: { id: true, team1_id: true, team2_id: true },
      });

      // Build initial odds rows for both teams if present
      const rows: Array<{
        match_id: string;
        team_id: string;
        odds: Decimal;
      }> = [];

      if (match.team1_id) {
        rows.push({
          match_id: match.id,
          team_id: match.team1_id,
          odds: START_ODDS,
        });
      }

      if (match.team2_id) {
        rows.push({
          match_id: match.id,
          team_id: match.team2_id,
          odds: START_ODDS,
        });
      }

      // Create odds entries if there are any teams associated
      if (rows.length > 0) {
        await tx.match_odds.createMany({
          data: rows,
          skipDuplicates: true,
        });
      }

      // Reload full match with all relations for the response
      return tx.matches.findUnique({
        where: { id: match.id },
        include: {
          teams_matches_team1_idToteams: true,
          teams_matches_team2_idToteams: true,
          teams_matches_winner_idToteams: true,
          games: true,
          tournaments: true,
          match_odds: { include: { teams: true } },
        },
      });
    });

    // Creation → 201
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/matches:", error);

    // Validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    // Generic server error
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/matches
 *
 * Lists all matches with rich relations:
 * - Teams (team1, team2, winner)
 * - Game
 * - Tournament
 * - Odds per team (with team relation)
 *
 * Matches are ordered by match_date ascending.
 */
export async function GET() {
  try {
    const matches = await prisma.matches.findMany({
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
      orderBy: { match_date: "asc" },
    });

    return NextResponse.json(matches);
  } catch (error: unknown) {
    console.error("Error in GET /api/matches:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
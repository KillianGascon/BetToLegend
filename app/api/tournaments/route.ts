import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { tournaments, games } from "@prisma/client";

/**
 * Convenience type:
 * Tournament row with its optional related game.
 */
type TournamentWithGame = tournaments & { games: games | null };

/**
 * Schema for creating a tournament.
 *
 * Fields:
 * - name: required non-empty string
 * - game_id: optional/nullable UUID (link to games table)
 * - prize_pool: optional/nullable number or string (coerced later)
 * - start_date: optional/nullable string or Date (coerced later)
 * - end_date: optional/nullable string or Date (coerced later)
 * - location: optional/nullable string (e.g. "Paris", "Online")
 * - status: optional string (e.g. "upcoming", "ongoing", "finished")
 */
const CreateTournamentSchema = z.object({
  name: z.string().min(1, "Tournament name is required"),
  game_id: z.uuid().nullable().optional(),
  prize_pool: z.union([z.number(), z.string()]).nullable().optional(),
  start_date: z.union([z.string(), z.date()]).nullable().optional(),
  end_date: z.union([z.string(), z.date()]).nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.string().optional(),
});

type CreateTournamentInput = z.infer<typeof CreateTournamentSchema>;

/**
 * GET /api/tournaments
 *
 * Returns the list of tournaments with their associated game:
 * - Includes related `games` row (can be null).
 * - Ordered by start_date descending (most recent / upcoming first).
 */
export async function GET() {
  try {
    const tournamentsList = await prisma.tournaments.findMany({
      include: { games: true },
      orderBy: { start_date: "desc" },
    });

    return NextResponse.json<TournamentWithGame[]>(tournamentsList);
  } catch (error: unknown) {
    console.error("Error in GET /api/tournaments:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/tournaments
 *
 * Creates a new tournament.
 *
 * Flow:
 * 1. Parse JSON body.
 * 2. Validate with CreateTournamentSchema.
 * 3. Normalize:
 *    - prize_pool: string/number → number | null (ignore NaN).
 *    - start_date / end_date: string/Date → Date | null.
 * 4. Create tournament with Prisma:
 *    - status defaults to "upcoming" if not provided.
 *    - game_id set to null if omitted.
 *    - location: null if not provided.
 * 5. Include the related `games` row in the response.
 */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = CreateTournamentSchema.parse(
      json,
    ) as CreateTournamentInput;

    // Coerce prize_pool into number | null
    const prizePoolNumber =
      body.prize_pool !== undefined && body.prize_pool !== null
        ? typeof body.prize_pool === "string"
          ? Number(body.prize_pool)
          : body.prize_pool
        : null;

    // Coerce start_date into Date | null
    const startDate =
      body.start_date && body.start_date !== null
        ? new Date(body.start_date as any)
        : null;

    // Coerce end_date into Date | null
    const endDate =
      body.end_date && body.end_date !== null
        ? new Date(body.end_date as any)
        : null;

    const tournament = await prisma.tournaments.create({
      data: {
        name: body.name,
        game_id: body.game_id ?? null,
        prize_pool:
          prizePoolNumber !== null && !Number.isNaN(prizePoolNumber)
            ? prizePoolNumber
            : null,
        start_date: startDate,
        end_date: endDate,
        location: body.location ?? null,
        status: body.status ?? "upcoming",
      },
      include: { games: true },
    });

    return NextResponse.json<TournamentWithGame>(tournament);
  } catch (error: unknown) {
    console.error("Error in POST /api/tournaments:", error);

    // Payload validation failed
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Generic server error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    // Fallback for unknown error shapes
    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { tournaments } from "@prisma/client";

/**
 * Route params schema for /api/tournaments/[id]
 * - Ensures "id" is a valid UUID.
 */
const TournamentParamsSchema = z.object({
  id: z.uuid("Invalid tournament id"),
});

type TournamentRouteParams = z.infer<typeof TournamentParamsSchema>;

/**
 * Body schema for updating a tournament.
 *
 * All fields are optional to support partial updates:
 * - name: optional non-empty string
 * - game_id: optional/nullable UUID (can be null to detach game)
 * - prize_pool: optional/nullable number or string (coerced to number)
 * - start_date / end_date: optional/nullable string or Date
 * - location: optional/nullable string
 * - status: optional string (you can restrict to an enum later)
 */
const TournamentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  game_id: z.uuid().nullable().optional(),
  prize_pool: z.union([z.number(), z.string()]).nullable().optional(),
  start_date: z.union([z.string(), z.date()]).nullable().optional(),
  end_date: z.union([z.string(), z.date()]).nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.string().optional(), // can be restricted to your enum
});

type TournamentUpdateInput = z.infer<typeof TournamentUpdateSchema>;

/**
 * GET /api/tournaments/[id]
 *
 * Returns a single tournament with relations:
 * - Includes related game (`games`) and matches (`matches`).
 *
 * Flow:
 * 1. Validate route params (id).
 * 2. Fetch tournament with relations.
 * 3. 404 if not found.
 * 4. 400 on validation issues.
 * 5. 500 on server errors.
 */
export async function GET(
  _req: Request,
  { params }: { params: TournamentRouteParams },
) {
  try {
    const { id } = TournamentParamsSchema.parse(params);

    const tournament = await prisma.tournaments.findUnique({
      where: { id },
      include: {
        games: true,
        matches: true,
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    // Explicit type annotation to reflect included relations
    return NextResponse.json<tournaments & { games: any; matches: any[] }>(
      tournament,
    );
  } catch (error: unknown) {
    console.error("Error in GET /api/tournaments/[id]:", error);

    // Params validation error
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

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/tournaments/[id]
 *
 * Partially updates a tournament.
 *
 * Flow:
 * 1. Validate route params (id).
 * 2. Parse JSON body.
 * 3. Validate body with TournamentUpdateSchema.
 * 4. Normalize:
 *    - prize_pool: string/number → number | null (ignore NaN).
 *    - start_date / end_date: string/Date → Date | null.
 * 5. Update tournament using Prisma, only setting provided fields:
 *    - name: undefined if not present.
 *    - game_id: null if explicitly null, unchanged if undefined.
 *    - prize_pool: numeric value or null if invalid/not provided.
 *    - start_date / end_date: Date | null.
 *    - location: null if not provided.
 *    - status: undefined if not provided (no change).
 */
export async function PUT(
  req: Request,
  { params }: { params: TournamentRouteParams },
) {
  try {
    const { id } = TournamentParamsSchema.parse(params);

    const json = await req.json();
    const body = TournamentUpdateSchema.parse(
      json,
    ) as TournamentUpdateInput;

    // Coerce prize_pool to number | null
    const prizePoolNumber =
      body.prize_pool !== undefined && body.prize_pool !== null
        ? typeof body.prize_pool === "string"
          ? Number(body.prize_pool)
          : body.prize_pool
        : null;

    // Coerce start_date to Date | null
    const startDate =
      body.start_date && body.start_date !== null
        ? new Date(body.start_date as any)
        : null;

    // Coerce end_date to Date | null
    const endDate =
      body.end_date && body.end_date !== null
        ? new Date(body.end_date as any)
        : null;

    const updatedTournament = await prisma.tournaments.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        game_id: body.game_id ?? null,
        prize_pool:
          prizePoolNumber !== null && !Number.isNaN(prizePoolNumber)
            ? prizePoolNumber
            : null,
        start_date: startDate,
        end_date: endDate,
        location: body.location ?? null,
        status: body.status ?? undefined,
      },
    });

    return NextResponse.json<tournaments>(updatedTournament);
  } catch (error: unknown) {
    console.error("Error in PUT /api/tournaments/[id]:", error);

    // Body/params validation error
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

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/tournaments/[id]
 *
 * Deletes a tournament by ID.
 *
 * Flow:
 * 1. Validate route params (id).
 * 2. Delete tournament with Prisma.
 * 3. Return `{ success: true }` on success.
 *
 * Error handling:
 * - Zod validation errors → 400.
 * - Other errors → 500.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: TournamentRouteParams },
) {
  try {
    const { id } = TournamentParamsSchema.parse(params);

    await prisma.tournaments.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/tournaments/[id]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

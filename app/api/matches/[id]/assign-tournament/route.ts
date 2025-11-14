import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { matches } from "@prisma/client";

/**
 * Route params schema for /api/matches/[id]/assign-tournament
 * - Ensures "id" is a valid UUID.
 */
const MatchParamsSchema = z.object({
  id: z.uuid("Invalid match id"),
});

type MatchRouteParams = z.infer<typeof MatchParamsSchema>;

/**
 * Request body schema for assigning a match to a tournament:
 * - tournament_id: required UUID string.
 */
const AssignTournamentBodySchema = z.object({
  tournament_id: z.string().uuid("Invalid tournament_id"),
});

type AssignTournamentBody = z.infer<typeof AssignTournamentBodySchema>;

/**
 * POST /api/[id]/assign-tournament
 *
 * Assign a match to a tournament.
 * Flow:
 * 1. Validate route params (match id).
 * 2. Validate body (tournament_id).
 * 3. Check that the tournament exists.
 * 4. Update the match with the given tournament_id.
 * 5. Return success payload including the updated match.
 *
 * Error handling:
 * - Zod validation errors → 400 with details.
 * - Tournament not found → 404.
 * - Other unexpected errors → 500.
 */
export async function POST(
  req: Request,
  { params }: { params: MatchRouteParams },
) {
  try {
    // Validate and extract "id" from URL params
    const { id } = MatchParamsSchema.parse(params);

    // Parse and validate request body
    const body = AssignTournamentBodySchema.parse(
      await req.json(),
    ) as AssignTournamentBody;

    // Check that the tournament exists before assigning
    const tournamentExists = await prisma.tournaments.findUnique({
      where: { id: body.tournament_id },
    });

    if (!tournamentExists) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    // Update the match with the tournament_id
    const updatedMatch = await prisma.matches.update({
      where: { id },
      data: { tournament_id: body.tournament_id },
    });

    // Return a structured success response including the updated match
    return NextResponse.json<{
      success: true;
      message: string;
      match: matches;
    }>({
      success: true,
      message: `Match ${id} successfully assigned to tournament ${body.tournament_id}`,
      match: updatedMatch,
    });
  } catch (error: unknown) {
    console.error("Error assigning match to tournament:", error);

    // Validation error (params or body)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    // Fallback technical error
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

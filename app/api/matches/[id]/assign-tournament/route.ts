import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🏆 POST /api/matches/[id]/assign-tournament
 * Assigns an existing match to a specific tournament.
 *
 * Example request:
 * POST /api/matches/123/assign-tournament
 * Body: { "tournament_id": "456" }
 */
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Parse tournament_id from the request body
        const { tournament_id } = await req.json();

        // Validate that a tournament_id was provided
        if (!tournament_id) {
            return NextResponse.json(
                { error: "tournament_id is required" },
                { status: 400 }
            );
        }

        // Optional safety check — verify that the tournament exists
        const tournamentExists = await prisma.tournaments.findUnique({
            where: { id: tournament_id },
        });

        if (!tournamentExists) {
            return NextResponse.json(
                { error: "Tournament not found" },
                { status: 404 }
            );
        }

        // Update the match to link it with the given tournament
        const updatedMatch = await prisma.matches.update({
            where: { id: params.id },
            data: { tournament_id },
        });

        // Return confirmation message and updated match
        return NextResponse.json({
            success: true,
            message: `Match ${params.id} successfully assigned to tournament ${tournament_id}`,
            match: updatedMatch,
        });
    } catch (error: unknown) {
        // Log any server or Prisma errors for debugging
        console.error("❌ Error assigning match to tournament:", error);

        // Return an appropriate JSON error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

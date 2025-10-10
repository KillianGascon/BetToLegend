import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
 * Update match details such as teams, scores, date, format, etc.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        // Parse the request body for match data
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

        // Update the match record in the database
        const updated = await prisma.matches.update({
            where: { id: params.id },
            data: {
                tournament_id: tournament_id || null,
                team1_id: team1_id || null,
                team2_id: team2_id || null,
                game_id: game_id || null,
                match_date: match_date ? new Date(match_date) : null,
                status: status || undefined,
                team1_score: team1_score ?? undefined,
                team2_score: team2_score ?? undefined,
                winner_id: winner_id || null,
                format: format || undefined,
            },
        });

        // Return the updated match as JSON
        return NextResponse.json(updated);
    } catch (error: unknown) {
        // Log and handle any Prisma or validation errors
        console.error("❌ Error in PUT /api/matches/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🗑️ DELETE /api/matches/[id]
 * Permanently delete a match from the database.
 */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Remove the match by its ID
        await prisma.matches.delete({
            where: { id: params.id },
        });

        // Return a success response
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        // Log the error for debugging
        console.error("❌ Error in DELETE /api/matches/[id]:", error);

        // Return an appropriate error message
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 📋 GET /api/tournaments
 * Retrieve all tournaments with their associated games.
 */
export async function GET() {
    try {
        const tournaments = await prisma.tournaments.findMany({
            include: { games: true },
            orderBy: { start_date: "desc" },
        });

        return NextResponse.json(tournaments);
    } catch (error: unknown) {
        console.error("❌ Error in GET /api/tournaments:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🏆 POST /api/tournaments
 * Create a new tournament entry.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, game_id, prize_pool, start_date, end_date, location, status } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { error: "Tournament name is required" },
                { status: 400 }
            );
        }

        // Create tournament
        const tournament = await prisma.tournaments.create({
            data: {
                name,
                game_id: game_id || null,
                prize_pool: prize_pool ? Number(prize_pool) : null,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                location: location || null,
                status: status || "upcoming",
            },
            include: { games: true },
        });

        return NextResponse.json(tournament);
    } catch (error: unknown) {
        console.error("❌ Error in POST /api/tournaments:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

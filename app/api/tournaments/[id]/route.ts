import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🎯 GET /api/tournaments/[id]
 * Retrieve a single tournament by its ID, including related game and matches.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const tournament = await prisma.tournaments.findUnique({
            where: { id },
            include: {
                games: true,
                matches: true,
            },
        });

        if (!tournament) {
            return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
        }

        return NextResponse.json(tournament);
    } catch (error: unknown) {
        console.error("❌ Error in GET /api/tournaments/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * ✏️ PUT /api/tournaments/[id]
 * Update an existing tournament by ID.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();

        const updatedTournament = await prisma.tournaments.update({
            where: { id },
            data: {
                name: body.name,
                game_id: body.game_id || null,
                prize_pool: body.prize_pool ? Number(body.prize_pool) : null,
                start_date: body.start_date ? new Date(body.start_date) : null,
                end_date: body.end_date ? new Date(body.end_date) : null,
                location: body.location || null,
                status: body.status || undefined,
            },
        });

        return NextResponse.json(updatedTournament);
    } catch (error: unknown) {
        console.error("❌ Error in PUT /api/tournaments/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🗑️ DELETE /api/tournaments/[id]
 * Delete a tournament by ID.
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        await prisma.tournaments.delete({ where: { id } });
        console.log(`🗑️ Tournament ${id} deleted successfully`);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("❌ Error in DELETE /api/tournaments/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

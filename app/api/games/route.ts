import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🎮 POST /api/games
 * Create a new game entry in the database.
 */
export async function POST(req: Request) {
    try {
        // Parse the JSON body from the incoming request
        const { name, category } = await req.json();

        // Validate required fields
        if (!name || !category) {
            return NextResponse.json(
                { error: "Name and category required" },
                { status: 400 }
            );
        }

        // Create a new game record using Prisma
        const game = await prisma.games.create({
            data: { name, category },
        });

        // Return the newly created game as JSON
        return NextResponse.json(game);
    } catch (error: unknown) {
        // Log any server or Prisma errors for debugging
        console.error("❌ Error in POST /api/games:", error);

        // Return a proper error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 📄 GET /api/games
 * Retrieve all games stored in the database.
 */
export async function GET() {
    try {
        // Fetch all games, ordered by creation date (most recent first)
        const games = await prisma.games.findMany({
            orderBy: { created_at: "desc" },
        });

        // Return the list of games as JSON
        return NextResponse.json(games);
    } catch (error: unknown) {
        // Log the error for debugging purposes
        console.error("❌ Error in GET /api/games:", error);

        // Handle any Prisma or unknown errors
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

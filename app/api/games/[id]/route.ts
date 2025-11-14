import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🎮 GET /api/games/[id]
 * Retrieve a single game by its ID.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // Find the game using the ID from the dynamic route
        const game = await prisma.games.findUnique({
            where: { id: params.id },
        });

        // If no game was found, return a 404 error
        if (!game)
            return NextResponse.json({ error: "Game not found" }, { status: 404 });

        // Return the game data as JSON
        return NextResponse.json(game);
    } catch (error: unknown) {
        // Log the error for debugging
        console.error("❌ Error in GET /api/games/[id]:", error);

        // Return proper error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * ✏️ PUT /api/games/[id]
 * Update a game’s information (name and/or category).
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        // Extract data from the JSON body
        const { name, category } = await req.json();

        // Update the game in the database
        const updated = await prisma.games.update({
            where: { id: params.id },
            data: { name, category },
        });

        // Return the updated game data
        return NextResponse.json(updated);
    } catch (error: unknown) {
        // Log and return errors properly
        console.error("❌ Error in PUT /api/games/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🗑️ DELETE /api/games/[id]
 * Permanently delete a game by its ID.
 */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Delete the game from the database
        await prisma.games.delete({
            where: { id: params.id },
        });

        // Return a simple success message
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        // Handle and log any database or Prisma errors
        console.error("❌ Error in DELETE /api/games/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

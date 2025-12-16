import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { games } from "@prisma/client";

/**
 * Schema for creating a game:
 * - name: required non-empty string
 * - category: required non-empty string
 */
const CreateGameSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
});

type CreateGameBody = z.infer<typeof CreateGameSchema>;

/**
 * POST /api/games
 *
 * Creates a new game.
 * - Validates the request body using Zod.
 * - Inserts the new game into the DB via Prisma.
 * - Returns the created game as JSON.
 * - On validation error → 400 with detailed issues.
 * - On other errors → 500 with a generic message.
 */
export async function POST(req: Request) {
  try {
    // Parse and validate incoming JSON body
    const body = CreateGameSchema.parse(await req.json()) as CreateGameBody;

    // Create new game record
    const game = await prisma.games.create({
      data: {
        name: body.name,
        category: body.category,
      },
    });

    // Typed JSON response
    return NextResponse.json<games>(game);
  } catch (error: unknown) {
    console.error("Error in POST /api/games:", error);

    // Zod validation error → client-side problem
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    // Fallback technical error → server-side problem
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/games
 *
 * Lists all games.
 * - Fetches all games ordered by created_at DESC.
 * - Returns an array of games as JSON.
 * - On error → 500.
 */
export async function GET() {
  try {
    // Fetch all games, newest first
    const games = await prisma.games.findMany({
      orderBy: { created_at: "desc" },
    });

    // Typed JSON response with list of games
    return NextResponse.json<games[]>(games);
  } catch (error: unknown) {
    console.error("Error in GET /api/games:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

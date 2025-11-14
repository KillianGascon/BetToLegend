import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { games } from "@prisma/client";

/**
 * Route params schema for /api/games/[id]
 * - Ensures "id" is a valid UUID.
 */
const GameParamsSchema = z.object({
  id: z.uuid("Invalid game id"),
});

type GameRouteParams = z.infer<typeof GameParamsSchema>;

/**
 * Body schema for updating a game:
 * - "name" and "category" are both optional strings (non-empty if present).
 * - At least one of them must be provided.
 */
const UpdateGameBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.category !== undefined,
    { message: "At least one of 'name' or 'category' must be provided" },
  );

type UpdateGameBody = z.infer<typeof UpdateGameBodySchema>;

/**
 * GET /api/games/[id]
 *
 * Returns a single game by ID.
 * - Validates route params with Zod.
 * - Looks up the game in the database.
 * - 404 if not found, 200 with game JSON if found.
 * - 400 on validation error.
 * - 500 on unexpected errors.
 */
export async function GET(
  _req: Request,
  { params }: { params: GameRouteParams },
) {
  try {
    // Validate and extract "id" from params
    const { id } = GameParamsSchema.parse(params);

    // Fetch game by primary key
    const game = await prisma.games.findUnique({
      where: { id },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 },
      );
    }

    // Typed JSON response with game
    return NextResponse.json<games>(game);
  } catch (error: unknown) {
    console.error("Error in GET /api/games/[id]:", error);

    // Validation error on params
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

/**
 * PUT /api/games/[id]
 *
 * Updates a game by ID.
 * - Validates route params.
 * - Validates body with UpdateGameBodySchema:
 *   * At least one of "name" or "category" must be present.
 * - Performs prisma.games.update with the provided fields.
 * - Returns updated game or validation/technical errors.
 */
export async function PUT(
  req: Request,
  { params }: { params: GameRouteParams },
) {
  try {
    // Validate route params
    const { id } = GameParamsSchema.parse(params);

    // Parse and validate request body
    const body = UpdateGameBodySchema.parse(await req.json()) as UpdateGameBody;

    // Update only provided fields (name / category)
    const updated = await prisma.games.update({
      where: { id },
      data: body,
    });

    // Typed JSON response with updated game
    return NextResponse.json<games>(updated);
  } catch (error: unknown) {
    console.error("Error in PUT /api/games/[id]:", error);

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

/**
 * DELETE /api/games/[id]
 *
 * Deletes a game by ID.
 * - Validates route params.
 * - Deletes the game if it exists.
 * - Returns { success: true } on success.
 * - 400 on validation error.
 * - 500 on technical error.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: GameRouteParams },
) {
  try {
    // Validate route params
    const { id } = GameParamsSchema.parse(params);

    // Delete game entry
    await prisma.games.delete({
      where: { id },
    });

    // Simple success payload
    return NextResponse.json<{ success: true }>({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/games/[id]:", error);

    // Validation error on params
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

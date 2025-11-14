import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import type { players } from "@prisma/client";

/**
 * Schema for creating a player.
 *
 * - username: required non-empty string
 * - real_name: optional/nullable string
 * - country: 2-letter country code, default "FR"
 * - age: optional/nullable non-negative integer
 * - role: optional/nullable string (e.g. "support", "carry"...)
 * - twitch_followers: required non-negative integer
 * - youtube_subscribers: required non-negative integer
 */
const CreatePlayerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  real_name: z.string().min(1).nullable().optional(),
  country: z.string().length(2).default("FR"),
  age: z.number().int().min(0).nullable().optional(),
  role: z.string().nullable().optional(),
  twitch_followers: z.number().int().min(0),
  youtube_subscribers: z.number().int().min(0),
});

type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;

/**
 * Route params schema for /api/players/[id]
 * - Ensures "id" is a valid UUID.
 */
const PlayerParamsSchema = z.object({
  id: z.string().uuid("Invalid player id"),
});

type PlayerRouteParams = z.infer<typeof PlayerParamsSchema>;

/**
 * Parse a FormData numeric field with a default fallback:
 * - If missing or not a string → returns fallback.
 * - If NaN → returns fallback.
 */
function parseNumberOr(
  value: FormDataEntryValue | null,
  fallback: number,
): number {
  if (!value || typeof value !== "string") return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

/**
 * Parse a FormData numeric field into number | null:
 * - Empty / missing / non-string → null.
 * - If NaN → null.
 */
function parseNumberOrNull(value: FormDataEntryValue | null): number | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

/**
 * POST /api/players
 *
 * Creates a new player from multipart/form-data:
 * - Accepts text fields and an optional avatar file.
 * - Validates all fields using Zod.
 * - If avatar is present:
 *   * Saves file under public/uploads/avatar with a unique filename.
 *   * Stores a public avatar_url pointing to that path.
 * - Inserts a new player row in the DB.
 * - Returns the created player as JSON.
 *
 * Error handling:
 * - Zod validation error → 400 with issues.
 * - Other errors → 500 with message.
 */
export async function POST(req: Request) {
  try {
    console.log("Incoming POST request to /api/players");

    // Parse multipart/form-data request
    const formData = await req.formData();
    console.log("FormData successfully parsed");

    // Extract fields from formData
    const username = formData.get("username") as string | null;
    const real_name = formData.get("real_name") as string | null;
    const country = (formData.get("country") as string | null) ?? "FR";
    const age = parseNumberOrNull(formData.get("age"));
    const role = formData.get("role") as string | null;

    const twitch_followers = parseNumberOr(
      formData.get("twitch_followers"),
      0,
    );
    const youtube_subscribers = parseNumberOr(
      formData.get("youtube_subscribers"),
      0,
    );

    const file = formData.get("file") as File | null;

    console.log("Fields received:", {
      username,
      real_name,
      country,
      age,
      role,
      twitch_followers,
      youtube_subscribers,
      file: file?.name,
    });

    // Validate and normalize payload with Zod
    const payload: CreatePlayerInput = CreatePlayerSchema.parse({
      username,
      real_name,
      country,
      age,
      role,
      twitch_followers,
      youtube_subscribers,
    });

    let avatar_url: string | undefined = undefined;

    // Optional avatar upload handling
    if (file) {
      console.log("Uploading avatar file:", file.name);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure upload directory exists
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "avatar",
      );
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate unique filename (timestamp + random UUID)
      const ext = path.extname(file.name) || ".png";
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Write file to disk
      await fs.writeFile(filePath, buffer);
      console.log("Avatar saved:", filePath);

      // Public URL to be used by the frontend
      avatar_url = `/uploads/avatar/${uniqueName}`;
    } else {
      console.log("No avatar file uploaded");
    }

    console.log("🗄️ Creating player record in database...");
    const player = await prisma.players.create({
      data: {
        username: payload.username,
        real_name: payload.real_name,
        country: payload.country,
        age: payload.age,
        role: payload.role,
        twitch_followers: payload.twitch_followers,
        youtube_subscribers: payload.youtube_subscribers,
        avatar_url,
      },
    });

    console.log("Player created successfully:", player.id);
    return NextResponse.json<players>(player);
  } catch (error: unknown) {
    console.error("Error in POST /api/players:", error);

    // Validation error from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Known Error instance
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fallback for unknown error shapes
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

/**
 * GET /api/players
 *
 * Returns all players ordered by creation date (descending).
 * Useful for listing leaderboard/roster in admin UI or public pages.
 */
export async function GET() {
  try {
    console.log("GET /api/players");
    const players = await prisma.players.findMany({
      orderBy: { created_at: "desc" },
    });
    console.log(`${players.length} players retrieved`);
    return NextResponse.json<players[]>(players);
  } catch (error: unknown) {
    console.error("Error in GET /api/players:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/players/[id]
 *
 * Deletes a player by ID with safety checks:
 * 1. Validate route param (UUID).
 * 2. Ensure the player exists.
 * 3. Check if the player is linked to any team_players:
 *    - If linked > 0 → return 400 and do NOT delete.
 * 4. If the player has an avatar:
 *    - Try to delete the file from /public.
 *    - If the file is missing, log a warning but don't fail the request.
 * 5. Delete the player row.
 * 6. Return { success: true } on success.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: PlayerRouteParams },
) {
  try {
    const { id } = PlayerParamsSchema.parse(params);

    console.log(`DELETE /api/players/${id}`);

    // Ensure player exists
    const player = await prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 },
      );
    }

    // Prevent deletion if player is still linked to a team
    const linked = await prisma.team_players.count({
      where: { player_id: id },
    });

    if (linked > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer ce joueur : il est encore assigné à une équipe.",
        },
        { status: 400 },
      );
    }

    // If an avatar is set, try to delete the file from disk
    if (player.avatar_url) {
      const filePath = path.join(process.cwd(), "public", player.avatar_url);

      try {
        await fs.unlink(filePath);
        console.log("Avatar deleted:", filePath);
      } catch {
        // If the file is already gone, don't break the deletion flow
        console.warn(
          "Avatar file not found or already deleted:",
          filePath,
        );
      }
    }

    // Finally delete the player record
    await prisma.players.delete({
      where: { id },
    });

    console.log(`Player ${id} deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/players/[id]:", error);

    // Params validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

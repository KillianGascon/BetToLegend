import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import type { players } from "@prisma/client";

/**
 * Schema used to validate and normalize player creation payload.
 *
 * Fields:
 * - username: required non-empty string
 * - real_name: optional/nullable string
 * - country: 2-char country code, defaults to "FR"
 * - age: optional/nullable non-negative integer
 * - role: optional/nullable string (e.g. "IGL", "Support", etc.)
 * - twitch_followers: required non-negative integer
 * - youtube_subscribers: required non-negative integer
 */
const CreatePlayerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  real_name: z.string().nullable().optional(),
  country: z.string().length(2).default("FR"),
  age: z.number().int().min(0).nullable().optional(),
  role: z.string().nullable().optional(),
  twitch_followers: z.number().int().min(0),
  youtube_subscribers: z.number().int().min(0),
});

type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;

/**
 * Helper: safely parse a numeric value from FormData,
 * returning a fallback if:
 * - value is missing
 * - value is not a string
 * - value is NaN
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
 * Helper: parse a numeric value from FormData into number | null.
 * Returns null if:
 * - value is missing
 * - value is not a string
 * - value is empty
 * - value is NaN
 */
function parseNumberOrNull(value: FormDataEntryValue | null): number | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

/**
 * POST /api/players
 *
 * Creates a new player from multipart/form-data.
 *
 * Expected fields:
 * - username (string)
 * - real_name? (string)
 * - country? (string, 2 letters, default "FR")
 * - age? (number)
 * - role? (string)
 * - twitch_followers (number)
 * - youtube_subscribers (number)
 * - file? (File — avatar image)
 *
 * Flow:
 * 1. Parse FormData from the request.
 * 2. Extract and coerce primitive values.
 * 3. Validate using Zod (CreatePlayerSchema).
 * 4. If file is present:
 *    - Save to /public/uploads/avatar with a unique filename.
 *    - Store public avatar_url.
 * 5. Create player in DB with Prisma.
 * 6. Return created player as JSON.
 *
 * Error handling:
 * - ZodError → 400 with validation issues.
 * - Other Error → 500 with message.
 * - Unknown error shape → 500 with generic message.
 */
export async function POST(req: Request) {
  try {
    // Parse multipart/form-data from the incoming request
    const formData = await req.formData();

    // Raw values from the FormData
    const username = formData.get("username") as string | null;
    const real_name = formData.get("real_name") as string | null;
    const country = (formData.get("country") as string | null) ?? "FR";
    const age = parseNumberOrNull(formData.get("age"));
    const role = formData.get("role") as string | null;

    // Numeric fields with safe parsing and reasonable defaults
    const twitch_followers = parseNumberOr(
      formData.get("twitch_followers"),
      0,
    );
    const youtube_subscribers = parseNumberOr(
      formData.get("youtube_subscribers"),
      0,
    );

    // Optional avatar file
    const file = formData.get("file") as File | null;

    // Validate and normalize payload using Zod
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

    // If an avatar file is provided, persist it to disk and build a public URL
    if (file) {
      // Read file into a Buffer
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

      // Choose extension based on original filename, fallback to .png
      const ext = path.extname(file.name) || ".png";

      // Unique filename to avoid collisions
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Write the file to disk
      await fs.writeFile(filePath, buffer);

      // Public URL for serving the avatar
      avatar_url = `/uploads/avatar/${uniqueName}`;
    }

    // Create the player record in the database
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

    // Return the created player
    return NextResponse.json<players>(player);
  } catch (error) {
    // Validation error from Zod (invalid payload)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Known Error instance (e.g. FS/DB failure)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fallback for unexpected error shapes
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

/**
 * GET /api/players
 *
 * Returns a list of players ordered by creation date (newest first).
 * Used for:
 * - Admin list views
 * - Public rosters / leaderboards
 */
export async function GET() {
  try {
    const playersList = await prisma.players.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json<players[]>(playersList);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

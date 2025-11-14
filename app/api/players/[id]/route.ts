import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import type { players } from "@prisma/client";

const PlayerParamsSchema = z.object({
  id: z.string().uuid("Invalid player id"),
});
type PlayerRouteParams = z.infer<typeof PlayerParamsSchema>;

const UpdatePlayerSchema = z.object({
  username: z.string().min(1).optional(),
  real_name: z.string().nullable().optional(),
  country: z.string().length(2).optional(),
  age: z.number().int().min(0).nullable().optional(),
  role: z.string().nullable().optional(),
  twitch_followers: z.number().int().min(0).optional(),
  youtube_subscribers: z.number().int().min(0).optional(),
});
type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>;

function parseNumberOrNull(value: FormDataEntryValue | null): number | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function parseNumberOpt(value: FormDataEntryValue | null): number | undefined {
  if (!value || typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

async function deleteAvatarIfExists(relativePath: string | null | undefined) {
  if (!relativePath) return;
  const filePath = path.join(process.cwd(), "public", relativePath);
  try {
    await fs.unlink(filePath);
    console.log("Avatar deleted:", filePath);
  } catch {
    console.warn("Avatar file not found or already deleted:", filePath);
  }
}

async function saveNewAvatar(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatar");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".png";
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.writeFile(filePath, buffer);

  return `/uploads/avatar/${uniqueName}`;
}

export async function GET(
  _req: Request,
  { params }: { params: PlayerRouteParams },
) {
  try {
    const { id } = PlayerParamsSchema.parse(params);

    const player = await prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<players>(player);
  } catch (error: unknown) {
    console.error("Error in GET /api/players/[id]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: PlayerRouteParams },
) {
  try {
    const { id } = PlayerParamsSchema.parse(params);

    const formData = await req.formData();

    const username = formData.get("username") as string | null;
    const real_name = formData.get("real_name") as string | null;
    const country = formData.get("country") as string | null;
    const age = parseNumberOrNull(formData.get("age"));
    const role = formData.get("role") as string | null;
    const twitch_followers = parseNumberOpt(formData.get("twitch_followers"));
    const youtube_subscribers = parseNumberOpt(
      formData.get("youtube_subscribers"),
    );
    const file = formData.get("file") as File | null;

    const payload: UpdatePlayerInput = UpdatePlayerSchema.parse({
      username: username ?? undefined,
      real_name,
      country: country ?? undefined,
      age,
      role,
      twitch_followers,
      youtube_subscribers,
    });

    const existing = await prisma.players.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 },
      );
    }

    let avatar_url = existing.avatar_url;

    if (file) {
      await deleteAvatarIfExists(existing.avatar_url);
      avatar_url = await saveNewAvatar(file);
    }

    const updated = await prisma.players.update({
      where: { id },
      data: {
        username: payload.username ?? undefined,
        real_name: payload.real_name ?? undefined,
        country: payload.country ?? undefined,
        age: payload.age ?? undefined,
        role: payload.role ?? undefined,
        twitch_followers: payload.twitch_followers ?? undefined,
        youtube_subscribers: payload.youtube_subscribers ?? undefined,
        avatar_url,
      },
    });

    return NextResponse.json<players>(updated);
  } catch (error: unknown) {
    console.error("Error in PUT /api/players/[id]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: PlayerRouteParams },
) {
  try {
    const { id } = PlayerParamsSchema.parse(params);

    const player = await prisma.players.findUnique({
      where: { id },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 },
      );
    }

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

    await deleteAvatarIfExists(player.avatar_url);

    await prisma.players.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/players/[id]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

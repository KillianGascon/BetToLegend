import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import type { teams } from "@prisma/client";

/**
 * Delete a file from the local /public directory.
 * - filePath is expected to be a public path like `/uploads/xxx.png`.
 * - We join it with process.cwd()/public to get the absolute path.
 * - Errors (file missing, etc.) are swallowed, only logged as warnings.
 */
async function deleteLocalFile(filePath: string) {
  try {
    const absolutePath = path.join(process.cwd(), "public", filePath);
    await fs.unlink(absolutePath);
    console.log("File deleted:", absolutePath);
  } catch {
    console.warn("File not found or already deleted:", filePath);
  }
}

/**
 * Save an uploaded File to /public/uploads and return a public URL.
 *
 * - Normalizes filename:
 *   * Sanitizes base name to [a-z0-9_-].
 *   * Appends timestamp + crypto UUID to avoid collisions.
 * - Returns a string like `/uploads/<uniqueName.ext>` that can be used in src attributes.
 */
async function saveLocalFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".png";
  const base = path.basename(file.name, ext);
  const safeBase = base.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
  const uniqueName = `${Date.now()}_${crypto.randomUUID()}_${safeBase}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  await fs.writeFile(filePath, buffer);
  console.log("New file saved:", filePath);

  // Public path (used by frontend)
  return `/uploads/${uniqueName}`;
}

/**
 * Route params schema for /api/teams/[id]
 * - Ensures "id" is a valid UUID.
 */
const TeamParamsSchema = z.object({
  id: z.uuid("Invalid team id"),
});

type TeamRouteParams = z.infer<typeof TeamParamsSchema>;

/**
 * First-pass schema for raw form fields.
 * This accepts the raw string/null values coming from FormData.
 *
 * - All fields optional/nullable strings (no transformation yet).
 */
const UpdateTeamRawSchema = z.object({
  name: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  founded_year: z.string().optional().nullable(),
});

type UpdateTeamRaw = z.infer<typeof UpdateTeamRawSchema>;

/**
 * Final schema used after normalizing raw strings:
 * - name: optional, non-empty string
 * - tag: optional, non-empty string
 * - country: optional 2-letter country code
 * - founded_year: optional/nullable integer between 1800 and 3000
 */
const UpdateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  tag: z.string().min(1).optional(),
  country: z.string().length(2).optional(),
  founded_year: z.number().int().min(1800).max(3000).nullable().optional(),
});

type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;

/**
 * GET /api/teams/[id]
 *
 * Returns a single team by ID.
 * - Validates route params.
 * - Fetches the team from DB.
 * - 404 if not found.
 * - 400 on validation error.
 * - 500 on server error.
 */
export async function GET(
  _req: Request,
  { params }: { params: TeamRouteParams },
) {
  try {
    const { id } = TeamParamsSchema.parse(params);

    const team = await prisma.teams.findUnique({
      where: { id },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<teams>(team);
  } catch (error: unknown) {
    console.error("Error in GET /api/teams/[id]:", error);

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

/**
 * PUT /api/teams/[id]
 *
 * Update a team with multipart/form-data:
 * - Text fields: name, tag, country, founded_year (as string).
 * - Optional file: logo image.
 *
 * Flow:
 * 1. Validate route params.
 * 2. Parse formData.
 * 3. Build raw object and validate with UpdateTeamRawSchema.
 * 4. Normalize:
 *    - Map nulls to undefined where needed.
 *    - founded_year: string → number | null (or undefined if not provided).
 * 5. Validate again with UpdateTeamSchema to enforce types/ranges.
 * 6. Check founded_year is not NaN if not null.
 * 7. Fetch existing team:
 *    - 404 if not found.
 * 8. If new file provided:
 *    - Delete old logo file (if any).
 *    - Save new file and set logo_url.
 * 9. Update team with Prisma.
 */
export async function PUT(
  req: Request,
  { params }: { params: TeamRouteParams },
) {
  try {
    const { id } = TeamParamsSchema.parse(params);
    const formData = await req.formData();

    // Raw form values as nullable strings
    const raw: UpdateTeamRaw = UpdateTeamRawSchema.parse({
      name: formData.get("name"),
      tag: formData.get("tag"),
      country: formData.get("country"),
      founded_year: formData.get("founded_year"),
    });

    // Normalize raw values and transform founded_year into number | null
    const parsed: UpdateTeamInput = UpdateTeamSchema.parse({
      name: raw.name ?? undefined,
      tag: raw.tag ?? undefined,
      country: raw.country ?? undefined,
      founded_year:
        raw.founded_year && raw.founded_year.trim() !== ""
          ? Number(raw.founded_year)
          : null,
    });

    // Extra guard against NaN founded_year
    if (
      parsed.founded_year !== null &&
      parsed.founded_year !== undefined &&
      Number.isNaN(parsed.founded_year)
    ) {
      return NextResponse.json(
        { error: "Invalid founded_year" },
        { status: 400 },
      );
    }

    const file = formData.get("file") as File | null;

    // Ensure team exists before performing FS operations
    const existingTeam = await prisma.teams.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 },
      );
    }

    let logo_url = existingTeam.logo_url;

    // Handle logo replacement
    if (file) {
      // Remove old logo if present
      if (existingTeam.logo_url) {
        await deleteLocalFile(existingTeam.logo_url);
      }
      // Save new logo and set its URL
      logo_url = await saveLocalFile(file);
    }

    // Update only the provided fields
    const updatedTeam = await prisma.teams.update({
      where: { id },
      data: {
        name: parsed.name ?? undefined,
        tag: parsed.tag ?? undefined,
        country: parsed.country ?? undefined,
        founded_year: parsed.founded_year ?? undefined,
        logo_url,
      },
    });

    return NextResponse.json<teams>(updatedTeam);
  } catch (error: unknown) {
    console.error("Error in PUT /api/teams/[id]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      // Prisma unique constraint (e.g. unique tag)
      if ((error as any).code === "P2002") {
        return NextResponse.json(
          { error: "A team with this tag already exists." },
          { status: 400 },
        );
      }

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

/**
 * DELETE /api/teams/[id]
 *
 * Deletes a team and its logo file if present.
 *
 * Flow:
 * 1. Validate route params.
 * 2. Fetch team; return 404 if not found.
 * 3. If team has a logo_url:
 *    - Delete the corresponding file from /public.
 * 4. Delete team row from DB.
 * 5. Return { success: true } on success.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: TeamRouteParams },
) {
  try {
    const { id } = TeamParamsSchema.parse(params);

    const team = await prisma.teams.findUnique({
      where: { id },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 },
      );
    }

    // Delete logo file if it exists
    if (team.logo_url) {
      await deleteLocalFile(team.logo_url);
    }

    // Delete team from DB
    await prisma.teams.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/teams/[id]:", error);

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

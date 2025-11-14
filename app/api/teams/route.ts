import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import type { teams } from "@prisma/client";

/**
 * Helper to safely parse a number (from FormData) into number | null.
 *
 * - Returns null if:
 *   * value is missing
 *   * value is not a string
 *   * value is empty
 *   * parsed number is NaN
 */
function parseNumberOrNull(v: FormDataEntryValue | null): number | null {
  if (!v || typeof v !== "string" || v.trim() === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

/**
 * Raw schema used for the initial pass on formData values.
 * This accepts nullable strings straight from FormData.
 */
const CreateTeamRawSchema = z.object({
  name: z.string().nullable().optional(),
  tag: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  founded_year: z.string().nullable().optional(),
});

type CreateTeamRaw = z.infer<typeof CreateTeamRawSchema>;

/**
 * Final schema for team creation after normalization.
 *
 * - name: required non-empty string
 * - tag: required non-empty string
 * - country: optional 2-letter string (country code)
 * - founded_year: optional/nullable int in [1800, 3000]
 */
const CreateTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tag: z.string().min(1, "Tag is required"),
  country: z.string().length(2).optional(),
  founded_year: z.number().int().min(1800).max(3000).nullable().optional(),
});

type CreateTeamInput = z.infer<typeof CreateTeamSchema>;

/**
 * POST /api/teams
 *
 * Creates a new team from multipart/form-data.
 *
 * Expected fields:
 * - name (string, required)
 * - tag (string, required)
 * - country? (string, 2 letters)
 * - founded_year? (string, parsed as number)
 * - file? (File, optional logo)
 *
 * Flow:
 * 1. Parse formData from the request.
 * 2. Build a raw object and validate with CreateTeamRawSchema.
 * 3. Convert founded_year string → number | null using parseNumberOrNull.
 * 4. Validate final payload with CreateTeamSchema:
 *    - Enforces required fields + constraints.
 * 5. If a file is provided:
 *    - Save to /public/uploads with a unique filename.
 *    - Build logo_url pointing to that path.
 * 6. Create team in DB via Prisma.
 * 7. Return the created team as JSON.
 *
 * Error handling:
 * - ZodError → 400 with validation issues.
 * - Prisma unique constraint (P2002) → 400 with custom message.
 * - Other errors → 500.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Raw values as strings/null directly from the FormData
    const raw: CreateTeamRaw = CreateTeamRawSchema.parse({
      name: formData.get("name"),
      tag: formData.get("tag"),
      country: formData.get("country"),
      founded_year: formData.get("founded_year"),
    });

    // Convert founded_year string into number | null
    const foundedYearNumber = raw.founded_year
      ? parseNumberOrNull(raw.founded_year)
      : null;

    // Validate final payload with strong constraints
    const payload: CreateTeamInput = CreateTeamSchema.parse({
      name: raw.name ?? "",
      tag: raw.tag ?? "",
      country: raw.country ?? undefined,
      founded_year: foundedYearNumber,
    });

    let logo_url: string | undefined;

    const file = formData.get("file") as File | null;

    // Optional logo upload handling
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = path.extname(file.name) || ".png";
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await fs.writeFile(filePath, buffer);

      // Public URL consumed by frontend
      logo_url = `/uploads/${uniqueName}`;
    }

    // Persist new team in database
    const team = await prisma.teams.create({
      data: {
        name: payload.name,
        tag: payload.tag,
        country: payload.country ?? undefined,
        founded_year: payload.founded_year ?? undefined,
        logo_url,
      },
    });

    return NextResponse.json<teams>(team);
  } catch (error: unknown) {
    console.error("Error in POST /api/teams:", error);

    // Validation error from Zod
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

      // Generic server error with error.message
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fallback unknown error shape
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

/**
 * GET /api/teams
 *
 * Returns all teams.
 * - Simple list endpoint.
 * - No relations included.
 */
export async function GET() {
  try {
    const teamsList = await prisma.teams.findMany();
    return NextResponse.json<teams[]>(teamsList);
  } catch (error: unknown) {
    console.error("Error in GET /api/teams:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
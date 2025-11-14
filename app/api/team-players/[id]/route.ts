import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { team_players } from "@prisma/client";

/**
 * Route params schema for /api/team-players/[id]
 * - Ensures "id" is a valid UUID.
 */
const TeamPlayerParamsSchema = z.object({
  id: z.uuid("Invalid team_players id"),
});

type TeamPlayerRouteParams = z.infer<typeof TeamPlayerParamsSchema>;

/**
 * Schema for updating a team_players record.
 *
 * All fields are optional to support partial updates:
 * - position: optional non-empty string
 * - salary: optional number or string (will be coerced to number)
 * - join_date: optional/nullable string or Date (converted to Date)
 * - is_active: optional boolean
 */
const UpdateTeamPlayerSchema = z.object({
  position: z.string().min(1).optional(),
  salary: z.union([z.number(), z.string()]).optional(),
  join_date: z.union([z.string(), z.date()]).nullable().optional(),
  is_active: z.boolean().optional(),
});

type UpdateTeamPlayerInput = z.infer<typeof UpdateTeamPlayerSchema>;

/**
 * PUT /api/team-players/[id]
 *
 * Partially update a team-player link.
 *
 * Flow:
 * 1. Validate params (id).
 * 2. Parse JSON body and validate with Zod.
 * 3. Normalize:
 *    - join_date → Date | null
 *    - salary (string/number) → number | undefined (ignored if NaN)
 * 4. Perform prisma.team_players.update with only provided fields.
 * 5. Return updated row.
 *
 * Error handling:
 * - ZodError → 400 with validation details.
 * - Other Error → 500 with message.
 * - Unknown shape → 500 generic.
 */
export async function PUT(
  req: Request,
  { params }: { params: TeamPlayerRouteParams },
) {
  try {
    // Validate route params
    const { id } = TeamPlayerParamsSchema.parse(params);

    // Parse request body
    const json = await req.json();

    // Validate and coerce body
    const data = UpdateTeamPlayerSchema.parse(json) as UpdateTeamPlayerInput;

    // Normalize join_date: string/Date → Date | null
    const parsedDate =
      data.join_date && data.join_date !== null
        ? new Date(data.join_date as any)
        : null;

    // Normalize salary: string/number → number | undefined
    const salaryNumber =
      data.salary !== undefined
        ? typeof data.salary === "string"
          ? Number(data.salary)
          : data.salary
        : undefined;

    // Update only fields that are actually provided / valid
    const updated = await prisma.team_players.update({
      where: { id },
      data: {
        position: data.position ?? undefined,
        salary:
          salaryNumber !== undefined && !Number.isNaN(salaryNumber)
            ? salaryNumber
            : undefined,
        join_date: parsedDate,
        is_active:
          typeof data.is_active === "boolean" ? data.is_active : undefined,
      },
    });

    return NextResponse.json<team_players>(updated);
  } catch (error: unknown) {
    console.error("Error in PUT /api/team-players/[id]:", error);

    // Body/params validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    // Known error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    // Fallback for unknown error shape
    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/team-players/[id]
 *
 * Deletes a team_players record by ID.
 *
 * Flow:
 * 1. Validate params (id).
 * 2. Delete the row via Prisma.
 * 3. Return { success: true } on success.
 *
 * Error handling:
 * - ZodError → 400 with validation issues.
 * - Other Error → 500 with message.
 * - Unknown error shape → 500 generic.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: TeamPlayerRouteParams },
) {
  try {
    // Validate route params
    const { id } = TeamPlayerParamsSchema.parse(params);

    // Hard delete the team-player association
    await prisma.team_players.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/team-players/[id]:", error);

    // Params validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    // Known error instance
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    // Fallback for unknown error shape
    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

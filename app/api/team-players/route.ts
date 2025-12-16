import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Schema for creating a team_players relation.
 *
 * Fields:
 * - team_id: required UUID (team)
 * - player_id: required UUID (player)
 * - position: optional non-empty string (role within team)
 * - salary: optional number or string (coerced to number)
 * - join_date: optional/nullable string or Date (coerced to Date)
 */
const CreateTeamPlayerSchema = z.object({
  team_id: z.uuid("Invalid team_id"),
  player_id: z.uuid("Invalid player_id"),
  position: z.string().min(1).optional(),
  salary: z.union([z.number(), z.string()]).optional(),
  join_date: z.union([z.string(), z.date()]).nullable().optional(),
});

type CreateTeamPlayerInput = z.infer<typeof CreateTeamPlayerSchema>;

/**
 * POST /api/team-players
 *
 * Creates a new relation between a team and a player.
 *
 * Flow:
 * 1. Parse JSON body.
 * 2. Validate with Zod.
 * 3. Check if the (team_id, player_id) relation already exists:
 *    - If yes → 400 "Player is already in this team".
 * 4. Normalize join_date and salary:
 *    - join_date → Date | null.
 *    - salary (string/number) → number | null, ignore NaN.
 * 5. Create team_players row with:
 *    - is_active = true by default.
 *    - include linked players & teams for richer response.
 */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = CreateTeamPlayerSchema.parse(json) as CreateTeamPlayerInput;

    const { team_id, player_id, position, salary, join_date } = body;

    // Ensure uniqueness of the relation by composite key
    const existing = await prisma.team_players.findUnique({
      where: { team_id_player_id: { team_id, player_id } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Player is already in this team" },
        { status: 400 },
      );
    }

    // Coerce join_date into Date | null
    const parsedDate =
      join_date && join_date !== null ? new Date(join_date as any) : null;

    // Coerce salary into number | null
    const salaryNumber =
      salary !== undefined
        ? typeof salary === "string"
          ? Number(salary)
          : salary
        : null;

    const teamPlayer = await prisma.team_players.create({
      data: {
        team_id,
        player_id,
        position: position ?? null,
        salary:
          salaryNumber !== null && !Number.isNaN(salaryNumber)
            ? salaryNumber
            : null,
        join_date: parsedDate,
        is_active: true,
      },
      include: {
        players: true,
        teams: true,
      },
    });

    return NextResponse.json(teamPlayer);
  } catch (error: unknown) {
    console.error("Error in POST /api/team-players:", error);

    // Body validation failed
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    // Other known error shape
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    // Fallback
    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/team-players
 *
 * Returns all team-player relations:
 * - Includes both team and player entities for each relation.
 * - Ordered by join_date descending (most recent first).
 */
export async function GET() {
  try {
    const relations = await prisma.team_players.findMany({
      include: {
        players: true,
        teams: true,
      },
      orderBy: { join_date: "desc" },
    });

    return NextResponse.json(relations);
  } catch (error: unknown) {
    console.error("Error in GET /api/team-players:", error);

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

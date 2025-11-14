import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 📦 POST /api/team-players
 * Create a new player–team relationship (add a player to a team).
 */
export async function POST(req: Request) {
    try {
        console.log("📥 Incoming POST request to /api/team-players");
        const body = await req.json();
        const { team_id, player_id, position, salary, join_date } = body;

        console.log("📄 Received data:", body);

        // Validate required fields
        if (!team_id || !player_id) {
            console.warn("⚠️ Missing team_id or player_id");
            return NextResponse.json(
                { error: "team_id and player_id are required" },
                { status: 400 }
            );
        }

        // Check if the player is already assigned to this team
        const existing = await prisma.team_players.findUnique({
            where: { team_id_player_id: { team_id, player_id } },
        });

        if (existing) {
            console.warn("⚠️ Player is already in this team");
            return NextResponse.json(
                { error: "Player is already in this team" },
                { status: 400 }
            );
        }

        // Parse join_date if provided, or set to null
        const parsedDate = join_date ? new Date(join_date) : null;

        // Create the new team–player record
        const teamPlayer = await prisma.team_players.create({
            data: {
                team_id,
                player_id,
                position: position || null,
                salary: salary ? Number(salary) : null,
                join_date: parsedDate, // Will remain null if not provided
                is_active: true,
            },
            include: {
                players: true,
                teams: true,
            },
        });

        console.log("✅ Player successfully added to team:", teamPlayer.id);
        return NextResponse.json(teamPlayer);
    } catch (error: unknown) {
        console.error("❌ Error in POST /api/team-players:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 📋 GET /api/team-players
 * Retrieve all player–team relationships.
 */
export async function GET() {
    try {
        console.log("📥 Incoming GET request to /api/team-players");

        // Fetch all player–team relations with player and team details
        const relations = await prisma.team_players.findMany({
            include: {
                players: true,
                teams: true,
            },
            orderBy: { join_date: "desc" },
        });

        console.log(`✅ ${relations.length} team-player relations retrieved`);
        return NextResponse.json(relations);
    } catch (error: unknown) {
        console.error("❌ Error in GET /api/team-players:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

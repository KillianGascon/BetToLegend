import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
/**
 * 🎮 POST /api/matches
 * Create a new match + seed match_odds (2.00/2.00) atomiquement.
 */
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const {
        tournament_id,
        team1_id,
        team2_id,
        game_id,
        match_date,
        status,
        team1_score,
        team2_score,
        winner_id,
        format,
      } = body;
  
      const START_ODDS = new Decimal(1.0);
  
      const result = await prisma.$transaction(async (tx) => {
        const match = await tx.matches.create({
          data: {
            tournament_id: tournament_id || null,
            team1_id: team1_id || null,
            team2_id: team2_id || null,
            game_id: game_id || null,
            match_date: match_date ? new Date(match_date) : null,
            status: status || "scheduled",
            team1_score: team1_score ?? 0,
            team2_score: team2_score ?? 0,
            winner_id: winner_id || null,
            format: format || null,
          },
          select: { id: true, team1_id: true, team2_id: true },
        });
  
        // Seed odds si équipes présentes
        const rows: Array<{ match_id: string; team_id: string; odds: any }> = [];
        if (match.team1_id) rows.push({ match_id: match.id, team_id: match.team1_id, odds: START_ODDS });
        if (match.team2_id) rows.push({ match_id: match.id, team_id: match.team2_id, odds: START_ODDS });
  
        if (rows.length) {
          await tx.match_odds.createMany({ data: rows, skipDuplicates: true });
        }
  
        // Retourne le match complet (avec odds)
        return tx.matches.findUnique({
          where: { id: match.id },
          include: {
            teams_matches_team1_idToteams: true,
            teams_matches_team2_idToteams: true,
            teams_matches_winner_idToteams: true,
            games: true,
            tournaments: true,
            match_odds: { include: { teams: true } },
          },
        });
      });
  
      return NextResponse.json(result, { status: 201 });
    } catch (error: unknown) {
      console.error("❌ Error in POST /api/matches:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

/**
 * 📋 GET /api/matches
 * Retrieve a list of all matches, including related teams and winner.
 */
export async function GET() {
    try {
        // Fetch all matches with team relationships and sort by creation date
        const matches = await prisma.matches.findMany({
            include: {
                teams_matches_team1_idToteams: true, // Team 1 info
                teams_matches_team2_idToteams: true, // Team 2 info
                teams_matches_winner_idToteams: true, // Winner info
                games: true, // Game info
                tournaments: true, // Tournament info
                match_odds: {
                    include: {
                        teams: true, // Team info for odds
                    }
                }, // Match odds
            },
            orderBy: { match_date: "asc" },
        });

        // Return the list of matches as JSON
        return NextResponse.json(matches);
    } catch (error: unknown) {
        // Log error for debugging
        console.error("❌ Error in GET /api/matches:", error);

        // Return an appropriate error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

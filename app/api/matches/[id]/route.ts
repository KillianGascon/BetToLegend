
/**
 * 🎮 GET /api/matches/[id]
 * Retrieve detailed information for a single match.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // Fetch the match by ID, including team relations (team1, team2, winner)
        const match = await prisma.matches.findUnique({
            where: { id: params.id },
            include: {
                teams_matches_team1_idToteams: true,
                teams_matches_team2_idToteams: true,
                teams_matches_winner_idToteams: true,
                games: true,
                tournaments: true,
                match_odds: {
                    include: {
                        teams: true,
                    }
                },
            },
        });

        // Return a 404 response if the match was not found
        if (!match) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 });
        }

        // Return the match as JSON
        return NextResponse.json(match);
    } catch (error: unknown) {
        // Log the error for debugging
        console.error("❌ Error in GET /api/matches/[id]:", error);

        // Return an appropriate error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}
    
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * ✏️ PUT /api/matches/[id]
 * Met à jour le match et synchronise match_odds si team1_id/team2_id changent.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    // Normalise uniquement les champs fournis
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

    const START_ODDS = new Decimal(2.0);

    const updated = await prisma.$transaction(async (tx) => {
      // Récup état actuel pour comparer
      const before = await tx.matches.findUnique({
        where: { id: params.id },
        select: { id: true, team1_id: true, team2_id: true },
      });
      if (!before) throw new Error("Match not found");

      // Construire data d'update
      const data: any = {};
      if (tournament_id !== undefined) data.tournament_id = tournament_id;
      if (team1_id !== undefined) data.team1_id = team1_id;
      if (team2_id !== undefined) data.team2_id = team2_id;
      if (game_id !== undefined) data.game_id = game_id;
      if (match_date !== undefined) data.match_date = match_date ? new Date(match_date) : null;
      if (status !== undefined) data.status = status;
      if (team1_score !== undefined) data.team1_score = team1_score;
      if (team2_score !== undefined) data.team2_score = team2_score;
      if (winner_id !== undefined) data.winner_id = winner_id;
      if (format !== undefined) data.format = format;

      const after = await tx.matches.update({
        where: { id: params.id },
        data,
        select: { id: true, team1_id: true, team2_id: true },
      });

      // Synchronisation match_odds :
      // - Créer les odds manquantes pour nouvelles équipes (2.00).
      // - Supprimer les odds orphelines si une équipe a changé (optionnel).
      const desired = new Set<string>([after.team1_id, after.team2_id].filter(Boolean) as string[]);
      const existing = await tx.match_odds.findMany({
        where: { match_id: after.id },
        select: { id: true, team_id: true },
      });
      const existingSet = new Set(existing.map((r) => r.team_id));

      // Créer manquants
      for (const tid of desired) {
        if (!existingSet.has(tid)) {
          await tx.match_odds.create({
            data: { match_id: after.id, team_id: tid, odds: START_ODDS },
          });
        }
      }

      // Option : supprimer les odds orphelines (si équipe remplacée)
      for (const row of existing) {
        if (!desired.has(row.team_id)) {
          await tx.match_odds.delete({ where: { id: row.id } });
        }
      }

      // Retourner le match complet
      return tx.matches.findUnique({
        where: { id: after.id },
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

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("❌ Error in PUT /api/matches/[id]:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


/**
 * 🗑️ DELETE /api/matches/[id]
 * Permanently delete a match from the database.
 */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Remove the match by its ID
        await prisma.matches.delete({
            where: { id: params.id },
        });

        // Return a success response
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        // Log the error for debugging
        console.error("❌ Error in DELETE /api/matches/[id]:", error);

        // Return an appropriate error message
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

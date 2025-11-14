import type { Decimal } from "@prisma/client/runtime/library";
import type { matches, match_odds, teams, games } from "@prisma/client";

export type MatchId = matches["id"];
export type TeamId = teams["id"];

// Si tu préfères fixer explicitement :
export type MatchStatus = "scheduled" | "live" | "completed";

/**
 * Match avec ses deux équipes + le jeu.
 * Correspond typiquement au `include` suivant :
 *
 * matches: {
 *   include: {
 *     teams_matches_team1_idToteams: true,
 *     teams_matches_team2_idToteams: true,
 *     games: true,
 *   }
 * }
 */
export interface MatchWithTeamsAndGame extends matches {
  teams_matches_team1_idToteams: teams;
  teams_matches_team2_idToteams: teams;
  games: games | null;
}

/**
 * Match avec ses cotes.
 */
export interface MatchWithOdds extends matches {
  match_odds: match_odds[];
}

/**
 * Match complet : équipes + jeu + cotes.
 */
export interface FullMatch extends matches {
  teams_matches_team1_idToteams: teams;
  teams_matches_team2_idToteams: teams;
  games: games | null;
  match_odds: match_odds[];
}

/**
 * Map des cotes par team_id pour un match.
 */
export type MatchOddsMap = Map<TeamId, Decimal>;

/**
 * Snapshot des volumes par équipe (utile pour logs & calculs).
 */
export interface MatchVolumeSnapshot {
  matchId: MatchId;
  volumes: Map<TeamId, Decimal>;
}

/**
 * Mouvement de volumes avant/après recalcul.
 */
export interface MatchVolumeMovement {
  matchId: MatchId;
  before: Map<TeamId, Decimal>;
  after: Map<TeamId, Decimal>;
}

/**
 * Résumé de match pour l’API (liste, UI, etc.)
 */
export interface MatchApiSummary {
  id: MatchId;
  status: MatchStatus;
  starts_at: Date | null;
  game_name: string | null;
  team1: {
    id: TeamId;
    name: string;
  };
  team2: {
    id: TeamId;
    name: string;
  };
  odds?: {
    [teamId: string]: Decimal;
  };
}
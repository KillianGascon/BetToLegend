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

  date: Date;
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


export type Team = {
  id: string;
  name: string;
  tag?: string;
  logo_url?: string;
  country?: string;
};

export type Tournament = {
  id: string;
  name: string;
  location?: string;
  status?: string;
};

export type RawMatch = {
  id: string;
  status?: string;
  match_date?: string | null;
  format?: string | null;
  team1_id?: string | null;
  team2_id?: string | null;
  team1_score?: number | null;
  team2_score?: number | null;
  teams_matches_team1_idToteams?: Team | null;
  teams_matches_team2_idToteams?: Team | null;
  teams_matches_winner_idToteams?: Team | null;
  games?: { id: string; name: string; category: string } | null;
  tournaments?: Tournament | null;
  match_odds?: { id: string; team_id: string; odds: number | string }[];
};

export type ViewMatch = {
  id: string;
  status: string;
  date: Date | null;
  format?: string;
  t1?: Team;
  t2?: Team;
  s1?: number;
  s2?: number;
  tour?: Tournament;
  odds: {
    team1?: number;
    team2?: number;
  };
};


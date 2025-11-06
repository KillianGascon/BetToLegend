// types/results.ts
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


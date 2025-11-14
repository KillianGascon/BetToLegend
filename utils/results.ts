// utils/results.ts
import type { RawMatch, ViewMatch } from "@/types/results";

export function parseNum(n?: number | string | null): number | undefined {
  if (n == null) return undefined;
  const v = typeof n === "string" ? Number.parseFloat(n) : n;
  return Number.isFinite(v) ? v : undefined;
}

export function toView(m: RawMatch): ViewMatch {
  const t1 = m.teams_matches_team1_idToteams ?? undefined;
  const t2 = m.teams_matches_team2_idToteams ?? undefined;
  const odds = (() => {
    if (!m.match_odds) return {};
    const f = (tid?: string | null) => m.match_odds!.find(o => o.team_id === tid)?.odds;
    return {
      team1: parseNum(f(m.team1_id)),
      team2: parseNum(f(m.team2_id)),
    };
  })();
  return {
    id: m.id,
    status: m.status ?? "scheduled",
    date: m.match_date ? new Date(m.match_date) : null,
    format: m.format ?? undefined,
    t1,
    t2,
    s1: m.team1_score ?? undefined,
    s2: m.team2_score ?? undefined,
    tour: m.tournaments ?? undefined,
    odds,
  };
}

export function groupBy<T>(arr: T[], key: (t: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const item of arr) {
    const k = key(item);
    const a = m.get(k);
    if (a) a.push(item);
    else m.set(k, [item]);
  }
  return m;
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}


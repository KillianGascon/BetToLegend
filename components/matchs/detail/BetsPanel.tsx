// components/matchs/detail/BetsPanel.tsx
"use client";
import StatusPill from "./StatusPill";

type Bet = {
  id: string;
  match_id: string;
  team_id: string;
  amount: number | string;
  odds: number | string;
  potential_payout?: number | string;
  status: "pending" | "won" | "lost" | string;
  placed_at?: string;
};

type Team = { id: string; name?: string };

const toNum = (v: unknown) => {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : undefined;
};

export default function BetsPanel({
  bets,
  team1,
  team2,
  loading,
  labels,
}: Readonly<{
  bets: Bet[];
  team1?: Team;
  team2?: Team;
  loading?: boolean;
  labels: {
    title: string;
    loading: string;
    empty: string;
    totalStake: string;
    totalPotential: string;
    stake: string;
    odds: string;
    potential: string;
    status: { won: string; lost: string; pending: string; unknown: string };
    currencySuffix: string;
  };
}>) {
  const totalStake = bets.reduce((s, b) => s + (toNum(b.amount) ?? 0), 0);
  const totalPotential = bets.reduce((s, b) => {
    const p = toNum(b.potential_payout);
    if (p !== undefined) return s + p;
    const amt = toNum(b.amount) ?? 0;
    const od = toNum(b.odds) ?? 0;
    return s + amt * od;
  }, 0);

  const teamName = (tid: string) => {
    if (tid === team1?.id) return team1?.name ?? "Équipe 1";
    if (tid === team2?.id) return team2?.name ?? "Équipe 2";
    return "Équipe";
    };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-white font-semibold">{labels.title}</h3>
        {loading && <span className="text-xs text-gray-400">{labels.loading}</span>}
      </div>

      {bets.length === 0 ? (
        <p className="text-gray-400 text-sm">{labels.empty}</p>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
            <span>{labels.totalStake}</span>
            <span className="text-white font-semibold">
              {totalStake.toFixed(2)}
              {labels.currencySuffix}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
            <span>{labels.totalPotential}</span>
            <span className="text-white font-semibold">
              {totalPotential.toFixed(2)}
              {labels.currencySuffix}
            </span>
          </div>

          <ul className="space-y-3">
            {bets.map((b) => {
              const amount = toNum(b.amount) ?? 0;
              const odds = toNum(b.odds) ?? 0;
              const payout = toNum(b.potential_payout) ?? amount * odds;
              const dt = b.placed_at ? new Date(b.placed_at).toLocaleString() : "";

              return (
                <li key={b.id} className="p-3 rounded-xl bg-gray-900 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{teamName(b.team_id)}</div>
                      <div className="text-gray-400 text-xs">{dt}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 text-sm">
                        {labels.stake}{" "}
                        <span className="text-white font-semibold">
                          {amount.toFixed(2)}
                          {labels.currencySuffix}
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {labels.odds}{" "}
                        <span className="text-white font-semibold">{odds.toFixed(2)}</span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {labels.potential}{" "}
                        <span className="text-white font-semibold">
                          {payout.toFixed(2)}
                          {labels.currencySuffix}
                        </span>
                      </div>
                      <div className="text-xs mt-1">
                        <StatusPill status={b.status} labels={labels.status} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}



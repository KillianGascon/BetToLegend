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
    <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-white font-montserrat font-bold text-lg sm:text-xl">{labels.title}</h3>
        {loading && (
          <span className="text-xs sm:text-sm text-white/60 font-montserrat">{labels.loading}</span>
        )}
      </div>

      {bets.length === 0 ? (
        <p className="text-white/70 font-montserrat text-sm sm:text-base">{labels.empty}</p>
      ) : (
        <>
          <div className="bg-white/5 rounded-[12px] p-4 mb-3">
            <div className="flex items-center justify-between text-sm sm:text-base mb-2">
              <span className="text-white/70 font-montserrat">{labels.totalStake}</span>
              <span className="text-white font-montserrat font-bold">
                {totalStake.toFixed(2)}
                {labels.currencySuffix}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-white/70 font-montserrat">{labels.totalPotential}</span>
              <span className="text-legend-red font-montserrat font-extrabold text-lg sm:text-xl">
                {totalPotential.toFixed(2)}
                {labels.currencySuffix}
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {bets.map((b) => {
              const amount = toNum(b.amount) ?? 0;
              const odds = toNum(b.odds) ?? 0;
              const payout = toNum(b.potential_payout) ?? amount * odds;
              const dt = b.placed_at ? new Date(b.placed_at).toLocaleString() : "";

              return (
                <li
                  key={b.id}
                  className="p-4 rounded-[12px] bg-white/5 border-2 border-white/10 hover:border-legend-blue transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-montserrat font-bold text-sm sm:text-base mb-1">
                        {teamName(b.team_id)}
                      </div>
                      <div className="text-white/60 font-montserrat text-xs">{dt}</div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <div className="text-white/70 font-montserrat text-xs sm:text-sm">
                          {labels.stake}{" "}
                          <span className="text-white font-montserrat font-semibold">
                            {amount.toFixed(2)}
                            {labels.currencySuffix}
                          </span>
                        </div>
                        <div className="text-white/70 font-montserrat text-xs sm:text-sm">
                          {labels.odds}{" "}
                          <span className="text-white font-montserrat font-semibold">
                            {odds.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-white/70 font-montserrat text-xs sm:text-sm">
                          {labels.potential}{" "}
                          <span className="text-legend-red font-montserrat font-extrabold">
                            {payout.toFixed(2)}
                            {labels.currencySuffix}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
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



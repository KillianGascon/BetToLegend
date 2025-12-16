// components/matchs/detail/Scoreboard.tsx
"use client";
import TeamCell, { Team } from "./TeamCell";

export default function Scoreboard({
  team1,
  team2,
  team1Score,
  team2Score,
  status,
  statusLabels,
}: Readonly<{
  team1?: Team | null;
  team2?: Team | null;
  team1Score?: number | null;
  team2Score?: number | null;
  status?: string;
  statusLabels: { live: string; scheduled: string; completed: string };
}>) {
  const statusLabel =
    status === "live"
      ? statusLabels.live
      : status === "scheduled"
      ? statusLabels.scheduled
      : statusLabels.completed;
  return (
    <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
      <div className="grid grid-cols-3 items-center gap-4 sm:gap-6">
        <TeamCell team={team1} align="left" />
        <div className="text-center">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-extrabold text-white mb-2">
            {(team1Score ?? 0)} — {(team2Score ?? 0)}
          </div>
          <div
            className={`inline-block px-3 py-1.5 rounded-[8px] text-xs sm:text-sm font-montserrat font-medium ${
              status === "live"
                ? "bg-legend-red text-white"
                : status === "scheduled"
                  ? "bg-legend-blue text-white"
                  : "bg-white/20 text-white/80"
            }`}
          >
            {statusLabel}
          </div>
        </div>
        <TeamCell team={team2} align="right" />
      </div>
    </div>
  );
}



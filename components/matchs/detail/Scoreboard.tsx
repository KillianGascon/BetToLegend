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
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      <div className="grid grid-cols-3 items-center">
        <TeamCell team={team1} align="left" />
        <div className="text-center">
          <div className="text-4xl font-extrabold text-white">
            {(team1Score ?? 0)} — {(team2Score ?? 0)}
          </div>
          <div className="text-gray-400 text-sm">{statusLabel}</div>
        </div>
        <TeamCell team={team2} align="right" />
      </div>
    </div>
  );
}



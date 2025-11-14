// components/results/MatchCard.tsx
"use client";
import Link from "next/link";
import TeamMini from "./TeamMini";
import type { ViewMatch } from "@/types/results";

export default function MatchCard({ match }: Readonly<{ match: ViewMatch }>) {
  const d = match.date ? match.date.toLocaleString() : "—";
  let statusLabel = "Programmé";
  if (match.status === "live") {
    statusLabel = "En direct";
  } else if (match.status === "finished") {
    statusLabel = "Terminé";
  }

  return (
    <Link
      href={`/matchs/${match.id}`}
      className="block bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:border-gray-600 transition focus:outline-none focus:ring-2 focus:ring-[#6a66ff]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{statusLabel}</span>
        <span className="text-xs text-gray-500">{d}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <TeamMini team={match.t1} score={match.s1} />
        <span className="text-xl font-bold">—</span>
        <TeamMini team={match.t2} score={match.s2} align="right" />
      </div>
      <div className="mt-3 text-xs text-gray-400">
        {match.tour?.name ?? "Tournoi"} • {match.format ?? "Format ?"}
      </div>
      {/* Odds inline if available */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <span className="text-gray-400">Cote {match.t1?.tag ?? match.t1?.name ?? "Équipe 1"}</span>
        <span className="text-right">{match.odds?.team1 ? match.odds.team1.toFixed(2) : "—"}</span>
        <span className="text-gray-400">Cote {match.t2?.tag ?? match.t2?.name ?? "Équipe 2"}</span>
        <span className="text-right">{match.odds?.team2 ? match.odds.team2.toFixed(2) : "—"}</span>
      </div>
    </Link>
  );
}


// components/results/MiniRow.tsx
"use client";
import Link from "next/link";
import Logo from "./Logo";
import type { ViewMatch } from "@/types/results";

export default function MiniRow({ match }: Readonly<{ match: ViewMatch }>) {
  const time = match.date ? match.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";
  return (
    <Link
      href={`/matchs/${match.id}`}
      className="flex items-center justify-between gap-3 bg-gray-900/50 border border-gray-700 rounded-xl px-3 py-2 hover:border-gray-600 transition"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Logo size={20} src={match.t1?.logo_url} alt={match.t1?.name || "Team"} />
        <span className="truncate text-sm">{match.t1?.tag || match.t1?.name || "—"}</span>
        <span className="text-gray-500">vs</span>
        <span className="truncate text-sm">{match.t2?.tag || match.t2?.name || "—"}</span>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </Link>
  );
}


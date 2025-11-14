// components/results/ListByDay.tsx
"use client";
import MatchCard from "./MatchCard";
import { groupBy, formatDateLabel } from "@/utils/results";
import type { ViewMatch } from "@/types/results";

export default function ListByDay({ matches }: Readonly<{ matches: ViewMatch[] }>) {
  const byDay = groupBy(matches, (m) => (m.date ? m.date.toISOString().slice(0, 10) : "inconnue"));
  const days = Array.from(byDay.keys()).sort((a, b) => (a < b ? 1 : -1)).slice(0, 14);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Tous les matchs</h2>
      {days.map((d) => (
        <div key={d}>
          <div className="text-sm text-gray-400 mb-2">{formatDateLabel(d)}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {byDay.get(d)!.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


// components/results/CalendarGrid.tsx
"use client";
import MiniRow from "./MiniRow";
import { groupBy, formatDateLabel } from "@/utils/results";
import type { ViewMatch } from "@/types/results";

export default function CalendarGrid({ matches }: Readonly<{ matches: ViewMatch[] }>) {
  // group by date (YYYY-MM-DD)
  const byDay = groupBy(matches, (m) => (m.date ? m.date.toISOString().slice(0, 10) : "inconnue"));
  const days = Array.from(byDay.keys()).sort((a, b) => (a < b ? 1 : -1)).slice(0, 14);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Calendrier (14 derniers jours)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {days.map((d) => (
          <div key={d} className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <div className="text-sm text-gray-400 mb-2">{formatDateLabel(d)}</div>
            <div className="space-y-3">
              {byDay.get(d)!.slice(0, 6).map((m) => (
                <MiniRow key={m.id} match={m} />
              ))}
              {byDay.get(d)!.length > 6 && (
                <div className="text-xs text-gray-500">+ {byDay.get(d)!.length - 6} autres…</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


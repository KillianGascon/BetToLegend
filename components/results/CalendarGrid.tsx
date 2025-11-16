// components/results/CalendarGrid.tsx
"use client";
import MiniRow from "./MiniRow";
import { groupBy, formatDateLabel } from "@/utils/results";
import type { ViewMatch } from "@/types/results";

export default function CalendarGrid({
  matches,
  title,
  morePattern,
}: Readonly<{ matches: ViewMatch[]; title: string; morePattern: string }>) {
  // group by date (YYYY-MM-DD)
  const byDay = groupBy(matches, (m) => (m.date ? m.date.toISOString().slice(0, 10) : "inconnue"));
  const days = Array.from(byDay.keys()).sort((a, b) => (a < b ? 1 : -1)).slice(0, 14);

  return (
    <div className="space-y-6 lg:space-y-8">
      <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {days.map((d) => (
          <div key={d} className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6">
            <div className="text-sm sm:text-base text-white/80 font-montserrat font-medium mb-4">
              {formatDateLabel(d)}
            </div>
            <div className="space-y-3">
              {byDay.get(d)!.slice(0, 6).map((m) => (
                <MiniRow key={m.id} match={m} />
              ))}
              {byDay.get(d)!.length > 6 && (
                <div className="text-xs sm:text-sm text-white/60 font-montserrat pt-2">
                  {morePattern.replace("{count}", String(byDay.get(d)!.length - 6))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


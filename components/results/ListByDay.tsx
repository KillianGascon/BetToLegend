// components/results/ListByDay.tsx
"use client";
import MatchCard from "./MatchCard";
import { groupBy, formatDateLabel } from "@/utils/results";
import type { ViewMatch } from "@/app/type/matchs";

export default function ListByDay({
  matches,
  title,
  matchCardCopy,
}: Readonly<{
  matches: ViewMatch[];
  title: string;
  matchCardCopy: {
    status: { scheduled: string; live: string; finished: string };
    dash: string;
    tournamentFallback: string;
    formatFallback: string;
    oddsLabel: string;
  };
}>) {
  const byDay = groupBy(matches, (m) => (m.date ? m.date.toISOString().slice(0, 10) : "inconnue"));
  const days = Array.from(byDay.keys()).sort((a, b) => (a < b ? 1 : -1)).slice(0, 14);

  return (
    <div className="space-y-8 lg:space-y-12">
      <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
        {title}
      </h2>
      {days.map((d) => (
        <div key={d} className="space-y-4 lg:space-y-6">
          <div className="text-base sm:text-lg text-white/80 font-montserrat font-medium">
            {formatDateLabel(d)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {byDay.get(d)!.map((m) => (
              <MatchCard key={m.id} match={m} copy={matchCardCopy} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


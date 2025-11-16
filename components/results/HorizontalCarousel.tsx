// components/results/HorizontalCarousel.tsx
"use client";
import MatchCard from "./MatchCard";
import type { ViewMatch } from "@/types/results";

type MatchCardCopy = {
  status: { scheduled: string; live: string; finished: string };
  dash: string;
  tournamentFallback: string;
  formatFallback: string;
  oddsLabel: string;
};

export default function HorizontalCarousel({
  matches,
  title,
  matchCardCopy,
}: Readonly<{ matches: ViewMatch[]; title: string; matchCardCopy: MatchCardCopy }>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: "none" }}
      >
        {matches.map((m) => (
          <div key={m.id} className="min-w-[280px] max-w-[320px] snap-start">
            <MatchCard match={m} copy={matchCardCopy} />
          </div>
        ))}
      </div>
    </div>
  );
}


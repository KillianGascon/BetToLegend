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
    <div className="space-y-6 lg:space-y-8">
      <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
        {title}
      </h2>
      <div
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [-ms-overflow-style:none] [scrollbar-width:none] scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {matches.map((m) => (
          <div key={m.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] snap-start flex-shrink-0">
            <MatchCard match={m} copy={matchCardCopy} />
          </div>
        ))}
      </div>
    </div>
  );
}


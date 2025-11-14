// components/results/HorizontalCarousel.tsx
"use client";
import MatchCard from "./MatchCard";
import type { ViewMatch } from "@/types/results";

export default function HorizontalCarousel({ matches, title }: Readonly<{ matches: ViewMatch[]; title: string }>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: "none" }}
      >
        {matches.map((m) => (
          <div key={m.id} className="min-w-[280px] max-w-[320px] snap-start">
            <MatchCard match={m} />
          </div>
        ))}
      </div>
    </div>
  );
}


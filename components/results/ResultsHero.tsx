import EmptyState from "./EmptyState";
import MatchCard from "./MatchCard";

import type { ViewMatch } from "@/app/type/matchs";

type ResultsHeroSectionProps = {
  top3matchs: ViewMatch[];
  copy: {
    ariaTop3: string;
    title: string;
    empty: string;
  };
  matchCardCopy: {
    status: { scheduled: string; live: string; finished: string };
    dash: string;
    tournamentFallback: string;
    formatFallback: string;
    oddsLabel: string;
  };
};

export default function ResultsHeroSection({ top3matchs, copy, matchCardCopy }: ResultsHeroSectionProps) {
  return (
    <div>
      <section aria-label={copy.ariaTop3} className="space-y-4">
        <h2 className="text-lg font-semibold">{copy.title}</h2>

        {top3matchs.length === 0 ? (
          <EmptyState label={copy.empty} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3matchs.map((m) => (
              <MatchCard key={m.id} match={m} copy={matchCardCopy} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

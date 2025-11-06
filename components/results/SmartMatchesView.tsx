// components/results/SmartMatchesView.tsx
"use client";
import EmptyState from "./EmptyState";
import CalendarGrid from "./CalendarGrid";
import HorizontalCarousel from "./HorizontalCarousel";
import ListByDay from "./ListByDay";
import type { ViewMatch } from "@/types/results";

/** Vue intelligente
 * - Si > 10 matchs sur les 14 prochains jours => calendrier.
 * - Sinon si >= 6 récents (terminés) => carousel horizontal.
 * - Sinon => liste groupée par date.
 */
export default function SmartMatchesView({ matches }: Readonly<{ matches: ViewMatch[] }>) {
  if (!matches.length) return <EmptyState label="Rien à afficher pour l'instant." />;

  const now = Date.now();
  const in14d = now + 14 * 24 * 3600 * 1000;

  const upcoming14 = matches.filter((m) => {
    const t = m.date?.getTime();
    return t && t >= now && t <= in14d;
  });

  const finished = matches.filter((m) => m.status === "finished");

  if (upcoming14.length > 10) {
    return <CalendarGrid matches={matches} />;
  }

  if (finished.length >= 6) {
    return <HorizontalCarousel matches={finished.slice(0, 16)} title="Récemment terminés" />;
  }

  return <ListByDay matches={matches} />;
}


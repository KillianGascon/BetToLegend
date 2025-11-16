// components/matchs/detail/MatchHeader.tsx
"use client";
import Link from "next/link";

type Team = { name?: string; tag?: string };

export default function MatchHeader({
  locale,
  backLabel,
  vsPattern,
  tournamentFormatPattern,
  tournament,
  format,
  team1,
  team2,
  status,
  matchDate,
  location,
  statusLabels,
}: Readonly<{
  locale: string;
  backLabel: string;
  vsPattern: string; // contains {team1}, {team2}
  tournamentFormatPattern: string; // contains {tournament}, {format}
  tournament?: string;
  format?: string;
  team1?: Team;
  team2?: Team;
  status?: string;
  matchDate?: string;
  location?: string;
  statusLabels: { live: string; scheduled: string; completed: string };
}>) {
  const vs = vsPattern
    .replace("{team1}", team1?.tag || team1?.name || "Équipe 1")
    .replace("{team2}", team2?.tag || team2?.name || "Équipe 2");
  const tourFmt = tournamentFormatPattern
    .replace("{tournament}", tournament || "Tournoi")
    .replace("{format}", format || "Format inconnu");
  const statusLabel =
    status === "live"
      ? statusLabels.live
      : status === "scheduled"
      ? statusLabels.scheduled
      : statusLabels.completed;

  return (
    <div className="container mx-auto px-6 lg:px-16 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <Link
          href={`/${locale}/matchs`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white font-montserrat font-medium transition-colors duration-200 hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
        <div className="flex-1 space-y-2">
          <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
            {vs}
          </h1>
          <p className="text-white/80 font-montserrat text-base sm:text-lg">{tourFmt}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className={`px-3 py-1.5 rounded-[8px] text-xs sm:text-sm font-montserrat font-medium ${
                status === "live"
                  ? "bg-legend-red text-white"
                  : status === "scheduled"
                    ? "bg-legend-blue text-white"
                    : "bg-white/20 text-white/80"
              }`}
            >
              {statusLabel}
            </span>
            {matchDate && (
              <span className="text-white/60 font-montserrat text-sm">
                {new Date(matchDate).toLocaleString()}
              </span>
            )}
            {location && (
              <span className="text-white/60 font-montserrat text-sm">📍 {location}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



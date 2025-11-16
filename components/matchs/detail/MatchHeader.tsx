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
    <div className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/matchs`} className="text-gray-300 hover:text-white transition">
              {backLabel}
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{vs}</h1>
              <p className="text-gray-300">{tourFmt}</p>
              <p className="text-gray-400">
                {statusLabel}
                {matchDate ? ` • ${new Date(matchDate).toLocaleString()}` : ""}
                {location ? ` • ${location}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



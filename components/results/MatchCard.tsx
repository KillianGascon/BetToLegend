// components/results/MatchCard.tsx
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import TeamMini from "./TeamMini";
import type { ViewMatch } from "@/types/results";

type MatchCardCopy = {
  status: { scheduled: string; live: string; finished: string };
  dash: string;
  tournamentFallback: string;
  formatFallback: string;
  oddsLabel: string; // contains {team}
};

export default function MatchCard({
  match,
  copy,
}: Readonly<{ match: ViewMatch; copy: MatchCardCopy }>) {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : undefined;
  const locale = ["fr", "en", "ko"].includes(rawLocale || "") ? rawLocale! : "fr";

  const d = match.date ? match.date.toLocaleString() : copy.dash;
  const statusLabel =
    match.status === "live"
      ? copy.status.live
      : match.status === "finished"
      ? copy.status.finished
      : copy.status.scheduled;

  return (
    <Link
      href={`/${locale}/matchs/${match.id}`}
      className="block bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8 hover:bg-legend-blue/30 hover:border-legend-red/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-legend-red"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <span
          className={`px-3 py-1.5 rounded-[8px] text-xs sm:text-sm font-montserrat font-medium ${
            match.status === "live"
              ? "bg-legend-red text-white"
              : match.status === "finished"
                ? "bg-white/20 text-white/80"
                : "bg-legend-blue text-white"
          }`}
        >
          {statusLabel}
        </span>
        <span className="text-xs sm:text-sm text-white/60 font-montserrat">{d}</span>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <TeamMini team={match.t1} score={match.s1} />
        <span className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-extrabold text-white">
          {copy.dash}
        </span>
        <TeamMini team={match.t2} score={match.s2} align="right" />
      </div>
      <div className="mt-4 pb-4 border-b border-white/10 text-xs sm:text-sm text-white/70 font-montserrat">
        {match.tour?.name ?? copy.tournamentFallback} • {match.format ?? copy.formatFallback}
      </div>
      {/* Odds inline if available */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:text-sm">
        <span className="text-white/70 font-montserrat">
          {copy.oddsLabel.replace(
            "{team}",
            match.t1?.tag ?? match.t1?.name ?? "Team"
          )}
        </span>
        <span className="text-right text-white font-montserrat font-semibold">
          {match.odds?.team1 ? match.odds.team1.toFixed(2) : copy.dash}
        </span>
        <span className="text-white/70 font-montserrat">
          {copy.oddsLabel.replace(
            "{team}",
            match.t2?.tag ?? match.t2?.name ?? "Team"
          )}
        </span>
        <span className="text-right text-white font-montserrat font-semibold">
          {match.odds?.team2 ? match.odds.team2.toFixed(2) : copy.dash}
        </span>
      </div>
    </Link>
  );
}


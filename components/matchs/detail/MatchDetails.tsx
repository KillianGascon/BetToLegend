// components/matchs/detail/MatchDetails.tsx
"use client";
import InfoRow from "./InfoRow";

export default function MatchDetails({
  title,
  labels,
  tournament,
  format,
  status,
  matchDate,
  location,
  odds,
}: Readonly<{
  title: string;
  labels: {
    tournament: string;
    format: string;
    status: string;
    dateTime: string;
    location: string;
    oddsTeam1: string;
    oddsTeam2: string;
    unknown: string;
    unknownFormat: string;
  };
  tournament?: string;
  format?: string;
  status?: string;
  matchDate?: string;
  location?: string;
  odds?: { team1?: number; team2?: number };
}>) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">{title}</h2>
      <ul className="text-sm text-gray-300 space-y-2">
        <InfoRow label={labels.tournament} value={tournament ?? labels.unknown} />
        <InfoRow label={labels.format} value={format ?? labels.unknown} />
        <InfoRow label={labels.status} value={status ?? labels.unknown} />
        <InfoRow
          label={labels.dateTime}
          value={matchDate ? new Date(matchDate).toLocaleString() : labels.unknown}
        />
        {location && <InfoRow label={labels.location} value={location} />}
        <InfoRow
          label={labels.oddsTeam1}
          value={odds?.team1 ? odds.team1.toFixed(2) : labels.unknown}
        />
        <InfoRow
          label={labels.oddsTeam2}
          value={odds?.team2 ? odds.team2.toFixed(2) : labels.unknown}
        />
      </ul>
    </div>
  );
}



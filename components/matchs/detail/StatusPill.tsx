// components/matchs/detail/StatusPill.tsx
"use client";

export default function StatusPill({
  status,
  labels,
}: Readonly<{
  status?: string;
  labels: { won: string; lost: string; pending: string; unknown: string };
}>) {
  const label =
    status === "won"
      ? labels.won
      : status === "lost"
      ? labels.lost
      : status === "pending"
      ? labels.pending
      : labels.unknown;

  const base = "px-3 py-1.5 rounded-[8px] text-xs sm:text-sm font-montserrat font-medium";
  const cls =
    status === "won"
      ? "bg-legend-red/30 border-2 border-legend-red text-white"
      : status === "lost"
        ? "bg-white/10 border-2 border-white/30 text-white/60"
        : "bg-legend-blue/30 border-2 border-legend-blue text-white";
  return <span className={`${base} ${cls}`}>{label}</span>;
}



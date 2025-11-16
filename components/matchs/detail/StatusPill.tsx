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

  const base = "px-2 py-0.5 rounded-full border text-xs";
  const cls =
    status === "won"
      ? "border-emerald-600 text-emerald-400"
      : status === "lost"
      ? "border-rose-600 text-rose-400"
      : "border-gray-600 text-gray-300";
  return <span className={`${base} ${cls}`}>{label}</span>;
}



// components/matchs/detail/InfoRow.tsx
"use client";

export default function InfoRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 last:border-none pb-3 sm:pb-4">
      <span className="text-white/70 font-montserrat text-sm sm:text-base">{label}</span>
      <span className="text-white font-montserrat font-semibold text-sm sm:text-base">{value}</span>
    </li>
  );
}



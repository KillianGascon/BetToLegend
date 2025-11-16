// components/matchs/detail/InfoRow.tsx
"use client";

export default function InfoRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <li className="flex items-center justify-between border-b border-gray-700/60 last:border-none pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </li>
  );
}



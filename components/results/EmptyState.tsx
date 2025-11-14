// components/results/EmptyState.tsx
"use client";

export default function EmptyState({ label }: Readonly<{ label: string }>) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center text-gray-400">
      {label}
    </div>
  );
}


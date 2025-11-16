// components/results/EmptyState.tsx
"use client";

export default function EmptyState({ label }: Readonly<{ label: string }>) {
  return (
    <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-8 lg:p-12 text-center">
      <p className="text-white/70 font-montserrat text-base sm:text-lg lg:text-xl">
        {label}
      </p>
    </div>
  );
}


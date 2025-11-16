// components/matchs/Loading.tsx
"use client";

export default function Loading() {
  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/group1.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Loading spinner */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 lg:h-20 lg:w-20 border-b-2 border-legend-red"></div>
          <p className="text-white font-montserrat text-base sm:text-lg lg:text-xl">Chargement...</p>
        </div>
      </div>
    </div>
  );
}



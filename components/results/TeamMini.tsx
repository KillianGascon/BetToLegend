// components/results/TeamMini.tsx
"use client";
import Image from "next/image";
import type { Team } from "@/types/results";

export default function TeamMini({
  team,
  score,
  align = "left",
}: Readonly<{
  team?: Team;
  score?: number;
  align?: "left" | "right";
}>) {
  return (
    <div className={`flex items-center ${align === "right" ? "flex-row-reverse text-right" : ""} gap-3 min-w-0 flex-1`}>
      <div className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0">
        {team?.logo_url ? (
          <Image
            src={team.logo_url}
            alt={team?.name || "Team"}
            fill
            sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 56px"
            className="object-contain rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-montserrat font-bold text-sm sm:text-base">
              {(team?.tag || team?.name || "?").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="truncate min-w-0">
        <div className="text-white font-montserrat font-bold text-sm sm:text-base lg:text-lg truncate">
          {team?.tag || team?.name || "—"}
        </div>
        <div className="text-white/70 font-montserrat text-xs sm:text-sm">
          {Number.isFinite(score) ? score : " "}
        </div>
      </div>
    </div>
  );
}


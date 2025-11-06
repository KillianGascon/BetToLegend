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
    <div className={`flex items-center ${align === "right" ? "flex-row-reverse text-right" : ""} gap-2 min-w-0`}>
      <div className="relative h-8 w-8 shrink-0">
        <Image
          src={team?.logo_url || "/placeholder-team.png"}
          alt={team?.name || "Team"}
          fill
          sizes="32px"
          className="object-contain rounded"
        />
      </div>
      <div className="truncate">
        <div className="truncate">{team?.tag || team?.name || "—"}</div>
        <div className="text-xs text-gray-400">{Number.isFinite(score) ? score : " "}</div>
      </div>
    </div>
  );
}


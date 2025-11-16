// components/matchs/detail/TeamCell.tsx
"use client";
import Image from "next/image";

type Team = {
  id: string;
  name: string;
  tag?: string;
  logo_url?: string;
  country?: string;
};

export default function TeamCell({
  team,
  align = "left",
}: Readonly<{ team?: Team | null; align?: "left" | "right" }>) {
  return (
    <div className={`flex items-center ${align === "right" ? "justify-end" : ""} gap-3`}>
      {align === "left" && <Logo src={team?.logo_url} alt={team?.name || "Team"} />}
      <div className={align === "right" ? "text-right" : ""}>
        <div className="text-white font-semibold">{team?.name ?? "—"}</div>
        <div className="text-gray-400 text-sm">{team?.tag ?? ""}</div>
      </div>
      {align === "right" && <Logo src={team?.logo_url} alt={team?.name || "Team"} />}
    </div>
  );
}

function Logo({ src, alt }: Readonly<{ src?: string; alt: string }>) {
  return (
    <div className="relative h-12 w-12">
      <Image src={src || "/placeholder-team.png"} alt={alt} fill sizes="48px" className="object-contain rounded-lg" />
    </div>
  );
}



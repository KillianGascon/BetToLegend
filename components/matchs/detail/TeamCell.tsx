// components/matchs/detail/TeamCell.tsx
"use client";
import Image from "next/image";

export type Team = {
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
    <div className={`flex items-center ${align === "right" ? "justify-end flex-row-reverse" : ""} gap-3 sm:gap-4`}>
      <Logo src={team?.logo_url} alt={team?.name || "Team"} />
      <div className={align === "right" ? "text-right" : ""}>
        <div className="text-white font-montserrat font-bold text-base sm:text-lg lg:text-xl">
          {team?.name ?? "—"}
        </div>
        <div className="text-white/70 font-montserrat text-sm sm:text-base">{team?.tag ?? ""}</div>
      </div>
    </div>
  );
}

function Logo({ src, alt }: Readonly<{ src?: string; alt: string }>) {
  return (
    <div className="relative h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 flex-shrink-0">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
          className="object-contain rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-montserrat font-bold text-lg sm:text-xl">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}



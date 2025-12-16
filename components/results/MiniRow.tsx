// components/results/MiniRow.tsx
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Logo from "./Logo";
import type { ViewMatch } from "@/types/results";

export default function MiniRow({ match }: Readonly<{ match: ViewMatch }>) {
  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : undefined;
  const locale = ["fr", "en", "ko"].includes(rawLocale || "") ? rawLocale! : "fr";

  const time = match.date ? match.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";
  return (
    <Link
      href={`/${locale}/matchs/${match.id}`}
      className="flex items-center justify-between gap-3 bg-white/5 border-2 border-white/10 rounded-[12px] px-4 py-3 hover:border-legend-blue hover:bg-white/10 transition-all duration-200"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Logo size={24} src={match.t1?.logo_url} alt={match.t1?.name || "Team"} />
        <span className="truncate text-sm sm:text-base text-white font-montserrat font-medium">
          {match.t1?.tag || match.t1?.name || "—"}
        </span>
        <span className="text-white/60 font-montserrat text-xs sm:text-sm">vs</span>
        <span className="truncate text-sm sm:text-base text-white font-montserrat font-medium">
          {match.t2?.tag || match.t2?.name || "—"}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-white/60 font-montserrat flex-shrink-0">{time}</span>
    </Link>
  );
}


import Navbar from "@/components/Navbar";
import { MatchCard, EmptyState, SmartMatchesView } from "@/components/results";
import { toView } from "@/utils/results";
import { headers } from "next/headers";
import type { Metadata } from "next";
import type { RawMatch, ViewMatch } from "@/types/results";
import ResultHeaderSection from "@/components/results/ResultsHeader";
import ResultsHeroSection from "@/components/results/ResultsHero";
import resultsLocales from "@/app/[locale]/results/locales.json";

type ResultsLocales = typeof resultsLocales;
type LocaleKey = keyof ResultsLocales;

export const metadata: Metadata = { title: "Résultats" };

async function fetchMatches(): Promise<ViewMatch[]> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
  
  const res = await fetch(`${baseUrl}/api/matches`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /api/matches failed: ${res.status}`);
  const data = (await res.json()) as RawMatch[];
  return data.map(toView).sort((a, b) => {
    const ta = a.date?.getTime() ?? 0;
    const tb = b.date?.getTime() ?? 0;
    return tb - ta;
  });
}

export default async function ResultsPage({
  params,
}: {
  params: { locale: string };
}) {
  const matches = await fetchMatches();

  const top3 = matches.slice(0, 3);
  const remaining = matches.slice(3);

  const locale: LocaleKey =
    (["en", "fr", "ko"].includes(params.locale) ? params.locale : "fr") as LocaleKey;
  const copy = resultsLocales[locale];

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
          <Navbar />
        </header>

        {/* Header */}
        <ResultHeaderSection title={copy.header.title} subtitle={copy.header.subtitle} />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 lg:px-16 py-8 lg:py-12 space-y-10 lg:space-y-12">
          <ResultsHeroSection top3matchs={top3} copy={copy.hero} matchCardCopy={copy.matchCard} />

          <section aria-label={copy.page.ariaSmartView}>
            <SmartMatchesView
              matches={remaining}
              copy={copy.smart}
              calendar={copy.calendar}
              list={copy.list}
              matchCardCopy={copy.matchCard}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

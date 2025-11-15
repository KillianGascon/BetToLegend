// app/[locale]/about/page.tsx
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import AboutMission from "@/components/about/AboutMission";
import AboutHighlights from "@/components/about/AboutHighlights";
import AboutValues from "@/components/about/AboutValues";
import AboutCTA from "@/components/about/AboutCTA";

import aboutLocales from "@/app/[locale]/about/locales.json";

type AboutLocales = typeof aboutLocales;
type LocaleKey = keyof AboutLocales;

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: LocaleKey =
    (["en", "fr", "ko"].includes(params.locale)
      ? params.locale
      : "fr") as LocaleKey;

  const copy = aboutLocales[locale];

  return (
    <div className="relative min-h-screen text-white">
      <header className="container mx-auto px-6 lg:px-16 py-4 lg:py-6">
        <Navbar />
      </header>

      <main className="pb-16 space-y-16">
        <AboutHero copy={copy.hero} liveBetting={copy.liveBetting}/>
        <AboutMission mission={copy.mission} product={copy.product} />
        <AboutHighlights highlights={copy.highlights} />
        <AboutValues values={copy.values} />
        <AboutCTA cta={copy.cta} />
      </main>
    </div>
  );
}

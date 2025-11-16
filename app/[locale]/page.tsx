import Navbar from "@/components/Navbar";
import locales from "@/app/[locale]/locales.json";
import LandingHeroSection from "@/components/landing/LandingHero";

type LandingLocales = typeof locales;
type LocaleKey = keyof LandingLocales;

export default function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  // Nettoyage / fallback
  const locale: LocaleKey =
    (["en", "fr", "ko"].includes(params.locale)
      ? params.locale
      : "fr") as LocaleKey;

  const copy = locales[locale];

  return (
    <div className="relative min-h-screen h-screen">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/group1.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Bloc landing */}
      <div className="relative z-10 min-h-screen h-full flex flex-col">
        {/* Navbar - Fixed, no wrapper needed */}
        <Navbar />

        {/* Hero section */}
        <main className="flex-1 flex items-center pt-20 lg:pt-24 pb-8 lg:pb-12">
          <LandingHeroSection copy={copy} />
        </main>
      </div>
    </div>
  );
}

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
    <div className="relative h-screen">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/group1.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Bloc landing */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Navbar */}
        <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
          <Navbar />
        </header>

        {/* Hero section */}
        <main className="flex-1">
          <LandingHeroSection copy={copy} />
        </main>
      </div>
    </div>
  );
}

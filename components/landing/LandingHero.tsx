import locales from "@/app/[locale]/locales.json";

type LandingLocales = typeof locales;
type LocaleKey = keyof LandingLocales;
type Copy = LandingLocales[LocaleKey];

export default function LandingHeroSection({ copy }: { copy: Copy }) {
  return (
    <div className="container mx-auto px-6 lg:px-16 h-full">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
        <div className="space-y-8 lg:space-y-10 max-w-2xl">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px] leading-tight">
              <span className="text-white">
                {copy.hero.titleFirstLine}{" "}
              </span>
              <br className="hidden sm:block" />
              <span className="text-white">
                {copy.hero.titleSecondLinePrefix}{" "}
              </span>
              <span className="text-legend-red">
                {copy.hero.titleSecondLineAccent}
              </span>
            </h1>

            <h2 className="text-white font-montserrat text-lg sm:text-xl lg:text-2xl font-medium">
              {copy.hero.subtitle}
            </h2>
          </div>

          <div className="flex w-full flex-col sm:flex-row gap-4 lg:gap-5 sm:items-center sm:justify-start">
            <button className="w-1/2 h-full px-6 lg:px-8 py-3 lg:py-4 rounded-[12px] bg-legend-red text-white font-montserrat font-medium text-base sm:text-lg lg:text-2xl hover:bg-legend-red/80 duration-200 hover:scale-105 active:scale-95">
              {copy.cta.primary}
            </button>
            <button className="w-1/2 h-full px-6 lg:px-8 py-3 lg:py-4 rounded-[12px] border-2 border-legend-blue bg-legend-blue/15 flex items-center justify-center duration-200 hover:bg-legend-blue/25 hover:scale-105 active:scale-95">
              <span className="text-white font-montserrat font-medium text-base sm:text-lg lg:text-2xl leading-normal">
                {copy.cta.secondary}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

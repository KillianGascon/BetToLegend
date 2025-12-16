import aboutLocales from "@/app/[locale]/about/locales.json";

type AboutLocales = typeof aboutLocales;
type LocaleKey = keyof AboutLocales;

type HeroCopy = AboutLocales[LocaleKey]["hero"];
type LiveBettingCopy = AboutLocales[LocaleKey]["liveBetting"];

export default function AboutHero({
  copy,
  liveBetting,
}: {
  copy: HeroCopy;
  liveBetting: LiveBettingCopy;
}) {
  return (
    <section className="pt-10 pb-16">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6 max-w-2xl">
            <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              <span className="text-white">{copy.eyebrow} </span>
              <span className="text-legend-red">{copy.title}</span>
            </h1>

            <p className="text-white/80 font-montserrat text-base sm:text-lg lg:text-xl">
              {copy.description}
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="rounded-2xl bg-legend-blue/20 border border-legend-blue/40 p-6 lg:p-8 backdrop-blur-sm">
              <h2 className="text-white font-montserrat font-semibold text-xl lg:text-2xl mb-3">
                {liveBetting.title}
              </h2>
              <p className="text-white/75 text-sm sm:text-base">
                {liveBetting.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                <p className="text-2xl lg:text-3xl font-montserrat font-extrabold text-legend-red">
                  24/7
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  {liveBetting.highlightMatches}
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                <p className="text-2xl lg:text-3xl font-montserrat font-extrabold text-white">
                  {liveBetting.highlightCompetitionsValue}
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  {liveBetting.highlightCompetitionsLabel}
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                <p className="text-2xl lg:text-3xl font-montserrat font-extrabold text-legend-blue">
                  {liveBetting.highlightSecureTag}
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  {liveBetting.highlightSecureLabel}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import aboutLocales from "@/app/[locale]/about/locales.json";

type AboutLocales = typeof aboutLocales;
type LocaleKey = keyof AboutLocales;
type HighlightsCopy = AboutLocales[LocaleKey]["highlights"];

export default function AboutHighlights({ highlights }: { highlights: HighlightsCopy }) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">

        <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl mb-8">
          {highlights.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {highlights.items.map((item, index) => (
            <article
              key={index}
              className="rounded-2xl bg-black/40 border border-white/10 p-6 flex flex-col gap-3"
            >
              <h3 className="text-white font-montserrat font-semibold text-lg lg:text-xl">
                {item.title}
              </h3>

              <p className="text-white/75 text-sm sm:text-base">
                {item.text}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

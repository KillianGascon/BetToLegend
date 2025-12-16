import aboutLocales from "@/app/[locale]/about/locales.json";

type AboutLocales = typeof aboutLocales;
type LocaleKey = keyof AboutLocales;
type ValuesCopy = AboutLocales[LocaleKey]["values"];

export default function AboutValues({ values }: { values: ValuesCopy }) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl mb-8">
          {values.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {values.items.map((item, index) => (
            <div
              key={index}
              className={`
                rounded-2xl p-6 border
                ${
                  index === 0
                    ? "bg-legend-blue/15 border-legend-blue/40"
                    : index === 1
                    ? "bg-legend-red/15 border-legend-red/40"
                    : "bg-white/5 border-white/20"
                }
              `}
            >
              <p
                className={`
                  text-xs uppercase tracking-[0.2em] mb-2
                  ${
                    index === 0
                      ? "text-legend-blue"
                      : index === 1
                      ? "text-legend-red"
                      : "text-white"
                  }
                `}
              >
                {item.number}
              </p>

              <h3 className="text-white font-montserrat font-semibold text-lg mb-2">
                {item.title}
              </h3>

              <p className="text-white/75 text-sm sm:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

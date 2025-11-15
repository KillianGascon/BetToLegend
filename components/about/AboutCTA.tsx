

export default function AboutCTA() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="rounded-3xl bg-legend-blue/20 border border-legend-blue/40 px-6 py-8 lg:px-10 lg:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl">
              Prêt à entrer dans la légende ?
            </h2>
            <p className="text-white/75 text-sm sm:text-base max-w-xl">
              Créez votre compte, suivez vos équipes préférées et vivez les
              compétitions autrement, en direct.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-3.5 rounded-[12px] bg-legend-red text-white font-montserrat font-medium text-sm sm:text-base hover:bg-legend-red/80 duration-200 hover:scale-105 active:scale-95">
              Commencer à parier
            </button>
            <button className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-3.5 rounded-[12px] border-2 border-legend-blue bg-legend-blue/15 text-white font-montserrat font-medium text-sm sm:text-base hover:bg-legend-blue/25 duration-200 hover:scale-105 active:scale-95">
              Voir les matchs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
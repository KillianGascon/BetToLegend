

export default function AboutHero() {
    return (
      <section className="pt-10 pb-16">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 max-w-2xl">
              <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                <span className="text-white">À PROPOS DE </span>
                <span className="text-legend-red">BET TO LEGEND</span>
              </h1>
  
              <p className="text-white/80 font-montserrat text-base sm:text-lg lg:text-xl">
                Bet To Legend est une plateforme de paris E-sport pensée pour les
                joueurs, les fans et les structures. Notre objectif : rendre les
                paris E-sport aussi fluides, rapides et sécurisés que le jeu lui-même.
              </p>
            </div>
  
            <div className="space-y-4 lg:space-y-6">
              <div className="rounded-2xl bg-legend-blue/20 border border-legend-blue/40 p-6 lg:p-8 backdrop-blur-sm">
                <h2 className="text-white font-montserrat font-semibold text-xl lg:text-2xl mb-3">
                  Paris E-Sport en direct
                </h2>
                <p className="text-white/75 text-sm sm:text-base">
                  Suivez les matchs en temps réel, placez vos paris en quelques
                  secondes et gardez le contrôle grâce à une interface claire,
                  responsive et pensée pour limiter la charge cognitive dans les
                  moments clés.
                </p>
              </div>
  
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                  <p className="text-2xl lg:text-3xl font-montserrat font-extrabold text-legend-red">
                    24/7
                  </p>
                  <p className="text-xs sm:text-sm text-white/70">
                    Matchs & marchés disponibles en continu.
                  </p>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                  <p className="text-2xl lg:text-3xl font-montserrat font-extrabold text-white">
                    +100
                  </p>
                  <p className="text-xs sm:text-sm text-white/70">
                    Compétitions et ligues couvertes.
                  </p>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                  <p className="text-2xl lg:text-3xl font-montserrat font-extrabold text-legend-blue">
                    Secure
                  </p>
                  <p className="text-xs sm:text-sm text-white/70">
                    Transactions chiffrées et contrôles renforcés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
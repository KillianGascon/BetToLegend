
export default 
function AboutValues() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl mb-8">
          Nos valeurs
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="rounded-2xl bg-legend-blue/15 border border-legend-blue/40 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-legend-blue mb-2">
              #1
            </p>
            <h3 className="text-white font-montserrat font-semibold text-lg mb-2">
              Transparence
            </h3>
            <p className="text-white/75 text-sm sm:text-base">
              Des règles claires, des cotes explicites, un historique toujours
              accessible. Ici, rien n’est caché.
            </p>
          </div>

          <div className="rounded-2xl bg-legend-red/15 border border-legend-red/40 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-legend-red mb-2">
              #2
            </p>
            <h3 className="text-white font-montserrat font-semibold text-lg mb-2">
              Responsabilité
            </h3>
            <p className="text-white/75 text-sm sm:text-base">
              Outils de limitation, rappels et indicateurs pour un usage sain et
              maîtrisé de la plateforme.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/20 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white mb-2">
              #3
            </p>
            <h3 className="text-white font-montserrat font-semibold text-lg mb-2">
              Passion du jeu
            </h3>
            <p className="text-white/75 text-sm sm:text-base">
              Nous venons du jeu, pour les joueurs. L’expérience est pensée pour
              respecter l’intensité et la magie des compétitions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
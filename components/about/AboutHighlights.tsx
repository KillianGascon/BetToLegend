
export default 
function AboutHighlights() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl mb-8">
          Ce qui rend Legend unique
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <article className="rounded-2xl bg-black/40 border border-white/10 p-6 flex flex-col gap-3">
            <h3 className="text-white font-montserrat font-semibold text-lg lg:text-xl">
              Expérience ultra-réactive
            </h3>
            <p className="text-white/75 text-sm sm:text-base">
              Interface optimisée pour les matchs intenses : transitions
              fluides, délais minimisés et retours visuels clairs pour garder
              l&apos;utilisateur focus sur l&apos;essentiel.
            </p>
          </article>

          <article className="rounded-2xl bg-black/40 border border-white/10 p-6 flex flex-col gap-3">
            <h3 className="text-white font-montserrat font-semibold text-lg lg:text-xl">
              Design centré utilisateur
            </h3>
            <p className="text-white/75 text-sm sm:text-base">
              Architecture en composants (faible charge cognitive), affordances
              explicites et état de chaque action facilement lisible, même en
              multi-task (stream + paris).
            </p>
          </article>

          <article className="rounded-2xl bg-black/40 border border-white/10 p-6 flex flex-col gap-3">
            <h3 className="text-white font-montserrat font-semibold text-lg lg:text-xl">
              Pensé pour les équipes & communautés
            </h3>
            <p className="text-white/75 text-sm sm:text-base">
              Misez sur vos équipes préférées, suivez vos rosters et partagez
              vos paris avec votre communauté, tout en gardant un cadre maîtrisé
              et sécurisé.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
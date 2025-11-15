

export default 
function AboutMission() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl">
              Notre mission
            </h2>
            <p className="text-white/75 text-sm sm:text-base lg:text-lg">
              Créer une expérience de paris E-sport qui respecte le rythme des
              compétitions, les joueurs et les communautés. Nous voulons réduire
              la friction à chaque étape : compréhension des cotes, navigation,
              placements de paris et suivi des résultats.
            </p>
            <p className="text-white/70 text-sm sm:text-base">
              L’interface est conçue pour accompagner l&apos;utilisateur pendant
              tout le match : hiérarchie visuelle claire, boutons facilement
              cliquables (Fitts&apos;s law), feedback immédiat sur chaque action
              et lecture rapide des informations critiques.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-montserrat font-semibold text-xl lg:text-2xl">
              Une plateforme pensée produit
            </h3>
            <ul className="space-y-4 text-sm sm:text-base text-white/80">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-legend-red" />
                <span>
                  <span className="font-semibold">Lisibilité d’abord :</span>{" "}
                  contenu structuré, informations essentielles toujours
                  au-dessus de la ligne de flottaison, contrastes conformes aux
                  standards d’accessibilité (WCAG).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-legend-blue" />
                <span>
                  <span className="font-semibold">Flow en temps réel :</span>{" "}
                  interactions optimisées pour des mises en contexte rapide :
                  score, cote, temps de jeu, statut du pari.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>
                  <span className="font-semibold">Sécurité intégrée :</span>{" "}
                  mesures anti-fraude, suivi d’historique et transparence sur
                  chaque transaction.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
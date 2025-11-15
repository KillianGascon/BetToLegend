import aboutLocales from "@/app/[locale]/about/locales.json";

type AboutLocales = typeof aboutLocales;
type LocaleKey = keyof AboutLocales;

type MissionCopy = AboutLocales[LocaleKey]["mission"];
type ProductCopy = AboutLocales[LocaleKey]["product"];

export default function AboutMission({
  mission,
  product,
}: {
  mission: MissionCopy;
  product: ProductCopy;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Colonne gauche : mission */}
          <div className="space-y-4">
            <h2 className="text-white font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl">
              {mission.title}
            </h2>
            <p className="text-white/75 text-sm sm:text-base lg:text-lg">
              {mission.body1}
            </p>
            <p className="text-white/70 text-sm sm:text-base">
              {mission.body2}
            </p>
          </div>

          {/* Colonne droite : plateforme produit */}
          <div className="space-y-4">
            <h3 className="text-white font-montserrat font-semibold text-xl lg:text-2xl">
              {product.title}
            </h3>
            <ul className="space-y-4 text-sm sm:text-base text-white/80">
              {/* Lisibilité d'abord */}
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-legend-red" />
                <span>
                  <span className="font-semibold">
                    {product.readabilityTitle}{" "}
                  </span>
                  {product.readabilityDescription}
                </span>
              </li>

              {/* Flow en temps réel */}
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-legend-blue" />
                <span>
                  <span className="font-semibold">
                    {product.flowTitle}{" "}
                  </span>
                  {product.flowDescription}
                </span>
              </li>

              {/* Sécurité intégrée — optionnelle, si tu l’ajoutes dans le JSON */}
              {product.securityTitle && product.securityDescription && (
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  <span>
                    <span className="font-semibold">
                      {product.securityTitle}{" "}
                    </span>
                    {product.securityDescription}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

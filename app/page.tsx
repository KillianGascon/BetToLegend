import "./globals.css";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-screen overflow-hidden">
      <body className="relative h-full bg-legend-dark">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/group1.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Bloc landing = prend toute la hauteur dispo */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Navbar */}
          <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
            <Navbar />
          </header>

          {/* Hero section */}
          <main className="flex-1">
            <div className="container mx-auto px-6 lg:px-16 h-full">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
                {/* Left column: text + CTA */}
                <div className="space-y-8 lg:space-y-10 max-w-2xl">
                  <div className="space-y-4 lg:space-y-6">
                    <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px] leading-tight">
                      <span className="text-white">MISEZ SUR VOS ÉQUIPES, </span>
                      <br className="hidden sm:block" />
                      <span className="text-white">DEVENEZ UNE </span>
                      <span className="text-legend-red">LÉGENDE</span>
                    </h1>

                    <h2 className="text-white font-montserrat text-lg sm:text-xl lg:text-2xl font-medium">
                      Paris E-Sport en direct, rapide et sécurisés.
                    </h2>
                  </div>

                  <div className="flex w-full flex-col sm:flex-row gap-4 lg:gap-5 sm:items-center sm:justify-start">
                    <button
                      className="w-full sm:w-auto sm:min-w-[220px] lg:min-w-[260px] px-6 lg:px-8 py-3 lg:py-4 rounded-[12px] bg-legend-red text-white font-montserrat font-medium text-base sm:text-lg lg:text-2xl hover:bg-legend-red/80 transition-transform transition-colors duration-200 hover:scale-105 active:scale-95"
                    >
                      Commencer à parier
                    </button>

                    <button
                      className="w-full sm:w-auto sm:min-w-[220px] lg:min-w-[260px] px-6 lg:px-8 py-3 lg:py-4 rounded-[12px] border-2 border-legend-blue bg-legend-blue/15 flex items-center justify-center transition-transform transition-colors duration-200 hover:bg-legend-blue/25 hover:scale-105 active:scale-95"
                    >
                      <span className="text-white font-montserrat font-medium text-base sm:text-lg lg:text-2xl leading-normal">
                        Voir les matchs
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Pas de scroll pour l’instant, donc pas de children */}
        {/* Quand tu voudras des pages scrollables, il faudra
            déplacer le hero dans la page d’accueil uniquement
            (ex: `app/page.tsx`) et laisser `RootLayout` gérer
            juste le shell global. */}
      </body>
    </html>
  );
}

"use client";

import locales from "@/app/[locale]/locales.json";
import Link from "next/link";
import { useParams } from "next/navigation";

type LandingLocales = typeof locales;
type LocaleKey = keyof LandingLocales;
type Copy = LandingLocales[LocaleKey];

export default function LandingHeroSection({ copy }: { copy: Copy }) {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const basePath = `/${locale}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-16 w-full">
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center w-full">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-2xl">
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[72px] leading-tight text-left">
              <span className="text-white block">
                {copy.hero.titleFirstLine}
              </span>
              <span className="text-white block">
                {copy.hero.titleSecondLinePrefix}{" "}
                <span className="text-legend-red">
                  {copy.hero.titleSecondLineAccent}
                </span>
              </span>
            </h1>

            <h2 className="text-white font-montserrat text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-left">
              {copy.hero.subtitle}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 items-stretch sm:items-center justify-start pt-2">
            <Link
              href={`/sign-in`}
              className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px] lg:max-w-none px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-[12px] bg-legend-red text-white font-montserrat font-medium text-sm sm:text-base lg:text-lg xl:text-2xl hover:bg-legend-red/80 duration-200 hover:scale-105 active:scale-95 transition-transform text-center"
            >
              {copy.cta.primary}
            </Link>
            <Link
              href={`${basePath}/matchs`}
              className="w-full sm:w-auto sm:flex-1 sm:max-w-[200px] lg:max-w-none px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-[12px] border-2 border-legend-blue bg-legend-blue/15 flex items-center justify-center duration-200 hover:bg-legend-blue/25 hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="text-white font-montserrat font-medium text-sm sm:text-base lg:text-lg xl:text-2xl leading-normal">
                {copy.cta.secondary}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

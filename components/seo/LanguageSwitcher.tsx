// src/components/LanguageSwitcher.tsx
"use client";

import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";

const LANGS = [
  { code: "fr", labelKey: "language.french", shortKey: "language.code_fr" },
  { code: "en", labelKey: "language.english", shortKey: "language.code_en" },
  { code: "ko", labelKey: "language.korean", shortKey: "language.code_ko" }
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation("common");
  const pathname = usePathname();
  const router = useRouter();

  // /fr, /en, /ko, /fr/xxx, etc.
  const segments = (pathname || "/fr").split("/").filter(Boolean);
  const currentLocale = (segments[0] as "fr" | "en" | "ko") || "fr";

  // le reste du path sans la locale
  const restPath = segments.slice(1).join("/");

  const handleChange = (lng: string) => {
    // change langue dans i18next
    i18n.changeLanguage(lng);

    // reconstruit l'URL : /lng + reste du path
    const newPath = `/${lng}${restPath ? `/${restPath}` : ""}`;
    router.push(newPath);
  };

  return (
    <div className="flex flex-col gap-1 text-xs sm:text-sm text-white/80">
      <span className="uppercase tracking-wide">{t("language.select")}</span>
      <div className="inline-flex gap-2">
        {LANGS.map((lang) => {
          const isActive = currentLocale === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)}
              className={[
                "flex items-center gap-1 rounded-full border px-3 py-1 transition",
                "text-xs sm:text-sm font-medium",
                isActive
                  ? "border-legend-red bg-legend-red/20"
                  : "border-white/30 bg-black/20 hover:bg-white/10"
              ].join(" ")}
            >
              <span>{t(lang.labelKey)}</span>
              <span className="font-bold">{t(lang.shortKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

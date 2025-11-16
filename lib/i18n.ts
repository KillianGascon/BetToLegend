// src/lib/i18n.ts
"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  fr: {
    common: {
      hero: {
        title_first_line: "MISEZ SUR VOS ÉQUIPES,",
        title_second_line_prefix: "DEVENEZ UNE",
        title_second_line_accent: "LÉGENDE",
        subtitle: "Paris E-Sport en direct, rapide et sécurisés."
      },
      cta: {
        primary: "Commencer à parier",
        secondary: "Voir les matchs"
      },
      language: {
        select: "Langue",
        french: "Français",
        english: "Anglais",
        korean: "Coréen",
        code_fr: "FR",
        code_en: "EN",
        code_ko: "KO"
      }
    }
  },
  en: {
    common: {
      hero: {
        title_first_line: "BET ON YOUR TEAMS,",
        title_second_line_prefix: "BECOME A",
        title_second_line_accent: "LEGEND",
        subtitle: "Live e-sports betting, fast and secure."
      },
      cta: {
        primary: "Start betting",
        secondary: "View matches"
      },
      language: {
        select: "Language",
        french: "French",
        english: "English",
        korean: "Korean",
        code_fr: "FR",
        code_en: "EN",
        code_ko: "KO"
      }
    }
  },
  ko: {
    common: {
      hero: {
        title_first_line: "당신의 팀에 베팅하고,",
        title_second_line_prefix: "진짜",
        title_second_line_accent: "전설이 되세요",
        subtitle: "실시간 e-스포츠 베팅, 빠르고 안전하게."
      },
      cta: {
        primary: "베팅 시작하기",
        secondary: "경기 보기"
      },
      language: {
        select: "언어",
        french: "프랑스어",
        english: "영어",
        korean: "한국어",
        code_fr: "FR",
        code_en: "EN",
        code_ko: "KO"
      }
    }
  }
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "fr",
      supportedLngs: ["fr", "en", "ko"], // <-- ajout ko ici
      defaultNS: "common",
      ns: ["common"],
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ["querystring", "localStorage", "navigator"],
        lookupQuerystring: "lang",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage"]
      }
    })
    .catch((err) => {
      console.error("i18n init error", err);
    });
}

export default i18n;

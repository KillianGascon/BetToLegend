"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Initialize i18n

export default function Navbar() {
  const [role, setRole] = useState<string>("user");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation("common");

  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Try to get locale from params first, then from pathname
  const rawLocale = typeof params?.locale === "string" ? params.locale : undefined;
  let locale = ["fr", "en", "ko"].includes(rawLocale || "") ? rawLocale! : undefined;
  
  // Fallback to pathname if no locale in params
  if (!locale && pathname) {
    const pathSegments = pathname.split("/").filter(Boolean);
    const pathLocale = pathSegments[0];
    if (["fr", "en", "ko"].includes(pathLocale)) {
      locale = pathLocale as "fr" | "en" | "ko";
    }
  }
  
  // Final fallback to "fr"
  const finalLocale = locale || "fr";
  const basePath = `/${finalLocale}`;

  // Sync i18n language with locale
  useEffect(() => {
    if (i18n.language !== finalLocale) {
      i18n.changeLanguage(finalLocale);
    }
  }, [finalLocale, i18n]);

  // Language options
  const languages = [
    { code: "fr", label: "FR", name: t("language.french") },
    { code: "en", label: "EN", name: t("language.english") },
    { code: "ko", label: "KO", name: t("language.korean") },
  ];

  const currentLanguage = languages.find((lang) => lang.code === finalLocale) || languages[0];

  // Handle language change
  const handleLanguageChange = (newLocale: string) => {
    setIsLanguageDropdownOpen(false);
    // Update i18n language
    i18n.changeLanguage(newLocale);
    
    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      const currentLocale = segments[0];
      
      // If we're on a localized route, replace the locale
      if (["fr", "en", "ko"].includes(currentLocale)) {
        const restPath = segments.slice(1).join("/");
        const newPath = `/${newLocale}${restPath ? `/${restPath}` : ""}`;
        router.push(newPath);
      } else {
        // If we're on a non-localized route (like /sign-in), redirect to localized home
        router.push(`/${newLocale}`);
      }
    } else {
      router.push(`/${newLocale}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".language-dropdown")) {
        setIsLanguageDropdownOpen(false);
      }
      if (!target.closest(".mobile-menu")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isLanguageDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isLanguageDropdownOpen, isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setRole(data.role ?? "user"))
      .catch(() => setRole("user"));
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 w-full items-center justify-between py-6 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#111461]/80 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative h-auto px-6 lg:px-16">
        {/* Logo - Left side */}
        <div className="flex items-center relative h-10 w-32">
          <Link href={basePath} className="relative w-full h-full">
            <Image
              src="/logoBTL.ico"
              alt="Mon icône"
              fill
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Navbar links - Centered */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 bg-[#111461]/30 rounded-xl px-6 py-3 flex justify-center space-x-16">
          <Link
            href={`${basePath}/matchs`}
            className="text-white text-lg font-medium hover:text-red-400 transition-colors"
          >
            {t("navbar.matchs")}
          </Link>

          <Link
            href={`${basePath}/results`}
            className="text-white text-lg font-medium hover:text-red-400 transition-colors"
          >
            {t("navbar.results")}
          </Link>

          <Link
            href={`${basePath}/about`}
            className="text-white text-lg font-medium hover:text-red-400 transition-colors"
          >
            {t("navbar.about")}
          </Link>

          {role === "admin" && (
            <Link
              href={`${basePath}/admin`}
              className="text-red-400 text-lg font-bold hover:text-white transition-colors"
            >
              {t("navbar.gestion")}
            </Link>
          )}
        </nav>

        {/* Language selector and Auth buttons - Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Language Dropdown Selector */}
          <div className="relative language-dropdown">
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 bg-[#111461]/30 hover:bg-[#111461]/50 rounded-lg px-3 py-2 text-white text-sm font-medium transition-colors"
            >
              <span>{currentLanguage.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#111461]/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      finalLocale === lang.code
                        ? "bg-[#2621BF] text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-xs opacity-70">{lang.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth buttons */}
          <SignedOut>
            <Link href={`/sign-in`}>
              <button
                type="button"
                className="bg-[#2621BF] text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 cursor-pointer hover:bg-[#3c36e0] transition-colors whitespace-nowrap"
              >
                {t("navbar.signIn")}
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between py-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#111461]/80 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="w-full flex items-center justify-between px-4 relative">
        {/* Logo */}
        <div className="flex items-center relative h-8 w-24">
          <Link href={basePath} className="relative w-full h-full">
            <Image
              src="/logoBTL.ico"
              alt="Mon icône"
              fill
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Right side: Language selector, Auth, and Menu button */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown Selector */}
          <div className="relative language-dropdown">
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-1 bg-[#111461]/30 hover:bg-[#111461]/50 rounded-lg px-2 py-1.5 text-white text-xs font-medium transition-colors"
            >
              <span>{currentLanguage.label}</span>
              <svg
                className={`w-3 h-3 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#111461]/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      finalLocale === lang.code
                        ? "bg-[#2621BF] text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-xs opacity-70">{lang.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth buttons */}
          <SignedOut>
            <Link href={`/sign-in`}>
              <button
                type="button"
                className="bg-[#2621BF] text-white rounded-lg font-medium text-xs h-8 px-3 cursor-pointer hover:bg-[#3c36e0] transition-colors"
              >
                {t("navbar.signIn")}
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="scale-75">
              <UserButton />
            </div>
          </SignedIn>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-[#111461]/30 hover:bg-[#111461]/50 rounded-lg text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu absolute top-full left-0 right-0 mt-2 mx-4 bg-[#111461]/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
            <nav className="flex flex-col py-2">
              <Link
                href={`${basePath}/matchs`}
                className="px-4 py-3 text-white text-base font-medium hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navbar.matchs")}
              </Link>

              <Link
                href={`${basePath}/results`}
                className="px-4 py-3 text-white text-base font-medium hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navbar.results")}
              </Link>

              <Link
                href={`${basePath}/about`}
                className="px-4 py-3 text-white text-base font-medium hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navbar.about")}
              </Link>

              {role === "admin" && (
                <Link
                  href={`${basePath}/admin`}
                  className="px-4 py-3 text-red-400 text-base font-bold hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("navbar.gestion")}
                </Link>
              )}
            </nav>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

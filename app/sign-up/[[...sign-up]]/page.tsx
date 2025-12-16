"use client";

import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<"fr" | "en" | "ko">("fr");

  useEffect(() => {
    // Try to get locale from redirect URL first
    const redirectUrl = searchParams.get("redirect_url") || "";
    const localeMatch = redirectUrl.match(/\/(fr|en|ko)(?:\/|$)/);
    
    if (localeMatch) {
      setLocale(localeMatch[1] as "fr" | "en" | "ko");
      return;
    }
    
    // If no locale in redirect URL, try to get from pathname (in case user came from a localized page)
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean);
      const pathLocale = pathSegments[0];
      if (["fr", "en", "ko"].includes(pathLocale)) {
        setLocale(pathLocale as "fr" | "en" | "ko");
        return;
      }
    }
    
    // Default to "fr"
    setLocale("fr");
  }, [searchParams, pathname]);

  const basePath = `/${locale}`;
  const fallbackRedirect = `${basePath}/matchs`;

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/group1.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
          <Navbar />
        </header>

        {/* Sign Up Form */}
        <main className="flex-1 flex items-center justify-center container mx-auto px-6 lg:px-16 py-8 lg:py-12">
          <div className="w-full max-w-md">
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-3">
                  Join BetToLegend
                </h1>
                <p className="text-white font-montserrat text-base sm:text-lg">
                  Create your account to start betting
                </p>
              </div>
              <div className="flex justify-center">
                <SignUp
                  path="/sign-up"
                  routing="path"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl={fallbackRedirect}
                  forceRedirectUrl={fallbackRedirect}
                  appearance={{
                    variables: {
                      colorText: "white",
                      colorTextSecondary: "white",
                      colorInputText: "white",
                    },
                    elements: {
                      rootBox: "mx-auto",
                      card: "bg-transparent shadow-none border-none",
                      headerTitle: "font-montserrat font-bold text-2xl text-white hidden",
                      headerSubtitle: "font-montserrat text-white hidden",
                      socialButtonsBlockButton:
                        "bg-white/10 border-2 border-legend-blue text-white font-montserrat font-medium rounded-[12px] hover:bg-legend-blue/30 transition-all duration-200",
                      socialButtonsBlockButtonText: "font-montserrat text-white",
                      dividerLine: "bg-white/20",
                      dividerText: "font-montserrat text-white",
                      formFieldLabel: "font-montserrat font-medium text-white !important",
                      formFieldLabelText:
                        "text-white !important",
                      formFieldInput:
                        "bg-white/10 border-2 border-legend-blue rounded-[12px] text-white font-montserrat placeholder-white/50 focus:border-legend-red focus:ring-2 focus:ring-legend-red",
                      formFieldInputText:
                        "text-white !important",
                      formButtonPrimary:
                        "bg-legend-red text-white font-montserrat font-medium rounded-[12px] hover:bg-legend-red/80 transition-all duration-200 hover:scale-105 active:scale-95",
                      footer:
                        "bg-transparent rounded-[12px] px-4 py-3 mt-4",
                      footerAction:
                        "bg-[#111461]/80 rounded-[12px] px-4 py-3 mt-4",
                      footerActionText:
                        "text-white font-montserrat bg-transparent",
                      footerActionLink: "text-legend-red font-montserrat font-medium hover:text-legend-red/80",
                      identityPreviewText: "font-montserrat text-white",
                      identityPreviewEditButton: "text-legend-red hover:text-legend-red/80",
                      formFieldInputShowPasswordButton: "text-white hover:text-white/80",
                      formResendCodeLink: "text-legend-red font-montserrat font-medium hover:text-legend-red/80",
                      formFieldErrorText:
                        "text-white",
                      formFieldSuccessText:
                        "text-white",
                      formFieldHintText:
                        "text-white",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


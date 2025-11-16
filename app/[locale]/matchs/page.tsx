"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MatchesContent, Loading, SignInPrompt, UserHeader } from "@/components/matchs";
import Navbar from "@/components/Navbar";
import matchesLocales from "@/app/[locale]/matchs/locales.json";

type MatchesLocales = typeof matchesLocales;
type LocaleKey = keyof MatchesLocales;

export default function MatchesPage() {
    const { isSignedIn, user } = useUser();
    const [userBalance, setUserBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
  const [localeKey, setLocaleKey] = useState<LocaleKey>("fr");

    useEffect(() => {
    // derive locale from pathname: /{locale}/matchs
    try {
      const path = window.location.pathname;
      const maybeLocale = path.split("/")[1];
      const lk = (["en", "fr", "ko"].includes(maybeLocale) ? maybeLocale : "fr") as LocaleKey;
      setLocaleKey(lk);
    } catch {
      setLocaleKey("fr");
    }
        if (isSignedIn) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [isSignedIn]);

    const fetchUserData = async () => {
        try {
            const response = await fetch("/api/me");
            if (response.ok) {
                const userData = await response.json();
                setUserBalance(Number(userData.balance) || 0);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBalanceUpdate = (newBalance: number) => {
        setUserBalance(newBalance);
    };

    if (loading) return <Loading />;

    if (!isSignedIn) {
        return (
            <div className="relative min-h-screen">
                {/* Background image */}
                {/* <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/bg.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div> */}

                {/* Content */}
                <div className="relative z-10 min-h-screen flex flex-col">
                    {/* Navbar */}
                    <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
                        <Navbar />
                    </header>

                    {/* Sign In Prompt */}
                    <main className="flex-1">
                        <SignInPrompt copy={matchesLocales[localeKey].signin} />
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Background image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/bg.png"
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

                {/* Header with User Info */}
                <UserHeader
                    displayName={user?.firstName || user?.username || ""}
                    balance={userBalance}
                    copy={matchesLocales[localeKey].header}
                />

                {/* Main Content */}
                <main className="flex-1">
                    <MatchesContent
                        userBalance={userBalance}
                        onBalanceUpdate={handleBalanceUpdate}
                        listCopy={matchesLocales[localeKey].list}
                        cardCopy={matchesLocales[localeKey].card}
                        betModalCopy={matchesLocales[localeKey].betModal}
                        locale={localeKey}
                    />
                </main>
            </div>
        </div>
    );
}

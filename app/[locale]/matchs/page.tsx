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
            <div className="min-h-screen bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Navbar />
                </div>
        <SignInPrompt copy={matchesLocales[localeKey].signin} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Navbar />
            </div>

            {/* Header with User Info */}
      <UserHeader
        displayName={user?.firstName || user?.username || ""}
        balance={userBalance}
        copy={matchesLocales[localeKey].header}
      />

            {/* Main Content */}
      <MatchesContent
        userBalance={userBalance}
        onBalanceUpdate={handleBalanceUpdate}
        listCopy={matchesLocales[localeKey].list}
        cardCopy={matchesLocales[localeKey].card}
        betModalCopy={matchesLocales[localeKey].betModal}
        locale={localeKey}
      />
        </div>
    );
}

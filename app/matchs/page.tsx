"use client";

import React, { useState, useEffect } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { MatchList } from "@/components/matchs";
import Navbar from "@/components/Navbar";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/nextjs";

export default function MatchesPage() {
    const { isSignedIn, user } = useUser();
    const [userBalance, setUserBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Navbar />
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">
                            Connexion requise
                        </h1>
                        <p className="text-gray-300 mb-6">
                            Vous devez être connecté pour accéder aux matchs et placer des paris.
                        </p>
                        <ClerkProvider>
                                <SignedOut>
                                <SignInButton>
                                    <button
                                        type="button"
                                        className="bg-[#2621BF] w-full text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 cursor-pointer hover:bg-[#3c36e0] transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </ClerkProvider>
                    </div>
                </div>
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
            <div className="bg-gray-800 shadow-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Bonjour, {user?.firstName || user?.username} !
                            </h1>
                            <p className="text-gray-300">Bienvenue sur BetToLegend</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Solde disponible</p>
                            <p className="text-2xl font-bold text-green-400">
                                {Number(userBalance).toFixed(2)}€
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MatchList 
                    userBalance={userBalance}
                    onBalanceUpdate={handleBalanceUpdate}
                />
            </div>
        </div>
    );
}

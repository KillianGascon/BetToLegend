"use client";

import React, { useState, useEffect } from "react";
import MatchCard from "./MatchCard";
import BetModal from "./BetModal";

type Team = {
    id: string;
    name: string;
    tag: string;
    country?: string;
    logo_url?: string;
};

type Game = {
    id: string;
    name: string;
    category: string;
};

type Tournament = {
    id: string;
    name: string;
    prize_pool?: number;
};

type MatchOdds = {
    id: string;
    team_id: string;
    odds: number | string;
    teams: Team;
};

type Match = {
    id: string;
    team1_id?: string;
    team2_id?: string;
    game_id?: string;
    tournament_id?: string;
    match_date?: string;
    format?: string;
    status?: string;
    team1_score?: number;
    team2_score?: number;
    winner_id?: string;
    teams_matches_team1_idToteams?: Team;
    teams_matches_team2_idToteams?: Team;
    teams_matches_winner_idToteams?: Team;
    games?: Game;
    tournaments?: Tournament;
    match_odds?: MatchOdds[];
};

type MatchListProps = {
    readonly userBalance: number;
    readonly onBalanceUpdate: (newBalance: number) => void;
    readonly copy?: {
        headerTitle: string;
        headerSubtitle: string;
        loading: string;
        errorRetry: string;
        successPlaced: string;
        filters: { all: string; scheduled: string; live: string; completed: string };
        empty: {
            allTitle: string;
            allDescription: string;
            filteredTitle: string; // contains {status}
            filteredDescription: string; // contains {status}
        };
    };
    readonly cardCopy?: {
        unknownGame: string;
        status: { scheduled: string; live: string; completed: string };
        vs: string;
        tbd: string;
        winnerSuffix: string;
        betTitle: string;
        notAvailable: string;
        ctaView: string;
    };
    readonly betModalCopy?: {
        title: string;
        vs: string;
        betOn: string;
        selectedTeamFallback: string;
        odds: string;
        balanceLabel: string;
        amountLabel: string;
        amountPlaceholder: string;
        currencySuffix: string;
        quickAmountsTitle: string;
        potentialTitle: string;
        stakeLabel: string;
        profitLabel: string;
        errorInvalidAmount: string;
        errorInsufficient: string;
        errorMinAmount: string;
        errorGeneric: string;
        cancel: string;
        submitting: string;
        submit: string;
    };
    readonly locale?: string;
};

export default function MatchList({
    userBalance,
    onBalanceUpdate,
    copy,
    cardCopy,
    betModalCopy,
    locale,
}: MatchListProps) {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedOdds, setSelectedOdds] = useState<number>(0);
    const [isBetModalOpen, setIsBetModalOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "scheduled" | "live" | "completed">("all");

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/matches");
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des matchs");
            }
            const data = await response.json();
            setMatches(data);
        } catch (err) {
            console.error("Error fetching matches:", err);
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    const handleBetClick = (match: Match, teamId: string, odds: number) => {
        setSelectedMatch(match);
        setSelectedTeamId(teamId);
        setSelectedOdds(odds);
        setIsBetModalOpen(true);
    };

    const handlePlaceBet = async (amount: number) => {
        if (!selectedMatch || !selectedTeamId) return;

        try {
            const response = await fetch("/api/bets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    match_id: selectedMatch.id,
                    team_id: selectedTeamId,
                    amount: amount,
                    odds: selectedOdds,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erreur lors du placement du pari");
            }

            // Update user balance
            const newBalance = userBalance - amount;
            onBalanceUpdate(newBalance);

            // Close modal
            setIsBetModalOpen(false);
            setSelectedMatch(null);
            setSelectedTeamId(null);
            setSelectedOdds(0);

            // Show success message (you could add a toast notification here)
            alert(copy?.successPlaced ?? "Pari placé avec succès !");
        } catch (err) {
            // Re-throw error to be handled by BetModal component
            throw err;
        }
    };

    const filteredMatches = matches.filter(match => {
        if (filter === "all") return true;
        return match.status === filter;
    });

    const getFilterCounts = () => {
        return {
            all: matches.length,
            scheduled: matches.filter(m => m.status === "scheduled").length,
            live: matches.filter(m => m.status === "live").length,
            completed: matches.filter(m => m.status === "completed").length,
        };
    };

    const counts = getFilterCounts();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 lg:py-20">
                <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-legend-red"></div>
                <span className="mt-4 text-white font-montserrat text-base sm:text-lg lg:text-xl">
                    {copy?.loading ?? "Chargement des matchs..."}
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border-2 border-legend-red/50 rounded-[12px] p-6 lg:p-8">
                <p className="text-white font-montserrat text-base sm:text-lg mb-4">{error}</p>
                <button
                    onClick={fetchMatches}
                    className="px-6 py-3 bg-legend-red text-white rounded-[12px] font-montserrat font-medium hover:bg-legend-red/80 transition-colors duration-200 hover:scale-105 active:scale-95"
                >
                    {copy?.errorRetry ?? "Réessayer"}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 lg:space-y-12">
            {/* Header */}
            <div className="text-center space-y-3 lg:space-y-4">
                <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                    {copy?.headerTitle ?? "Matchs disponibles"}
                </h1>
                <p className="text-white/80 font-montserrat text-lg sm:text-xl lg:text-2xl">
                    {copy?.headerSubtitle ?? "Parier sur vos équipes favorites"}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 lg:gap-4 justify-center">
                {[
                    { key: "all", label: copy?.filters.all ?? "Tous", count: counts.all },
                    { key: "scheduled", label: copy?.filters.scheduled ?? "Prévus", count: counts.scheduled },
                    { key: "live", label: copy?.filters.live ?? "En cours", count: counts.live },
                    { key: "completed", label: copy?.filters.completed ?? "Terminés", count: counts.completed },
                ].map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as typeof filter)}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-[12px] text-sm sm:text-base font-montserrat font-medium transition-all duration-200 ${
                            filter === key
                                ? "bg-legend-blue text-white hover:bg-legend-blue/90 scale-105"
                                : "bg-legend-blue/20 border-2 border-legend-blue text-white hover:bg-legend-blue/30 hover:scale-105 active:scale-95"
                        }`}
                    >
                        {label} ({count})
                    </button>
                ))}
            </div>

            {/* Matches Grid */}
            {filteredMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredMatches.map((match) => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            locale={locale}
                            copy={cardCopy}
                            onBetClick={handleBetClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 lg:py-20">
                    <div className="text-6xl lg:text-8xl mb-6 lg:mb-8">🏆</div>
                    <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-3 lg:mb-4">
                        {filter === "all"
                            ? (copy?.empty.allTitle ?? "Aucun match")
                            : (copy?.empty.filteredTitle ?? "Aucun match {status}").replace(
                                  "{status}",
                                  copy?.filters[filter] ?? filter
                              )}
                    </h3>
                    <p className="text-white/70 font-montserrat text-base sm:text-lg lg:text-xl">
                        {filter === "all"
                            ? (copy?.empty.allDescription ?? "Il n'y a pas de matchs disponibles pour le moment.")
                            : (copy?.empty.filteredDescription ?? "Il n'y a pas de matchs {status} pour le moment.").replace(
                                  "{status}",
                                  copy?.filters[filter] ?? filter
                              )}
                    </p>
                </div>
            )}

            {/* Bet Modal */}
            <BetModal
                isOpen={isBetModalOpen}
                onClose={() => {
                    setIsBetModalOpen(false);
                    setSelectedMatch(null);
                    setSelectedTeamId(null);
                    setSelectedOdds(0);
                }}
                match={selectedMatch}
                selectedTeamId={selectedTeamId}
                odds={selectedOdds}
                userBalance={userBalance}
                onPlaceBet={handlePlaceBet}
            copy={betModalCopy}
            />
        </div>
    );
}

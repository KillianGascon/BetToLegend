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
    odds: number;
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
};

export default function MatchList({ userBalance, onBalanceUpdate }: MatchListProps) {
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
            alert("Pari placé avec succès !");
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
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-300">Chargement des matchs...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4">
                <p className="text-red-300">{error}</p>
                <button
                    onClick={fetchMatches}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Matchs disponibles</h1>
                <p className="text-gray-300">Parier sur vos équipes favorites</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
                {[
                    { key: "all", label: "Tous", count: counts.all },
                    { key: "scheduled", label: "Prévus", count: counts.scheduled },
                    { key: "live", label: "En cours", count: counts.live },
                    { key: "completed", label: "Terminés", count: counts.completed },
                ].map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as typeof filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            filter === key
                                ? "bg-[#2621BF] text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        {label} ({count})
                    </button>
                ))}
            </div>

            {/* Matches Grid */}
            {filteredMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.map((match) => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            onBetClick={handleBetClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏆</div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        Aucun match {filter === "all" ? "" : filter}
                    </h3>
                    <p className="text-gray-400">
                        {filter === "all" 
                            ? "Il n'y a pas de matchs disponibles pour le moment."
                            : `Il n'y a pas de matchs ${filter} pour le moment.`
                        }
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
            />
        </div>
    );
}

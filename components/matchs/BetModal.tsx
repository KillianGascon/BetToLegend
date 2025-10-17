"use client";

import React, { useState, useEffect } from "react";

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
};

type BetModalProps = {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly match: Match | null;
    readonly selectedTeamId: string | null;
    readonly odds: number;
    readonly userBalance: number;
    readonly onPlaceBet: (amount: number) => Promise<void>;
};

export default function BetModal({ 
    isOpen, 
    onClose, 
    match, 
    selectedTeamId, 
    odds, 
    userBalance,
    onPlaceBet 
}: BetModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setAmount("");
            setError("");
        }
    }, [isOpen]);

    const handleAmountChange = (value: string) => {
        // Only allow numbers and decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            setError("");
        }
    };

    const handleQuickAmount = (value: number) => {
        setAmount(value.toString());
        setError("");
    };

    const calculatePotentialPayout = () => {
        const numAmount = Number.parseFloat(amount);
        if (Number.isNaN(numAmount) || numAmount <= 0) return 0;
        return numAmount * odds;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const numAmount = Number.parseFloat(amount);
        
        if (Number.isNaN(numAmount) || numAmount <= 0) {
            setError("Veuillez entrer un montant valide");
            return;
        }
        
        if (numAmount > userBalance) {
            setError("Solde insuffisant");
            return;
        }
        
        if (numAmount < 1) {
            setError("Le montant minimum est de 1€");
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {
            await onPlaceBet(numAmount);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du placement du pari");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !match || !selectedTeamId) return null;

    const selectedTeam = selectedTeamId === match.team1_id 
        ? match.teams_matches_team1_idToteams 
        : match.teams_matches_team2_idToteams;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Placer un pari</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Match Info */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {match.teams_matches_team1_idToteams?.logo_url && (
                                <img 
                                    src={match.teams_matches_team1_idToteams.logo_url} 
                                    alt={match.teams_matches_team1_idToteams.name}
                                    className="w-6 h-6 rounded-full"
                                />
                            )}
                            <span className="text-sm font-medium">
                                {match.teams_matches_team1_idToteams?.name || "Team 1"}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">VS</span>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">
                                {match.teams_matches_team2_idToteams?.name || "Team 2"}
                            </span>
                            {match.teams_matches_team2_idToteams?.logo_url && (
                                <img 
                                    src={match.teams_matches_team2_idToteams.logo_url} 
                                    alt={match.teams_matches_team2_idToteams.name}
                                    className="w-6 h-6 rounded-full"
                                />
                            )}
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        {match.games?.name} • {match.format}
                    </div>
                </div>

                {/* Betting Info */}
                <div className="p-6">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Vous pariez sur</p>
                                <p className="font-semibold text-blue-900">
                                    {selectedTeam?.name || "Équipe sélectionnée"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Cote</p>
                                <p className="text-lg font-bold text-blue-900">{odds.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Solde disponible</p>
                        <p className="text-lg font-semibold text-green-600">{Number(userBalance).toFixed(2)}€</p>
                    </div>

                    {/* Amount Input */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="bet-amount" className="block text-sm font-medium text-gray-700 mb-2">
                                Montant du pari
                            </label>
                            <div className="relative">
                                <input
                                    id="bet-amount"
                                    type="text"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="absolute right-3 top-2 text-gray-500">€</span>
                            </div>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Montants rapides</p>
                            <div className="grid grid-cols-4 gap-2">
                                {[5, 10, 25, 50].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleQuickAmount(value)}
                                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        {value}€
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Potential Payout */}
                        {amount && Number.parseFloat(amount) > 0 && (
                            <div className="bg-green-50 rounded-lg p-4 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Gains potentiels</span>
                                    <span className="text-lg font-bold text-green-600">
                                        {calculatePotentialPayout().toFixed(2)}€
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                    <span>Mise: {amount}€</span>
                                    <span>Profit: {(calculatePotentialPayout() - Number.parseFloat(amount)).toFixed(2)}€</span>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !amount || Number.parseFloat(amount) <= 0}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? "Placement..." : "Placer le pari"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

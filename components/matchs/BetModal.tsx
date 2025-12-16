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
    readonly copy?: {
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
        errorMinAmount: string; // contains {min}
        errorGeneric: string;
        cancel: string;
        submitting: string;
        submit: string;
    };
};

export default function BetModal({ 
    isOpen, 
    onClose, 
    match, 
    selectedTeamId, 
    odds, 
    userBalance,
    onPlaceBet,
    copy
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
            setError(copy?.errorInvalidAmount ?? "Veuillez entrer un montant valide");
            return;
        }
        
        if (numAmount > userBalance) {
            setError(copy?.errorInsufficient ?? "Solde insuffisant");
            return;
        }
        
        if (numAmount < 1) {
            const msg = (copy?.errorMinAmount ?? "Le montant minimum est de {min}€").replace("{min}", "1");
            setError(msg);
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {
            await onPlaceBet(numAmount);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : (copy?.errorGeneric ?? "Erreur lors du placement du pari"));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !match || !selectedTeamId) return null;

    const selectedTeam = selectedTeamId === match.team1_id 
        ? match.teams_matches_team1_idToteams 
        : match.teams_matches_team2_idToteams;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-legend-blue/95 border-2 border-legend-blue rounded-[12px] shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                    <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white">
                        {copy?.title ?? "Placer un pari"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-[8px]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Match Info */}
                <div className="p-6 border-b border-white/20 bg-white/5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                            {match.teams_matches_team1_idToteams?.logo_url && (
                                <img 
                                    src={match.teams_matches_team1_idToteams.logo_url} 
                                    alt={match.teams_matches_team1_idToteams.name}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                            )}
                            <span className="text-sm sm:text-base font-montserrat font-medium text-white truncate">
                                {match.teams_matches_team1_idToteams?.name || "Team 1"}
                            </span>
                        </div>
                        <span className="text-sm sm:text-base font-montserrat font-bold text-white flex-shrink-0">
                            {copy?.vs ?? "VS"}
                        </span>
                        <div className="flex items-center space-x-3 min-w-0 flex-1 justify-end">
                            <span className="text-sm sm:text-base font-montserrat font-medium text-white truncate">
                                {match.teams_matches_team2_idToteams?.name || "Team 2"}
                            </span>
                            {match.teams_matches_team2_idToteams?.logo_url && (
                                <img 
                                    src={match.teams_matches_team2_idToteams.logo_url} 
                                    alt={match.teams_matches_team2_idToteams.name}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                            )}
                        </div>
                    </div>
                    <div className="mt-3 text-sm text-white/70 font-montserrat">
                        {match.games?.name} • {match.format}
                    </div>
                </div>

                {/* Betting Info */}
                <div className="p-6">
                    <div className="bg-legend-blue/30 border-2 border-legend-blue rounded-[12px] p-4 mb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-white/70 font-montserrat mb-1">
                                    {copy?.betOn ?? "Vous pariez sur"}
                                </p>
                                <p className="text-base sm:text-lg font-montserrat font-bold text-white">
                                    {selectedTeam?.name || copy?.selectedTeamFallback || "Équipe sélectionnée"}
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm text-white/70 font-montserrat mb-1">
                                    {copy?.odds ?? "Cote"}
                                </p>
                                <p className="text-xl sm:text-2xl font-montserrat font-extrabold text-legend-red">
                                    {odds.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-4 bg-white/5 rounded-[12px] p-4">
                        <p className="text-sm text-white/70 font-montserrat mb-1">
                            {copy?.balanceLabel ?? "Solde disponible"}
                        </p>
                        <p className="text-xl sm:text-2xl font-montserrat font-extrabold text-legend-red">
                            {Number(userBalance).toFixed(2)}
                            {copy?.currencySuffix ?? "€"}
                        </p>
                    </div>

                    {/* Amount Input */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="bet-amount" className="block text-sm sm:text-base font-montserrat font-medium text-white mb-2">
                                {copy?.amountLabel ?? "Montant du pari"}
                            </label>
                            <div className="relative">
                                <input
                                    id="bet-amount"
                                    type="text"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder={copy?.amountPlaceholder ?? "0.00"}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                                />
                                <span className="absolute right-4 top-3 text-white/70 font-montserrat">
                                    {copy?.currencySuffix ?? "€"}
                                </span>
                            </div>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="mb-4">
                            <p className="text-sm sm:text-base text-white/70 font-montserrat mb-3">
                                {copy?.quickAmountsTitle ?? "Montants rapides"}
                            </p>
                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                {[5, 10, 25, 50].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleQuickAmount(value)}
                                        className="px-3 py-2 text-sm bg-legend-blue/30 border-2 border-legend-blue text-white rounded-[8px] hover:bg-legend-blue/50 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {value}
                                        {copy?.currencySuffix ?? "€"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Potential Payout */}
                        {amount && Number.parseFloat(amount) > 0 && (
                            <div className="bg-legend-red/20 border-2 border-legend-red rounded-[12px] p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm sm:text-base text-white/70 font-montserrat">
                                        {copy?.potentialTitle ?? "Gains potentiels"}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-montserrat font-extrabold text-legend-red">
                                        {calculatePotentialPayout().toFixed(2)}
                                        {copy?.currencySuffix ?? "€"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-white/60 font-montserrat">
                                    <span>
                                        {copy?.stakeLabel ?? "Mise"}: {amount}
                                        {copy?.currencySuffix ?? "€"}
                                    </span>
                                    <span>
                                        {copy?.profitLabel ?? "Profit"}:{" "}
                                        {(calculatePotentialPayout() - Number.parseFloat(amount)).toFixed(2)}
                                        {copy?.currencySuffix ?? "€"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-legend-red/20 border-2 border-legend-red rounded-[12px] p-3 mb-4">
                                <p className="text-sm text-white font-montserrat">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/30 text-white rounded-[12px] hover:bg-white/20 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copy?.cancel ?? "Annuler"}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !amount || Number.parseFloat(amount) <= 0}
                                className="flex-1 px-4 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 disabled:bg-white/20 disabled:border-2 disabled:border-white/30 disabled:cursor-not-allowed font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                            >
                                {isLoading ? (copy?.submitting ?? "Placement...") : (copy?.submit ?? "Placer le pari")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

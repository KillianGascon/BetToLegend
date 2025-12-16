"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

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

type MatchCardProps = {
    readonly match: Match;
    readonly onBetClick: (match: Match, teamId: string, odds: number) => void;
    readonly copy?: {
        unknownGame: string;
        status: { scheduled: string; live: string; completed: string };
        vs: string;
        tbd: string;
        winnerSuffix: string;
        betTitle: string;
        notAvailable: string;
        ctaView: string;
    };
    readonly locale?: string;
};

export default function MatchCard({ match, onBetClick, copy, locale }: MatchCardProps) {

    const formatDate = (dateString?: string) => {
        if (!dateString) return copy?.tbd ?? "TBD";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-100 text-blue-800";
            case "live":
                return "bg-green-100 text-green-800";
            case "completed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const toNum = (v: unknown) => {
        if (v === null || v === undefined) return undefined;
        const n = typeof v === "string" ? parseFloat(v) : Number(v);
        return Number.isFinite(n) ? n : undefined;
    };    

    const getOddsForTeam = (teamId: string) => {
        const row = match.match_odds?.find(odd => odd.team_id === teamId);
        const n = toNum(row?.odds);
        return n && n > 0 ? n : 1; // fallback 1 si pas de valeur valide
    };
    

    const getStatusText = (status?: string) => {
        switch (status) {
            case "scheduled":
                return "Prévu";
            case "live":
                return "En cours";
            case "completed":
                return "Terminé";
            default:
                return status || "";
        }
    };

    const canBet = match.status === "live" && match.match_odds && match.match_odds.length > 0;

    return (
        <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8 hover:bg-legend-blue/30 hover:border-legend-red/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-sm sm:text-base font-montserrat font-medium text-white/90">
                        {match.games?.name || copy?.unknownGame || "Unknown Game"}
                    </span>
                    {match.tournaments && (
                        <span className="text-xs sm:text-sm bg-legend-red/30 border border-legend-red text-white px-3 py-1 rounded-[8px] font-montserrat font-medium">
                            {match.tournaments.name}
                        </span>
                    )}
                </div>
                <span
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-[8px] text-xs sm:text-sm font-montserrat font-medium ${
                        match.status === "live"
                            ? "bg-legend-red text-white"
                            : match.status === "scheduled"
                              ? "bg-legend-blue text-white"
                              : "bg-white/20 text-white/80"
                    }`}
                >
                    {copy?.status?.[match.status as keyof typeof copy.status] ?? getStatusText(match.status)}
                </span>
            </div>

            {/* Teams */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-6">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    {match.teams_matches_team1_idToteams?.logo_url ? (
                        <Image
                            src={match.teams_matches_team1_idToteams.logo_url}
                            alt={match.teams_matches_team1_idToteams.name}
                            width={48}
                            height={48}
                            className="rounded-full object-contain flex-shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg font-montserrat font-bold text-white">
                                {match.teams_matches_team1_idToteams?.tag?.charAt(0) || "?"}
                            </span>
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-white truncate">
                            {match.teams_matches_team1_idToteams?.name || "Team 1"}
                        </h3>
                        <p className="text-sm sm:text-base text-white/70 font-montserrat">
                            {match.teams_matches_team1_idToteams?.tag || "T1"}
                        </p>
                    </div>
                </div>

                <div className="text-center flex-shrink-0">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-extrabold text-white">
                        {match.status === "finished" || match.status === "completed"
                            ? `${match.team1_score || 0} - ${match.team2_score || 0}`
                            : (copy?.vs ?? "VS")}
                    </div>
                    {match.format && (
                        <div className="text-xs sm:text-sm text-white/60 font-montserrat mt-1">{match.format}</div>
                    )}
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0 justify-end">
                    <div className="text-right min-w-0">
                        <h3 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-white truncate">
                            {match.teams_matches_team2_idToteams?.name || "Team 2"}
                        </h3>
                        <p className="text-sm sm:text-base text-white/70 font-montserrat">
                            {match.teams_matches_team2_idToteams?.tag || "T2"}
                        </p>
                    </div>
                    {match.teams_matches_team2_idToteams?.logo_url ? (
                        <Image
                            src={match.teams_matches_team2_idToteams.logo_url}
                            alt={match.teams_matches_team2_idToteams.name}
                            width={48}
                            height={48}
                            className="rounded-full object-contain flex-shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-base sm:text-lg font-montserrat font-bold text-white">
                                {match.teams_matches_team2_idToteams?.tag?.charAt(0) || "?"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-sm sm:text-base text-white/70 font-montserrat mb-6 pb-6 border-b border-white/10">
                <span className="flex items-center gap-2">📅 {formatDate(match.match_date)}</span>
                {(match.status === "finished" || match.status === "completed") &&
                    match.teams_matches_winner_idToteams && (
                        <span className="text-legend-red font-montserrat font-bold flex items-center gap-2">
                            🏆 {match.teams_matches_winner_idToteams.name} {copy?.winnerSuffix ?? "gagne"}
                        </span>
                    )}
            </div>

            {/* Betting Section */}
            {canBet && (
                <div className="mb-6">
                    <h4 className="text-sm sm:text-base font-montserrat font-medium text-white mb-4">
                        {copy?.betTitle ?? "Parier sur ce match"}
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {match.team1_id && (
                            <button
                                onClick={() =>
                                    onBetClick(
                                        match,
                                        match.team1_id as string,
                                        getOddsForTeam(match.team1_id as string)
                                    )
                                }
                                className="flex-1 bg-legend-blue text-white py-3 px-4 rounded-[12px] hover:bg-legend-blue/80 transition-all duration-200 text-sm sm:text-base font-montserrat font-medium hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="truncate">{match.teams_matches_team1_idToteams?.name || "Team 1"}</span>
                                <span className="bg-white/20 px-2 py-1 rounded-[8px] text-xs font-bold flex-shrink-0">
                                    {getOddsForTeam(match.team1_id as string).toFixed(2)}
                                </span>
                            </button>
                        )}
                        {match.team2_id && (
                            <button
                                onClick={() =>
                                    onBetClick(
                                        match,
                                        match.team2_id as string,
                                        getOddsForTeam(match.team2_id as string)
                                    )
                                }
                                className="flex-1 bg-legend-red text-white py-3 px-4 rounded-[12px] hover:bg-legend-red/80 transition-all duration-200 text-sm sm:text-base font-montserrat font-medium hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="truncate">{match.teams_matches_team2_idToteams?.name || "Team 2"}</span>
                                <span className="bg-white/20 px-2 py-1 rounded-[8px] text-xs font-bold flex-shrink-0">
                                    {getOddsForTeam(match.team2_id as string).toFixed(2)}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!canBet && match.status === "scheduled" && (
                <div className="mb-6 text-center text-sm sm:text-base text-white/60 font-montserrat">
                    {copy?.notAvailable ?? "Les cotes ne sont pas encore disponibles pour ce match"}
                </div>
            )}

            {/* CTA vers la page du match */}
            <div className="flex justify-end">
                <Link
                    href={`/${locale ?? ""}/matchs/${match.id}`.replace("//", "/")}
                    className="inline-flex items-center gap-2 bg-legend-blue/30 border-2 border-legend-blue text-white text-sm sm:text-base font-montserrat font-medium rounded-[12px] px-4 sm:px-6 py-2 sm:py-3 hover:bg-legend-blue/50 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    {copy?.ctaView ?? "Voir le match"}
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
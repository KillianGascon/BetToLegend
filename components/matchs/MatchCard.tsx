"use client";

import React from "react";

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

type MatchCardProps = {
    readonly match: Match;
    readonly onBetClick: (match: Match, teamId: string, odds: number) => void;
};

export default function MatchCard({ match, onBetClick }: MatchCardProps) {

    const formatDate = (dateString?: string) => {
        if (!dateString) return "TBD";
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
            case "ongoing":
                return "bg-green-100 text-green-800";
            case "finished":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getOddsForTeam = (teamId: string) => {
        const odds = match.match_odds?.find(odd => odd.team_id === teamId);
        return odds?.odds || 1;
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case "scheduled":
                return "Prévu";
            case "ongoing":
                return "En cours";
            case "finished":
                return "Terminé";
            default:
                return status || "";
        }
    };

    const canBet = match.status === "scheduled" && match.match_odds && match.match_odds.length > 0;

    return (
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-400">
                        {match.games?.name || "Unknown Game"}
                    </span>
                    {match.tournaments && (
                        <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
                            {match.tournaments.name}
                        </span>
                    )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                    {getStatusText(match.status)}
                </span>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {match.teams_matches_team1_idToteams?.logo_url ? (
                        <img 
                            src={match.teams_matches_team1_idToteams.logo_url} 
                            alt={match.teams_matches_team1_idToteams.name}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">
                                {match.teams_matches_team1_idToteams?.tag?.charAt(0) || "?"}
                            </span>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-white">
                            {match.teams_matches_team1_idToteams?.name || "Team 1"}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {match.teams_matches_team1_idToteams?.tag || "T1"}
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                        {match.status === "finished" ? 
                            `${match.team1_score || 0} - ${match.team2_score || 0}` : 
                            "VS"
                        }
                    </div>
                    {match.format && (
                        <div className="text-xs text-gray-400 mt-1">
                            {match.format}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <h3 className="font-semibold text-white">
                            {match.teams_matches_team2_idToteams?.name || "Team 2"}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {match.teams_matches_team2_idToteams?.tag || "T2"}
                        </p>
                    </div>
                    {match.teams_matches_team2_idToteams?.logo_url ? (
                        <img 
                            src={match.teams_matches_team2_idToteams.logo_url} 
                            alt={match.teams_matches_team2_idToteams.name}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">
                                {match.teams_matches_team2_idToteams?.tag?.charAt(0) || "?"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Match Info */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>📅 {formatDate(match.match_date)}</span>
                {match.status === "finished" && match.teams_matches_winner_idToteams && (
                    <span className="text-green-400 font-medium">
                        🏆 {match.teams_matches_winner_idToteams.name} gagne
                    </span>
                )}
            </div>

            {/* Betting Section */}
            {canBet && (
                <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Parier sur ce match</h4>
                    <div className="flex space-x-3">
                        {match.team1_id && (
                            <button
                                onClick={() => match.team1_id && onBetClick(match, match.team1_id, getOddsForTeam(match.team1_id))}
                                className="flex-1 bg-[#2621BF] text-white py-2 px-4 rounded-md hover:bg-[#3c36e0] transition-colors text-sm font-medium"
                            >
                                {match.teams_matches_team1_idToteams?.name || "Team 1"}
                                <span className="ml-2 text-xs bg-[#3c36e0] px-2 py-1 rounded">
                                    {match.team1_id && getOddsForTeam(match.team1_id).toFixed(2)}
                                </span>
                            </button>
                        )}
                        {match.team2_id && (
                            <button
                                onClick={() => match.team2_id && onBetClick(match, match.team2_id, getOddsForTeam(match.team2_id))}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                {match.teams_matches_team2_idToteams?.name || "Team 2"}
                                <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded">
                                    {match.team2_id && getOddsForTeam(match.team2_id).toFixed(2)}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!canBet && match.status === "scheduled" && (   
                <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
                    Les cotes ne sont pas encore disponibles pour ce match
                </div>
            )}
        </div>
    );
}
import React from "react";

type Team = {
    id: string;
    name: string;
    tag: string;
    country?: string;
    logo_url?: string;
    founded_year?: number;
};

type Game = {
    id: string;
    name: string;
    category: string;
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
};

type Tournament = {
    id: string;
    name: string;
    game_id?: string;
    prize_pool?: number;
    start_date?: string;
    end_date?: string;
    location?: string;
    status?: string;
};

type MatchesSectionProps = {
    matches: Match[];
    matchForm: Partial<Match>;
    editingMatchId: string | null;
    teams: Team[];
    games: Game[];
    tournaments: Tournament[];
    onSubmit: (e: React.FormEvent) => void;
    cancelEditMatch: () => void;
    startEditingMatch: (match: Match) => void;
    deleteMatch: (id: string) => void;
    assignMatchToTournament: (matchId: string, tournamentId: string) => void;
    setMatchForm: (updater: Partial<Match>) => void;
};

export default function MatchesSection(props: MatchesSectionProps) {
    const {
        matches,
        matchForm,
        editingMatchId,
        teams,
        games,
        tournaments,
        onSubmit,
        cancelEditMatch,
        startEditingMatch,
        deleteMatch,
        assignMatchToTournament,
        setMatchForm,
    } = props;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">🎮 Gestion des matchs</h2>
                <p className="text-gray-300">Créez et gérez les matchs entre équipes</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingMatchId ? "Modifier le match" : "Créer un nouveau match"}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Jeu
                            </label>
                            <select
                                value={matchForm.game_id || ""}
                                onChange={(e) => setMatchForm({...matchForm, game_id: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Sélectionner un jeu --</option>
                                {games.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Format
                            </label>
                            <input
                                type="text"
                                placeholder="Format (ex: BO3)"
                                value={matchForm.format || ""}
                                onChange={(e) => setMatchForm({...matchForm, format: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Équipe 1
                            </label>
                            <select
                                value={matchForm.team1_id || ""}
                                onChange={(e) => setMatchForm({...matchForm, team1_id: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Sélectionner --</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Équipe 2
                            </label>
                            <select
                                value={matchForm.team2_id || ""}
                                onChange={(e) => setMatchForm({...matchForm, team2_id: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Sélectionner --</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Date du match
                            </label>
                            <input
                                type="datetime-local"
                                value={matchForm.match_date || ""}
                                onChange={(e) =>
                                    setMatchForm({...matchForm, match_date: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Statut
                            </label>
                            <select
                                value={matchForm.status || "scheduled"}
                                onChange={(e) => setMatchForm({...matchForm, status: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="scheduled">Prévu</option>
                                <option value="live">En cours</option>
                                <option value="completed">Terminé</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                        >
                            {editingMatchId ? "Mettre à jour le match" : "Créer match"}
                        </button>
                        {editingMatchId && (
                            <button
                                type="button"
                                onClick={cancelEditMatch}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Matches List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Matchs existants</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {matches.map((m) => (
                        <div key={m.id} className="p-6 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">
                                        {teams.find((t) => t.id === m.team1_id)?.name || "?"} vs{" "}
                                        {teams.find((t) => t.id === m.team2_id)?.name || "?"}
                                    </h4>
                                    <p className="text-gray-300">
                                        {games.find((g) => g.id === m.game_id)?.name || "?"} • {m.status} • {m.format || "?"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        🏆 Tournoi:{" "}
                                        {m.tournament_id
                                            ? tournaments.find((t) => t.id === m.tournament_id)?.name || "—"
                                            : "Aucun"}
                                    </p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEditingMatch(m)}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => deleteMatch(m.id)}
                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                    <select
                                        defaultValue=""
                                        onChange={(e) =>
                                            assignMatchToTournament(m.id, e.target.value)
                                        }
                                        className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Assigner à un tournoi --</option>
                                        {tournaments.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    {matches.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            Aucun match créé pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

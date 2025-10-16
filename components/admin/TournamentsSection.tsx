import React from "react";

type Game = {
    id: string;
    name: string;
    category: string;
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

type TournamentsSectionProps = {
    tournaments: Tournament[];
    tournamentForm: Partial<Tournament>;
    editingTournamentId: string | null;
    games: Game[];
    onSubmit: (e: React.FormEvent) => void;
    cancelEditTournament: () => void;
    startEditingTournament: (tournament: Tournament) => void;
    deleteTournament: (id: string) => void;
    setTournamentForm: (updater: Partial<Tournament>) => void;
};

export default function TournamentsSection(props: TournamentsSectionProps) {
    const {
        tournaments,
        tournamentForm,
        editingTournamentId,
        games,
        onSubmit,
        cancelEditTournament,
        startEditingTournament,
        deleteTournament,
        setTournamentForm,
    } = props;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">🏆 Gestion des tournois</h2>
                <p className="text-gray-300">Créez et gérez les tournois de votre plateforme</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingTournamentId ? "Modifier le tournoi" : "Créer un nouveau tournoi"}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Nom du tournoi
                            </label>
                            <input
                                type="text"
                                placeholder="Nom du tournoi"
                                value={tournamentForm.name || ""}
                                onChange={(e) =>
                                    setTournamentForm({...tournamentForm, name: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Jeu associé
                            </label>
                            <select
                                value={tournamentForm.game_id || ""}
                                onChange={(e) =>
                                    setTournamentForm({...tournamentForm, game_id: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                Prize Pool (€)
                            </label>
                            <input
                                type="number"
                                placeholder="Prize Pool (€)"
                                value={tournamentForm.prize_pool || ""}
                                onChange={(e) =>
                                    setTournamentForm({
                                        ...tournamentForm,
                                        prize_pool: Number(e.target.value),
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Lieu
                            </label>
                            <input
                                type="text"
                                placeholder="Lieu"
                                value={tournamentForm.location || ""}
                                onChange={(e) =>
                                    setTournamentForm({
                                        ...tournamentForm,
                                        location: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={tournamentForm.start_date || ""}
                                onChange={(e) =>
                                    setTournamentForm({
                                        ...tournamentForm,
                                        start_date: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={tournamentForm.end_date || ""}
                                onChange={(e) =>
                                    setTournamentForm({
                                        ...tournamentForm,
                                        end_date: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Statut
                            </label>
                            <select
                                value={tournamentForm.status || "upcoming"}
                                onChange={(e) =>
                                    setTournamentForm({
                                        ...tournamentForm,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="upcoming">À venir</option>
                                <option value="ongoing">En cours</option>
                                <option value="finished">Terminé</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                        >
                            {editingTournamentId ? "Modifier le tournoi" : "Créer tournoi"}
                        </button>
                        {editingTournamentId && (
                            <button
                                type="button"
                                onClick={cancelEditTournament}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tournaments List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Tournois existants</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {tournaments.map((t) => (
                        <div key={t.id} className="p-6 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">{t.name}</h4>
                                    <p className="text-gray-300">
                                        {games.find((g) => g.id === t.game_id)?.name || "?"} • {t.status}
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-400">
                                            💰 Prize Pool: {t.prize_pool ? `${t.prize_pool} €` : "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            📅 {t.start_date
                                                ? new Date(t.start_date).toLocaleDateString("fr-FR")
                                                : "?"}{" "}
                                            →{" "}
                                            {t.end_date
                                                ? new Date(t.end_date).toLocaleDateString("fr-FR")
                                                : "?"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            📍 {t.location || "—"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditingTournament(t)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => deleteTournament(t.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tournaments.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            Aucun tournoi créé pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

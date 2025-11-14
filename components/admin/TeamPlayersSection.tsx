import React from "react";

type Team = {
    id: string;
    name: string;
    tag: string;
    country?: string;
    logo_url?: string;
    founded_year?: number;
};

type Player = {
    id: string;
    username: string;
    real_name?: string;
    country?: string;
    age?: number;
    role?: string;
    avatar_url?: string;
    twitch_followers?: number;
    youtube_subscribers?: number;
};

type TeamPlayer = {
    id: string;
    team_id: string;
    player_id: string;
    position: string;
    salary: number;
    join_date: string;
    players?: Player;
    teams?: Team;
};

type TeamPlayerForm = {
    team_id: string;
    player_id: string;
    position: string;
    salary: number;
    join_date: string;
};

type TeamPlayersSectionProps = {
    teamPlayers: TeamPlayer[];
    teamPlayerForm: TeamPlayerForm;
    teams: Team[];
    players: Player[];
    onSubmit: (e: React.FormEvent) => void;
    setTeamPlayerForm: (updater: TeamPlayerForm) => void;
    removePlayerFromTeam: (id: string) => void;
};

export default function TeamPlayersSection(props: TeamPlayersSectionProps) {
    const {
        teamPlayers,
        teamPlayerForm,
        teams,
        players,
        onSubmit,
        setTeamPlayerForm,
        removePlayerFromTeam,
    } = props;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">👥 Gestion des joueurs dans les équipes</h2>
                <p className="text-gray-300">Assignez des joueurs aux équipes et gérez leurs rôles</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ajouter un joueur à une équipe</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Équipe
                            </label>
                            <select
                                value={teamPlayerForm.team_id}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, team_id: e.target.value})
                                }
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
                                Joueur
                            </label>
                            <select
                                value={teamPlayerForm.player_id}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, player_id: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Sélectionner --</option>
                                {players.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Poste
                            </label>
                            <input
                                type="text"
                                placeholder="Poste (ex: ADC)"
                                value={teamPlayerForm.position}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, position: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Salaire
                            </label>
                            <input
                                type="number"
                                placeholder="Salaire (€)"
                                value={teamPlayerForm.salary}
                                onChange={(e) =>
                                    setTeamPlayerForm({
                                        ...teamPlayerForm,
                                        salary: parseFloat(e.target.value),
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Date d'entrée
                            </label>
                            <input
                                type="date"
                                value={teamPlayerForm.join_date}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, join_date: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                    >
                        Ajouter joueur à l'équipe
                    </button>
                </form>
            </div>

            {/* Team Players List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Assignations actuelles</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {teamPlayers.map((tp) => (
                        <div key={tp.id} className="p-6 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-white">
                                        {tp.players?.username} → {tp.teams?.name}
                                    </h4>
                                    <p className="text-gray-300">
                                        Poste: {tp.position || "Non défini"} • Salaire: {tp.salary || 0}€
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        📅 Entré le{" "}
                                        {tp.join_date
                                            ? new Date(tp.join_date).toLocaleDateString("fr-FR")
                                            : "—"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removePlayerFromTeam(tp.id)}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Retirer
                                </button>
                            </div>
                        </div>
                    ))}
                    {teamPlayers.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            Aucune assignation pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

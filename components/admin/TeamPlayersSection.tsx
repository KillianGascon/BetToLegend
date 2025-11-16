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
    copy: {
        headerTitle: string;
        headerSubtitle: string;
        formTitle: string;
        labels: {
            team: string;
            player: string;
            position: string;
            salary: string;
            joinDate: string;
        };
        placeholders: {
            position: string;
            salary: string;
        };
        buttons: {
            submit: string;
            remove: string;
        };
        listTitle: string;
        empty: string;
        misc: {
            position: string;
            salary: string;
            enteredOn: string;
        };
    };
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
        copy,
    } = props;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{copy.headerTitle}</h2>
                <p className="text-gray-300">{copy.headerSubtitle}</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{copy.formTitle}</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.team}
                            </label>
                            <select
                                value={teamPlayerForm.team_id}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, team_id: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">--</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.player}
                            </label>
                            <select
                                value={teamPlayerForm.player_id}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, player_id: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">--</option>
                                {players.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.position}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.position}
                                value={teamPlayerForm.position}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, position: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.salary}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.salary}
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
                                {copy.labels.joinDate}
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
                        {copy.buttons.submit}
                    </button>
                </form>
            </div>

            {/* Team Players List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{copy.listTitle}</h3>
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
                                        {copy.misc.position}: {tp.position || "—"} • {copy.misc.salary}: {tp.salary || 0}€
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {copy.misc.enteredOn}{" "}
                                        {tp.join_date
                                            ? new Date(tp.join_date).toLocaleDateString("fr-FR")
                                            : "—"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removePlayerFromTeam(tp.id)}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    {copy.buttons.remove}
                                </button>
                            </div>
                        </div>
                    ))}
                    {teamPlayers.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            {copy.empty}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

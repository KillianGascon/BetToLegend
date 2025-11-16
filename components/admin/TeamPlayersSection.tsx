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
        <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3">
                    {copy.headerTitle}
                </h2>
                <p className="text-white/80 font-montserrat text-base sm:text-lg lg:text-xl">
                    {copy.headerSubtitle}
                </p>
            </div>

            {/* Form */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-white mb-6">{copy.formTitle}</h3>
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.team}
                            </label>
                            <select
                                value={teamPlayerForm.team_id}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, team_id: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
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
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.player}
                            </label>
                            <select
                                value={teamPlayerForm.player_id}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, player_id: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
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
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.position}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.position}
                                value={teamPlayerForm.position}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, position: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
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
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.joinDate}
                            </label>
                            <input
                                type="date"
                                value={teamPlayerForm.join_date}
                                onChange={(e) =>
                                    setTeamPlayerForm({...teamPlayerForm, join_date: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        {copy.buttons.submit}
                    </button>
                </form>
            </div>

            {/* Team Players List */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/20">
                    <h3 className="font-montserrat font-bold text-lg sm:text-xl text-white">{copy.listTitle}</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {teamPlayers.map((tp) => (
                        <div key={tp.id} className="p-6 hover:bg-legend-blue/30 transition-colors duration-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                                        {tp.players?.username} → {tp.teams?.name}
                                    </h4>
                                    <p className="text-white/70 font-montserrat text-sm sm:text-base mb-1">
                                        {copy.misc.position}: {tp.position || "—"} • {copy.misc.salary}: {tp.salary || 0}€
                                    </p>
                                    <p className="text-sm text-white/60 font-montserrat">
                                        {copy.misc.enteredOn}{" "}
                                        {tp.join_date
                                            ? new Date(tp.join_date).toLocaleDateString("fr-FR")
                                            : "—"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removePlayerFromTeam(tp.id)}
                                    className="px-4 py-2 text-sm bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    {copy.buttons.remove}
                                </button>
                            </div>
                        </div>
                    ))}
                    {teamPlayers.length === 0 && (
                        <div className="p-6 lg:p-8 text-center">
                            <p className="text-white/70 font-montserrat text-base sm:text-lg">
                                {copy.empty}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

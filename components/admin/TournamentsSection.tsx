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
    copy: {
        headerTitle: string;
        headerSubtitle: string;
        formTitleCreate: string;
        formTitleEdit: string;
        labels: {
            name: string;
            game: string;
            prizePool: string;
            location: string;
            startDate: string;
            endDate: string;
            status: string;
        };
        placeholders: {
            name: string;
            prizePool: string;
            location: string;
            selectGame: string;
        };
        status: {
            upcoming: string;
            ongoing: string;
            finished: string;
        };
        buttons: {
            submitCreate: string;
            submitUpdate: string;
            cancel: string;
            modify: string;
            delete: string;
        };
        listTitle: string;
        empty: string;
        misc: {
            prize: string;
            dateRangeSep: string;
            dateUnknown: string;
            locationPrefix: string;
        };
    };
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
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingTournamentId ? copy.formTitleEdit : copy.formTitleCreate}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.name}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.name}
                                value={tournamentForm.name || ""}
                                onChange={(e) =>
                                    setTournamentForm({...tournamentForm, name: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.game}
                            </label>
                            <select
                                value={tournamentForm.game_id || ""}
                                onChange={(e) =>
                                    setTournamentForm({...tournamentForm, game_id: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">{copy.placeholders.selectGame}</option>
                                {games.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.prizePool}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.prizePool}
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
                                {copy.labels.location}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.location}
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
                                {copy.labels.startDate}
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
                                {copy.labels.endDate}
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
                                {copy.labels.status}
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
                                <option value="upcoming">{copy.status.upcoming}</option>
                                <option value="ongoing">{copy.status.ongoing}</option>
                                <option value="finished">{copy.status.finished}</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                        >
                            {editingTournamentId ? copy.buttons.submitUpdate : copy.buttons.submitCreate}
                        </button>
                        {editingTournamentId && (
                            <button
                                type="button"
                                onClick={cancelEditTournament}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                {copy.buttons.cancel}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tournaments List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{copy.listTitle}</h3>
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
                                            {copy.misc.prize} {t.prize_pool ? `${t.prize_pool} €` : "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            📅 {t.start_date
                                                ? new Date(t.start_date).toLocaleDateString("fr-FR")
                                                : copy.misc.dateUnknown}{" "}
                                            {copy.misc.dateRangeSep}
                                            {t.end_date
                                                ? new Date(t.end_date).toLocaleDateString("fr-FR")
                                                : copy.misc.dateUnknown}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {copy.misc.locationPrefix}{t.location || "—"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditingTournament(t)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {copy.buttons.modify}
                                    </button>
                                    <button
                                        onClick={() => deleteTournament(t.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        {copy.buttons.delete}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tournaments.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            {copy.empty}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

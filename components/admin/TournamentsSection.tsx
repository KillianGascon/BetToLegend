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
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-white mb-6">
                    {editingTournamentId ? copy.formTitleEdit : copy.formTitleCreate}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.name}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.name}
                                value={tournamentForm.name || ""}
                                onChange={(e) =>
                                    setTournamentForm({...tournamentForm, name: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.game}
                            </label>
                            <select
                                value={tournamentForm.game_id || ""}
                                onChange={(e) =>
                                    setTournamentForm({...tournamentForm, game_id: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
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
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
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
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
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
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
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
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
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
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
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
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
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
                            className="px-6 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {editingTournamentId ? copy.buttons.submitUpdate : copy.buttons.submitCreate}
                        </button>
                        {editingTournamentId && (
                            <button
                                type="button"
                                onClick={cancelEditTournament}
                                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-[12px] hover:bg-white/20 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copy.buttons.cancel}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tournaments List */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/20">
                    <h3 className="font-montserrat font-bold text-lg sm:text-xl text-white">{copy.listTitle}</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {tournaments.map((t) => (
                        <div key={t.id} className="p-6 hover:bg-legend-blue/30 transition-colors duration-200">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                                        {t.name}
                                    </h4>
                                    <p className="text-white/70 font-montserrat text-sm sm:text-base mb-2">
                                        {games.find((g) => g.id === t.game_id)?.name || "?"} • {t.status}
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-sm text-white/60 font-montserrat">
                                            {copy.misc.prize} {t.prize_pool ? `${t.prize_pool} €` : "N/A"}
                                        </p>
                                        <p className="text-sm text-white/60 font-montserrat">
                                            📅 {t.start_date
                                                ? new Date(t.start_date).toLocaleDateString("fr-FR")
                                                : copy.misc.dateUnknown}{" "}
                                            {copy.misc.dateRangeSep}
                                            {t.end_date
                                                ? new Date(t.end_date).toLocaleDateString("fr-FR")
                                                : copy.misc.dateUnknown}
                                        </p>
                                        <p className="text-sm text-white/60 font-montserrat">
                                            {copy.misc.locationPrefix}{t.location || "—"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditingTournament(t)}
                                        className="px-4 py-2 text-sm bg-legend-blue text-white rounded-[12px] hover:bg-legend-blue/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy.buttons.modify}
                                    </button>
                                    <button
                                        onClick={() => deleteTournament(t.id)}
                                        className="px-4 py-2 text-sm bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy.buttons.delete}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tournaments.length === 0 && (
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

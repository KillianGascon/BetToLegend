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
    closeMatch: (matchId: string) => void;
    copy: {
        headerTitle: string;
        headerSubtitle: string;
        formTitleCreate: string;
        formTitleEdit: string;
        labels: {
            game: string;
            format: string;
            team1: string;
            team2: string;
            date: string;
            status: string;
            score1: string;
            score2: string;
        };
        placeholders: {
            format: string;
            select: string;
            selectGame: string;
        };
        status: {
            scheduled: string;
            live: string;
            completed: string;
        };
        buttons: {
            submitCreate: string;
            submitUpdate: string;
            cancel: string;
            modify: string;
            delete: string;
            closeAndSettle: string;
        };
        listTitle: string;
        empty: string;
        tournament: {
            label: string;
            none: string;
            assignPlaceholder: string;
        };
    };
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
        closeMatch,
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
                    {editingMatchId ? copy.formTitleEdit : copy.formTitleCreate}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.game}
                            </label>
                            <select
                                value={matchForm.game_id || ""}
                                onChange={(e) => setMatchForm({...matchForm, game_id: e.target.value})}
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
                                {copy.labels.format}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.format}
                                value={matchForm.format || ""}
                                onChange={(e) => setMatchForm({...matchForm, format: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.team1}
                            </label>
                            <select
                                value={matchForm.team1_id || ""}
                                onChange={(e) => setMatchForm({...matchForm, team1_id: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            >
                                <option value="">{copy.placeholders.select}</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.team2}
                            </label>
                            <select
                                value={matchForm.team2_id || ""}
                                onChange={(e) => setMatchForm({...matchForm, team2_id: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            >
                                <option value="">{copy.placeholders.select}</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.date}
                            </label>
                            <input
                                type="datetime-local"
                                value={matchForm.match_date || ""}
                                onChange={(e) =>
                                    setMatchForm({...matchForm, match_date: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.status}
                            </label>
                            <select
                                value={matchForm.status || "scheduled"}
                                onChange={(e) => setMatchForm({...matchForm, status: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            >
                                <option value="scheduled">{copy.status.scheduled}</option>
                                <option value="live">{copy.status.live}</option>
                                <option value="completed">{copy.status.completed}</option>
                            </select>
                        </div>
                        {matchForm.status === "live" && (
                            <>
                                <div>
                                    <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                        {copy.labels.score1}
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={
                                            typeof matchForm.team1_score === "number"
                                                ? matchForm.team1_score
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setMatchForm({
                                                ...matchForm,
                                                team1_score:
                                                    e.target.value === ""
                                                        ? undefined
                                                        : Number.parseInt(e.target.value, 10),
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                        {copy.labels.score2}
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={
                                            typeof matchForm.team2_score === "number"
                                                ? matchForm.team2_score
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setMatchForm({
                                                ...matchForm,
                                                team2_score:
                                                    e.target.value === ""
                                                        ? undefined
                                                        : Number.parseInt(e.target.value, 10),
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {editingMatchId ? copy.buttons.submitUpdate : copy.buttons.submitCreate}
                        </button>
                        {editingMatchId && (
                            <button
                                type="button"
                                onClick={cancelEditMatch}
                                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-[12px] hover:bg-white/20 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copy.buttons.cancel}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Matches List */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/20">
                    <h3 className="font-montserrat font-bold text-lg sm:text-xl text-white">{copy.listTitle}</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {matches.map((m) => (
                        <div key={m.id} className="p-6 hover:bg-legend-blue/30 transition-colors duration-200">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                                        {teams.find((t) => t.id === m.team1_id)?.name || "?"} vs{" "}
                                        {teams.find((t) => t.id === m.team2_id)?.name || "?"}
                                    </h4>
                                    <p className="text-white/70 font-montserrat text-sm sm:text-base mb-1">
                                        {games.find((g) => g.id === m.game_id)?.name || "?"} • {m.status} • {m.format || "?"}
                                    </p>
                                    <p className="text-sm text-white/60 font-montserrat">
                                        {copy.tournament.label}{" "}
                                        {m.tournament_id
                                            ? tournaments.find((t) => t.id === m.tournament_id)?.name || "—"
                                            : copy.tournament.none}
                                    </p>
                                </div>
                                <div className="flex flex-col space-y-2 w-full lg:w-auto">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => startEditingMatch(m)}
                                            className="px-4 py-2 text-sm bg-legend-blue text-white rounded-[12px] hover:bg-legend-blue/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                        >
                                            {copy.buttons.modify}
                                        </button>
                                        <button
                                            onClick={() => deleteMatch(m.id)}
                                            className="px-4 py-2 text-sm bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                        >
                                            {copy.buttons.delete}
                                        </button>

                                        {m.status !== "completed" && (
                                            <button
                                                onClick={() => closeMatch(m.id)}
                                                className="px-4 py-2 text-sm bg-legend-red/80 text-white rounded-[12px] hover:bg-legend-red font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                            >
                                                {copy.buttons.closeAndSettle}
                                            </button>   
                                        )}
                                    </div>
                                    <select
                                        defaultValue=""
                                        onChange={(e) =>
                                            assignMatchToTournament(m.id, e.target.value)
                                        }
                                        className="px-4 py-2 text-sm bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                                    >
                                        <option value="">{copy.tournament.assignPlaceholder}</option>
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

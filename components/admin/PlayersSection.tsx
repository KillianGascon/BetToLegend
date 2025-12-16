import React from "react";

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

type PlayersSectionProps = {
    players: Player[];
    playerForm: Partial<Player>;
    playerFile: File | null;
    editingPlayerId: string | null;
    onSubmit: (e: React.FormEvent) => void;
    setPlayerForm: (updater: Partial<Player>) => void;
    setPlayerFile: (file: File | null) => void;
    setEditingPlayerId: (id: string | null) => void;
    startEditingPlayer: (player: Player) => void;
    deletePlayer: (id: string) => void;
    copy: {
        headerTitle: string;
        headerSubtitle: string;
        formTitleCreate: string;
        formTitleEdit: string;
        labels: {
            username: string;
            realName: string;
            country: string;
            age: string;
            role: string;
            twitch: string;
            youtube: string;
            avatar: string;
        };
        placeholders: {
            username: string;
            realName: string;
            country: string;
            age: string;
            role: string;
            twitch: string;
            youtube: string;
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
            noRole: string;
            yearsOld: string;
        };
    };
};

export default function PlayersSection(props: PlayersSectionProps) {
    const {
        players,
        playerForm,
        playerFile,
        editingPlayerId,
        onSubmit,
        setPlayerForm,
        setPlayerFile,
        setEditingPlayerId,
        startEditingPlayer,
        deletePlayer,
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
                    {editingPlayerId ? copy.formTitleEdit : copy.formTitleCreate}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.username}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.username}
                                value={playerForm.username || ""}
                                onChange={(e) => setPlayerForm({...playerForm, username: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.realName}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.realName}
                                value={playerForm.real_name || ""}
                                onChange={(e) => setPlayerForm({...playerForm, real_name: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.country}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.country}
                                value={playerForm.country || ""}
                                onChange={(e) => setPlayerForm({...playerForm, country: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.age}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.age}
                                value={playerForm.age || ""}
                                onChange={(e) => setPlayerForm({...playerForm, age: Number(e.target.value)})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.role}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.role}
                                value={playerForm.role || ""}
                                onChange={(e) => setPlayerForm({...playerForm, role: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.twitch}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.twitch}
                                value={playerForm.twitch_followers || ""}
                                onChange={(e) =>
                                    setPlayerForm({...playerForm, twitch_followers: Number(e.target.value)})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.youtube}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.youtube}
                                value={playerForm.youtube_subscribers || ""}
                                onChange={(e) =>
                                    setPlayerForm({
                                        ...playerForm,
                                        youtube_subscribers: Number(e.target.value),
                                    })
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy.labels.avatar}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPlayerFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-montserrat file:font-medium file:bg-legend-blue file:text-white hover:file:bg-legend-blue/80"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {editingPlayerId ? copy.buttons.submitUpdate : copy.buttons.submitCreate}
                        </button>
                        {editingPlayerId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPlayerForm({});
                                    setPlayerFile(null);
                                    setEditingPlayerId(null);
                                }}
                                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-[12px] hover:bg-white/20 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copy.buttons.cancel}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Players List */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/20">
                    <h3 className="font-montserrat font-bold text-lg sm:text-xl text-white">{copy.listTitle}</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {players.map((p) => (
                        <div key={p.id} className="p-6 hover:bg-legend-blue/30 transition-colors duration-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    {p.avatar_url && (
                                        <img
                                            src={p.avatar_url}
                                            alt="avatar"
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-montserrat font-bold text-base sm:text-lg text-white mb-1">
                                            {p.username}
                                        </h4>
                                        <p className="text-white/70 font-montserrat text-sm sm:text-base mb-1">
                                            {p.role || copy.misc.noRole} • {p.country}
                                            {p.age && ` • ${p.age} ${copy.misc.yearsOld}`}
                                        </p>
                                        {(p.twitch_followers || p.youtube_subscribers) && (
                                            <p className="text-sm text-white/60 font-montserrat">
                                                {p.twitch_followers && `Twitch: ${p.twitch_followers} followers`}
                                                {p.twitch_followers && p.youtube_subscribers && " • "}
                                                {p.youtube_subscribers && `YouTube: ${p.youtube_subscribers}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            const {avatar_url, ...rest} = p;
                                            setPlayerForm(rest);
                                            setEditingPlayerId(p.id);
                                        }}
                                        className="px-4 py-2 text-sm bg-legend-blue text-white rounded-[12px] hover:bg-legend-blue/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy.buttons.modify}
                                    </button>
                                    <button
                                        onClick={() => deletePlayer(p.id)}
                                        className="px-4 py-2 text-sm bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy.buttons.delete}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {players.length === 0 && (
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

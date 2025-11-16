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
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{copy.headerTitle}</h2>
                <p className="text-gray-300">{copy.headerSubtitle}</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingPlayerId ? copy.formTitleEdit : copy.formTitleCreate}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.username}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.username}
                                value={playerForm.username || ""}
                                onChange={(e) => setPlayerForm({...playerForm, username: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.realName}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.realName}
                                value={playerForm.real_name || ""}
                                onChange={(e) => setPlayerForm({...playerForm, real_name: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.country}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.country}
                                value={playerForm.country || ""}
                                onChange={(e) => setPlayerForm({...playerForm, country: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.age}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.age}
                                value={playerForm.age || ""}
                                onChange={(e) => setPlayerForm({...playerForm, age: Number(e.target.value)})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.role}
                            </label>
                            <input
                                type="text"
                                placeholder={copy.placeholders.role}
                                value={playerForm.role || ""}
                                onChange={(e) => setPlayerForm({...playerForm, role: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.twitch}
                            </label>
                            <input
                                type="number"
                                placeholder={copy.placeholders.twitch}
                                value={playerForm.twitch_followers || ""}
                                onChange={(e) =>
                                    setPlayerForm({...playerForm, twitch_followers: Number(e.target.value)})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
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
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {copy.labels.avatar}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPlayerFile(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
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
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                {copy.buttons.cancel}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Players List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{copy.listTitle}</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {players.map((p) => (
                        <div key={p.id} className="p-6 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {p.avatar_url && (
                                        <img
                                            src={p.avatar_url}
                                            alt="avatar"
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{p.username}</h4>
                                        <p className="text-gray-300">
                                            {p.role || copy.misc.noRole} • {p.country}
                                            {p.age && ` • ${p.age} ${copy.misc.yearsOld}`}
                                        </p>
                                        {(p.twitch_followers || p.youtube_subscribers) && (
                                            <p className="text-sm text-gray-400">
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
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {copy.buttons.modify}
                                    </button>
                                    <button
                                        onClick={() => deletePlayer(p.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        {copy.buttons.delete}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {players.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            {copy.empty}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

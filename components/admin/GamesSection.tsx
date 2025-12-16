import React from "react";

type Game = {
    id: string;
    name: string;
    category: string;
};

type GamesSectionProps = {
    games: Game[];
    gameForm: Partial<Game>;
    editingGameId: string | null;
    onSubmit: (e: React.FormEvent) => void;
    cancelEditGame: () => void;
    startEditingGame: (game: Game) => void;
    deleteGame: (id: string) => void;
    setGameForm: (updater: Partial<Game>) => void;
    copy?: {
        headerTitle: string;
        headerSubtitle: string;
        formTitleCreate: string;
        formTitleEdit: string;
        labels: { name: string; category: string };
        placeholders: { name: string; category: string };
        buttons: { submitCreate: string; submitUpdate: string; cancel: string; modify: string; delete: string };
        listTitle: string;
        empty: string;
    };
};

export default function GamesSection(props: GamesSectionProps) {
    const {
        games,
        gameForm,
        editingGameId,
        onSubmit,
        cancelEditGame,
        startEditingGame,
        deleteGame,
        setGameForm,
        copy,
    } = props;

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3">
                    {copy?.headerTitle ?? "🎯 Gestion des jeux"}
                </h2>
                <p className="text-white/80 font-montserrat text-base sm:text-lg lg:text-xl">
                    {copy?.headerSubtitle ?? "Ajoutez et gérez les jeux disponibles sur votre plateforme"}
                </p>
            </div>

            {/* Form */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-white mb-6">
                    {editingGameId ? (copy?.formTitleEdit ?? "Modifier le jeu") : (copy?.formTitleCreate ?? "Ajouter un nouveau jeu")}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy?.labels?.name ?? "Nom du jeu"}
                            </label>
                            <input
                                type="text"
                                placeholder={copy?.placeholders?.name ?? "Nom du jeu"}
                                value={gameForm.name || ""}
                                onChange={(e) =>
                                    setGameForm({...gameForm, name: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy?.labels?.category ?? "Catégorie"}
                            </label>
                            <input
                                type="text"
                                placeholder={copy?.placeholders?.category ?? "Catégorie (ex: FPS, MOBA...)"}
                                value={gameForm.category || ""}
                                onChange={(e) =>
                                    setGameForm({...gameForm, category: e.target.value})
                                }
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {editingGameId ? (copy?.buttons?.submitUpdate ?? "Modifier le jeu") : (copy?.buttons?.submitCreate ?? "Créer un jeu")}
                        </button>
                        {editingGameId && (
                            <button
                                type="button"
                                onClick={cancelEditGame}
                                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-[12px] hover:bg-white/20 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copy?.buttons?.cancel ?? "Annuler"}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Games List */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/20">
                    <h3 className="font-montserrat font-bold text-lg sm:text-xl text-white">{copy?.listTitle ?? "Jeux existants"}</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {games.map((g) => (
                        <div key={g.id} className="p-6 hover:bg-legend-blue/30 transition-colors duration-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-montserrat font-bold text-base sm:text-lg text-white">{g.name}</h4>
                                    <p className="text-white/70 font-montserrat text-sm sm:text-base">
                                        {(copy ? (copy.labels?.category ?? "Catégorie") : "Catégorie")}: {g.category}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditingGame(g)}
                                        className="px-4 py-2 text-sm bg-legend-blue text-white rounded-[12px] hover:bg-legend-blue/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy?.buttons?.modify ?? "Modifier"}
                                    </button>
                                    <button
                                        onClick={() => deleteGame(g.id)}
                                        className="px-4 py-2 text-sm bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy?.buttons?.delete ?? "Supprimer"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {games.length === 0 && (
                        <div className="p-6 lg:p-8 text-center">
                            <p className="text-white/70 font-montserrat text-base sm:text-lg">
                                {copy?.empty ?? "Aucun jeu créé pour le moment."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

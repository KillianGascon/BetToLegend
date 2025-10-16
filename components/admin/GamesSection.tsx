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
    } = props;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">🎯 Gestion des jeux</h2>
                <p className="text-gray-300">Ajoutez et gérez les jeux disponibles sur votre plateforme</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingGameId ? "Modifier le jeu" : "Ajouter un nouveau jeu"}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Nom du jeu
                            </label>
                            <input
                                type="text"
                                placeholder="Nom du jeu"
                                value={gameForm.name || ""}
                                onChange={(e) =>
                                    setGameForm({...gameForm, name: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Catégorie
                            </label>
                            <input
                                type="text"
                                placeholder="Catégorie (ex: FPS, MOBA...)"
                                value={gameForm.category || ""}
                                onChange={(e) =>
                                    setGameForm({...gameForm, category: e.target.value})
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                        >
                            {editingGameId ? "Modifier le jeu" : "Créer un jeu"}
                        </button>
                        {editingGameId && (
                            <button
                                type="button"
                                onClick={cancelEditGame}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Games List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Jeux existants</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {games.map((g) => (
                        <div key={g.id} className="p-6 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-white">{g.name}</h4>
                                    <p className="text-gray-300">Catégorie: {g.category}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditingGame(g)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => deleteGame(g.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {games.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            Aucun jeu créé pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import React from "react";

type Team = {
	id: string;
	name: string;
	tag: string;
	country?: string;
	logo_url?: string;
	founded_year?: number;
};

type TeamsSectionProps = {
	teams: Team[];
	form: Partial<Team>;
	file: File | null;
	editingId: string | null;
	onSubmit: (e: React.FormEvent) => void;
	cancelEdit: () => void;
	startEditing: (team: Team) => void;
	deleteTeam: (id: string) => void;
	setForm: (updater: Partial<Team>) => void;
	setFile: (file: File | null) => void;
};

export default function TeamsSection(props: TeamsSectionProps) {
	const {
		teams,
		form,
		file,
		editingId,
		onSubmit,
		cancelEdit,
		startEditing,
		deleteTeam,
		setForm,
		setFile,
	} = props;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">⚙️ Gestion des équipes</h2>
                <p className="text-gray-300">Créez et gérez les équipes de votre plateforme</p>
            </div>

            {/* Form */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingId ? "Modifier l'équipe" : "Ajouter une nouvelle équipe"}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Nom de l'équipe
                            </label>
                            <input
                                type="text"
                                placeholder="Nom"
                                value={form.name || ""}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Tag
                            </label>
                            <input
                                type="text"
                                placeholder="Tag"
                                value={form.tag || ""}
                                onChange={(e) => setForm({...form, tag: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Pays
                            </label>
                            <input
                                type="text"
                                placeholder="Pays"
                                value={form.country || ""}
                                onChange={(e) => setForm({...form, country: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Année de fondation
                            </label>
                            <input
                                type="number"
                                placeholder="Année fondation"
                                value={form.founded_year || ""}
                                onChange={(e) => setForm({...form, founded_year: Number(e.target.value)})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Logo de l'équipe
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                        >
                            {editingId ? "Enregistrer les modifications" : "Créer équipe"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Teams List */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Équipes existantes</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {teams.map((team) => (
                        <div key={team.id} className="p-6 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {team.logo_url && (
                                        <img
                                            src={team.logo_url}
                                            alt="logo"
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">
                                            {team.name} ({team.tag})
                                        </h4>
                                        <p className="text-gray-300">
                                            {team.country} {team.founded_year && `• Fondée en ${team.founded_year}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditing(team)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => deleteTeam(team.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {teams.length === 0 && (
                        <div className="p-6 text-center text-gray-400">
                            Aucune équipe créée pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



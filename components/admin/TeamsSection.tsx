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
	copy?: {
		headerTitle: string;
		headerSubtitle: string;
		formTitleCreate: string;
		formTitleEdit: string;
		labels: { name: string; tag: string; country: string; founded: string; logo: string };
		placeholders: { name: string; tag: string; country: string; founded: string };
		buttons: { submitCreate: string; submitUpdate: string; cancel: string; modify: string; delete: string };
		listTitle: string;
		empty: string;
	};
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
		copy,
	} = props;

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3">
                    {copy?.headerTitle ?? "⚙️ Gestion des équipes"}
                </h2>
                <p className="text-white/80 font-montserrat text-base sm:text-lg lg:text-xl">
                    {copy?.headerSubtitle ?? "Créez et gérez les équipes de votre plateforme"}
                </p>
            </div>

            {/* Form */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6 lg:p-8">
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-white mb-6">
                    {editingId ? (copy?.formTitleEdit ?? "Modifier l'équipe") : (copy?.formTitleCreate ?? "Ajouter une nouvelle équipe")}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy?.labels?.name ?? "Nom de l'équipe"}
                            </label>
                            <input
                                type="text"
                                placeholder={copy?.placeholders?.name ?? "Nom"}
                                value={form.name || ""}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy?.labels?.tag ?? "Tag"}
                            </label>
                            <input
                                type="text"
                                placeholder={copy?.placeholders?.tag ?? "Tag"}
                                value={form.tag || ""}
                                onChange={(e) => setForm({...form, tag: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy?.labels?.country ?? "Pays"}
                            </label>
                            <input
                                type="text"
                                placeholder={copy?.placeholders?.country ?? "Pays"}
                                value={form.country || ""}
                                onChange={(e) => setForm({...form, country: e.target.value})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                                {copy?.labels?.founded ?? "Année de fondation"}
                            </label>
                            <input
                                type="number"
                                placeholder={copy?.placeholders?.founded ?? "Année fondation"}
                                value={form.founded_year || ""}
                                onChange={(e) => setForm({...form, founded_year: Number(e.target.value)})}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-montserrat font-medium text-white/70 mb-2">
                            {copy?.labels?.logo ?? "Logo de l'équipe"}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-montserrat file:font-medium file:bg-legend-blue file:text-white hover:file:bg-legend-blue/80"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {editingId ? (copy?.buttons?.submitUpdate ?? "Enregistrer les modifications") : (copy?.buttons?.submitCreate ?? "Créer équipe")}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white rounded-[12px] hover:bg-white/20 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                {copy?.buttons?.cancel ?? "Annuler"}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Teams List */}
            <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/20">
                    <h3 className="font-montserrat font-bold text-lg sm:text-xl text-white">{copy?.listTitle ?? "Équipes existantes"}</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {teams.map((team) => (
                        <div key={team.id} className="p-6 hover:bg-legend-blue/30 transition-colors duration-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    {team.logo_url && (
                                        <img
                                            src={team.logo_url}
                                            alt="logo"
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-montserrat font-bold text-base sm:text-lg text-white truncate">
                                            {team.name} ({team.tag})
                                        </h4>
                                        <p className="text-white/70 font-montserrat text-sm sm:text-base">
                                            {team.country} {team.founded_year && `• Fondée en ${team.founded_year}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditing(team)}
                                        className="px-4 py-2 text-sm bg-legend-blue text-white rounded-[12px] hover:bg-legend-blue/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy?.buttons?.modify ?? "Modifier"}
                                    </button>
                                    <button
                                        onClick={() => deleteTeam(team.id)}
                                        className="px-4 py-2 text-sm bg-legend-red text-white rounded-[12px] hover:bg-legend-red/80 font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        {copy?.buttons?.delete ?? "Supprimer"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {teams.length === 0 && (
                        <div className="p-6 lg:p-8 text-center">
                            <p className="text-white/70 font-montserrat text-base sm:text-lg">
                                {copy?.empty ?? "Aucune équipe créée pour le moment."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



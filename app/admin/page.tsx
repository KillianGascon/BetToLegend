"use client";

import { useEffect, useState } from "react";

type Team = {
    id: string;
    name: string;
    tag: string;
    country?: string;
    logo_url?: string;
    founded_year?: number;
};

export default function AdminPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [form, setForm] = useState<Partial<Team>>({});
    const [file, setFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Charger toutes les équipes
    async function fetchTeams() {
        const res = await fetch("/api/teams");
        const data = await res.json();
        setTeams(data);
    }

    useEffect(() => {
        fetchTeams();
    }, []);

    // Créer une équipe
    async function createTeam(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        if (form.name) formData.append("name", form.name);
        if (form.tag) formData.append("tag", form.tag);
        if (form.country) formData.append("country", form.country);
        if (form.founded_year)
            formData.append("founded_year", String(form.founded_year));
        if (file) formData.append("file", file);

        await fetch("/api/teams", {
            method: "POST",
            body: formData,
        });

        setForm({});
        setFile(null);
        fetchTeams();
    }

    // Mettre à jour une équipe (FormData)
    async function updateTeam(e: React.FormEvent) {
        e.preventDefault();
        if (!editingId) return;

        const formData = new FormData();
        if (form.name) formData.append("name", form.name);
        if (form.tag) formData.append("tag", form.tag);
        if (form.country) formData.append("country", form.country);
        if (form.founded_year)
            formData.append("founded_year", String(form.founded_year));
        if (file) formData.append("file", file);

        await fetch(`/api/teams/${editingId}`, {
            method: "PUT",
            body: formData,
        });

        setForm({});
        setFile(null);
        setEditingId(null);
        fetchTeams();
    }

    // Supprimer une équipe
    async function deleteTeam(id: string) {
        await fetch(`/api/teams/${id}`, { method: "DELETE" });
        fetchTeams();
    }

    // Remplir le formulaire avec les infos d'une équipe à modifier
    function startEditing(team: Team) {
        setForm(team);
        setEditingId(team.id);
        setFile(null);
    }

    // Réinitialiser le formulaire
    function cancelEdit() {
        setForm({});
        setFile(null);
        setEditingId(null);
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin – Gestion des équipes</h1>

            {/* Formulaire de création / édition */}
            <form
                onSubmit={editingId ? updateTeam : createTeam}
                style={{
                    marginBottom: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    maxWidth: "400px",
                }}
            >
                <input
                    placeholder="Nom"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="Tag"
                    value={form.tag || ""}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                />
                <input
                    placeholder="Pays"
                    value={form.country || ""}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Année fondation"
                    value={form.founded_year || ""}
                    onChange={(e) =>
                        setForm({ ...form, founded_year: Number(e.target.value) })
                    }
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                    <button type="submit">
                        {editingId ? "Enregistrer les modifications" : "Créer équipe"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit}>
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            {/* Liste des équipes */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {teams.map((team) => (
                    <li
                        key={team.id}
                        style={{
                            marginBottom: "1.5rem",
                            padding: "1rem",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            maxWidth: "500px",
                        }}
                    >
                        <strong>
                            {team.name} ({team.tag})
                        </strong>{" "}
                        – {team.country}{" "}
                        {team.logo_url && (
                            <img
                                src={team.logo_url}
                                alt="logo"
                                width={40}
                                height={40}
                                style={{
                                    display: "inline",
                                    marginLeft: "10px",
                                    borderRadius: "6px",
                                    verticalAlign: "middle",
                                }}
                            />
                        )}
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "10px" }}>
                            <button onClick={() => startEditing(team)}>Modifier</button>
                            <button onClick={() => deleteTeam(team.id)}>Supprimer</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

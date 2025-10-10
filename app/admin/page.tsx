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

    // Charger toutes les équipes
    async function fetchTeams() {
        const res = await fetch("/api/teams");
        const data = await res.json();
        setTeams(data);
    }

    useEffect(() => {
        fetchTeams();
    }, []);

    // Créer une équipe (multipart/form-data avec image)
    async function createTeam(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        if (form.name) formData.append("name", form.name);
        if (form.tag) formData.append("tag", form.tag);
        if (form.country) formData.append("country", form.country);
        if (form.founded_year) formData.append("founded_year", String(form.founded_year));
        if (file) formData.append("file", file);

        await fetch("/api/teams", {
            method: "POST",
            body: formData,
        });

        setForm({});
        setFile(null);
        fetchTeams();
    }

    // Mettre à jour une équipe (ici tu pourrais faire pareil avec formData si tu veux changer le logo)
    async function updateTeam(id: string) {
        await fetch(`/api/teams/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setForm({});
        fetchTeams();
    }

    // Supprimer une équipe
    async function deleteTeam(id: string) {
        await fetch(`/api/teams/${id}`, { method: "DELETE" });
        fetchTeams();
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin – Gestion des équipes</h1>

            {/* Formulaire création/modif */}
            <form onSubmit={createTeam} style={{ marginBottom: "2rem" }}>
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
                <button type="submit" style={{ marginLeft: "10px" }}>
                    Créer équipe
                </button>
            </form>

            {/* Liste des équipes */}
            <ul>
                {teams.map((team) => (
                    <li key={team.id} style={{ marginBottom: "1rem" }}>
                        <strong>
                            {team.name} ({team.tag})
                        </strong>{" "}
                        - {team.country}{" "}
                        {team.logo_url && (
                            <img
                                src={team.logo_url}
                                alt="logo"
                                width={30}
                                height={30}
                                style={{ display: "inline", marginLeft: "10px" }}
                            />
                        )}
                        <div style={{ marginTop: "0.5rem" }}>
                            <button
                                onClick={() => setForm(team)}
                                style={{ marginRight: "10px" }}
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => updateTeam(team.id)}
                                style={{ marginRight: "10px" }}
                            >
                                Enregistrer modif
                            </button>
                            <button
                                onClick={() => deleteTeam(team.id)}
                                style={{ marginRight: "10px" }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

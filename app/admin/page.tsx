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

export default function AdminPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);

    const [form, setForm] = useState<Partial<Team>>({});
    const [file, setFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [matchForm, setMatchForm] = useState<Partial<Match>>({});
    const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

    const [gameForm, setGameForm] = useState<Partial<Game>>({});
    const [editingGameId, setEditingGameId] = useState<string | null>(null);

    const [players, setPlayers] = useState<Player[]>([]);
    const [playerForm, setPlayerForm] = useState<Partial<Player>>({});
    const [playerFile, setPlayerFile] = useState<File | null>(null);
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

    const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
    const [teamPlayerForm, setTeamPlayerForm] = useState({
        team_id: "",
        player_id: "",
        position: "",
        salary: 0,
        join_date: "",
    });

    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [tournamentForm, setTournamentForm] = useState<Partial<Tournament>>({});
    const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);

    // --------- FETCH DATA ---------
    async function fetchTeams() {
        const res = await fetch("/api/teams");
        setTeams(await res.json());
    }

    async function fetchMatches() {
        const res = await fetch("/api/matches");
        setMatches(await res.json());
    }

    async function fetchGames() {
        const res = await fetch("/api/games");
        setGames(await res.json());
    }

    async function fetchPlayers() {
        const res = await fetch("/api/players");
        setPlayers(await res.json());
    }

    async function fetchTeamPlayers() {
        const res = await fetch("/api/team-players");
        setTeamPlayers(await res.json());
    }

    async function fetchTournaments() {
        const res = await fetch("/api/tournaments");
        setTournaments(await res.json());
    }

    useEffect(() => {
        fetchTeams();
        fetchGames();
        fetchMatches();
        fetchPlayers();
        fetchTeamPlayers();
        fetchTournaments();
    }, []);


    // --------- CRUD EQUIPES ---------
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

    async function deleteTeam(id: string) {
        await fetch(`/api/teams/${id}`, { method: "DELETE" });
        fetchTeams();
    }

    function startEditing(team: Team) {
        setForm(team);
        setEditingId(team.id);
        setFile(null);
    }

    function cancelEdit() {
        setForm({});
        setFile(null);
        setEditingId(null);
    }

    // --------- CRUD MATCHES ---------
    async function createMatch(e: React.FormEvent) {
        e.preventDefault();

        await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matchForm),
        });

        setMatchForm({});
        fetchMatches();
    }

    async function updateMatch(e: React.FormEvent) {
        e.preventDefault();
        if (!editingMatchId) return;

        await fetch(`/api/matches/${editingMatchId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matchForm),
        });

        setEditingMatchId(null);
        setMatchForm({});
        fetchMatches();
    }

    async function deleteMatch(id: string) {
        await fetch(`/api/matches/${id}`, { method: "DELETE" });
        fetchMatches();
    }

    function startEditingMatch(match: Match) {
        setMatchForm(match);
        setEditingMatchId(match.id);
    }

    function cancelEditMatch() {
        setMatchForm({});
        setEditingMatchId(null);
    }

    // --------- CRUD GAMES ---------
    async function createGame(e: React.FormEvent) {
        e.preventDefault();
        await fetch("/api/games", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameForm),
        });
        setGameForm({});
        fetchGames();
    }

    async function updateGame(e: React.FormEvent) {
        e.preventDefault();
        if (!editingGameId) return;
        await fetch(`/api/games/${editingGameId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameForm),
        });
        setEditingGameId(null);
        setGameForm({});
        fetchGames();
    }

    async function deleteGame(id: string) {
        await fetch(`/api/games/${id}`, { method: "DELETE" });
        fetchGames();
    }

    function startEditingGame(game: Game) {
        setGameForm(game);
        setEditingGameId(game.id);
    }

    function cancelEditGame() {
        setGameForm({});
        setEditingGameId(null);
    }

    // --------- CRUD JOUEURS/EQUIPE ---------
    async function addPlayerToTeam(e: React.FormEvent) {
        e.preventDefault();

        await fetch("/api/team-players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...teamPlayerForm,
                salary: parseFloat(String(teamPlayerForm.salary)) || 0,
            }),
        });

        setTeamPlayerForm({
            team_id: "",
            player_id: "",
            position: "",
            salary: 0,
            join_date: "",
        });

        fetchTeamPlayers();
    }

    async function removePlayerFromTeam(id: string) {
        await fetch(`/api/team-players/${id}`, { method: "DELETE" });
        fetchTeamPlayers();
    }

    // --------- CREATE / UPDATE / DELETE TOURNOIS ---------
    async function createTournament(e: React.FormEvent) {
        e.preventDefault();
        await fetch("/api/tournaments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tournamentForm),
        });
        setTournamentForm({});
        fetchTournaments();
    }

    async function updateTournament(e: React.FormEvent) {
        e.preventDefault();
        if (!editingTournamentId) return;
        await fetch(`/api/tournaments/${editingTournamentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tournamentForm),
        });
        setEditingTournamentId(null);
        setTournamentForm({});
        fetchTournaments();
    }

    async function deleteTournament(id: string) {
        await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
        fetchTournaments();
    }

    function startEditingTournament(t: Tournament) {
        setTournamentForm(t);
        setEditingTournamentId(t.id);
    }

    function cancelEditTournament() {
        setTournamentForm({});
        setEditingTournamentId(null);
    }

    // --------- ASSIGN MATCH TO TOURNAMENT ---------
    async function assignMatchToTournament(matchId: string, tournamentId: string) {
        if (!tournamentId) return alert("Sélectionnez un tournoi.");
        await fetch(`/api/matches/${matchId}/assign-tournament`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tournament_id: tournamentId }),
        });
        fetchMatches();
    }

    // --------- UI ---------
    return (
        <div style={{padding: "2rem"}}>
            <h1>Admin – Gestion</h1>

            {/* --------- EQUIPES --------- */}
            <section style={{marginBottom: "4rem"}}>
                <h2>⚙️ Gestion des équipes</h2>

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
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                    <input
                        placeholder="Tag"
                        value={form.tag || ""}
                        onChange={(e) => setForm({...form, tag: e.target.value})}
                    />
                    <input
                        placeholder="Pays"
                        value={form.country || ""}
                        onChange={(e) => setForm({...form, country: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Année fondation"
                        value={form.founded_year || ""}
                        onChange={(e) =>
                            setForm({...form, founded_year: Number(e.target.value)})
                        }
                    />
                    <input
                        type="file"
                        onChange={(e) =>
                            setFile(e.target.files ? e.target.files[0] : null)
                        }
                    />

                    <div style={{display: "flex", gap: "10px", marginTop: "0.5rem"}}>
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

                <ul style={{listStyle: "none", padding: 0}}>
                    {teams.map((team) => (
                        <li
                            key={team.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                maxWidth: "500px",
                            }}
                        >
                            <strong>
                                {team.name} ({team.tag})
                            </strong>{" "}
                            – {team.country}
                            {team.logo_url && (
                                <img
                                    src={team.logo_url}
                                    alt="logo"
                                    width={40}
                                    height={40}
                                    style={{
                                        marginLeft: "10px",
                                        borderRadius: "6px",
                                        verticalAlign: "middle",
                                    }}
                                />
                            )}
                            <div style={{marginTop: "0.5rem", display: "flex", gap: "10px"}}>
                                <button onClick={() => startEditing(team)}>Modifier</button>
                                <button onClick={() => deleteTeam(team.id)}>Supprimer</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* --------- JEUX --------- */}
            <section style={{marginBottom: "4rem"}}>
                <h2>🎯 Gestion des jeux</h2>

                <form
                    onSubmit={editingGameId ? updateGame : createGame}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        maxWidth: "400px",
                        marginBottom: "2rem",
                    }}
                >
                    <input
                        placeholder="Nom du jeu"
                        value={gameForm.name || ""}
                        onChange={(e) =>
                            setGameForm({...gameForm, name: e.target.value})
                        }
                    />
                    <input
                        placeholder="Catégorie (ex: FPS, MOBA...)"
                        value={gameForm.category || ""}
                        onChange={(e) =>
                            setGameForm({...gameForm, category: e.target.value})
                        }
                    />
                    <div style={{display: "flex", gap: "10px"}}>
                        <button type="submit">
                            {editingGameId ? "Modifier le jeu" : "Créer un jeu"}
                        </button>
                        {editingGameId && (
                            <button type="button" onClick={cancelEditGame}>
                                Annuler
                            </button>
                        )}
                    </div>
                </form>

                <ul style={{listStyle: "none", padding: 0}}>
                    {games.map((g) => (
                        <li
                            key={g.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                maxWidth: "500px",
                            }}
                        >
                            <strong>{g.name}</strong> – {g.category}
                            <div style={{marginTop: "0.5rem", display: "flex", gap: "10px"}}>
                                <button onClick={() => startEditingGame(g)}>Modifier</button>
                                <button onClick={() => deleteGame(g.id)}>Supprimer</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* --------- JOUEURS --------- */}
            <section style={{marginTop: "4rem"}}>
                <h2>👤 Gestion des joueurs</h2>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData();
                        if (playerForm.username) formData.append("username", playerForm.username);
                        if (playerForm.real_name) formData.append("real_name", playerForm.real_name);
                        if (playerForm.country) formData.append("country", playerForm.country);
                        if (playerForm.age) formData.append("age", String(playerForm.age));
                        if (playerForm.role) formData.append("role", playerForm.role);
                        if (playerForm.twitch_followers)
                            formData.append("twitch_followers", String(playerForm.twitch_followers));
                        if (playerForm.youtube_subscribers)
                            formData.append("youtube_subscribers", String(playerForm.youtube_subscribers));
                        if (playerFile) formData.append("file", playerFile);

                        if (editingPlayerId) {
                            await fetch(`/api/players/${editingPlayerId}`, {
                                method: "PUT",
                                body: formData,
                            });
                        } else {
                            await fetch("/api/players", {
                                method: "POST",
                                body: formData,
                            });
                        }

                        setPlayerForm({});
                        setPlayerFile(null);
                        setEditingPlayerId(null);
                        fetchPlayers();
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        maxWidth: "400px",
                        marginBottom: "2rem",
                    }}
                >
                    <input
                        placeholder="Username"
                        value={playerForm.username || ""}
                        onChange={(e) => setPlayerForm({...playerForm, username: e.target.value})}
                    />
                    <input
                        placeholder="Nom réel"
                        value={playerForm.real_name || ""}
                        onChange={(e) => setPlayerForm({...playerForm, real_name: e.target.value})}
                    />
                    <input
                        placeholder="Pays (FR, US...)"
                        value={playerForm.country || ""}
                        onChange={(e) => setPlayerForm({...playerForm, country: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Âge"
                        value={playerForm.age || ""}
                        onChange={(e) => setPlayerForm({...playerForm, age: Number(e.target.value)})}
                    />
                    <input
                        placeholder="Rôle (ex: Top, Jungler)"
                        value={playerForm.role || ""}
                        onChange={(e) => setPlayerForm({...playerForm, role: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Followers Twitch"
                        value={playerForm.twitch_followers || ""}
                        onChange={(e) =>
                            setPlayerForm({...playerForm, twitch_followers: Number(e.target.value)})
                        }
                    />
                    <input
                        type="number"
                        placeholder="Abonnés YouTube"
                        value={playerForm.youtube_subscribers || ""}
                        onChange={(e) =>
                            setPlayerForm({
                                ...playerForm,
                                youtube_subscribers: Number(e.target.value),
                            })
                        }
                    />
                    <input type="file" onChange={(e) => setPlayerFile(e.target.files?.[0] || null)}/>

                    <button type="submit">
                        {editingPlayerId ? "Mettre à jour le joueur" : "Créer joueur"}
                    </button>
                    {editingPlayerId && (
                        <button
                            type="button"
                            onClick={() => {
                                setPlayerForm({});
                                setPlayerFile(null);
                                setEditingPlayerId(null);
                            }}
                        >
                            Annuler
                        </button>
                    )}
                </form>

                <ul style={{listStyle: "none", padding: 0}}>
                    {players.map((p) => (
                        <li
                            key={p.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                maxWidth: "500px",
                            }}
                        >
                            <strong>{p.username}</strong> – {p.role || "Aucun rôle"} ({p.country})
                            {p.avatar_url && (
                                <img
                                    src={p.avatar_url}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    style={{
                                        marginLeft: "10px",
                                        borderRadius: "6px",
                                        verticalAlign: "middle",
                                    }}
                                />
                            )}
                            <div style={{marginTop: "0.5rem", display: "flex", gap: "10px"}}>
                                <button
                                    onClick={() => {
                                        const {avatar_url, ...rest} = p;
                                        setPlayerForm(rest);
                                        setEditingPlayerId(p.id);
                                    }}
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={async () => {
                                        await fetch(`/api/players/${p.id}`, {method: "DELETE"});
                                        fetchPlayers();
                                    }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/*---------JOEURS/EQUIPE----------*/}
            <section style={{marginTop: "4rem"}}>
                <h2>👥 Gestion des joueurs dans les équipes</h2>

                <form
                    onSubmit={addPlayerToTeam}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        maxWidth: "400px",
                        marginBottom: "2rem",
                    }}
                >
                    <label>Équipe</label>
                    <select
                        value={teamPlayerForm.team_id}
                        onChange={(e) =>
                            setTeamPlayerForm({...teamPlayerForm, team_id: e.target.value})
                        }
                    >
                        <option value="">-- Sélectionner --</option>
                        {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <label>Joueur</label>
                    <select
                        value={teamPlayerForm.player_id}
                        onChange={(e) =>
                            setTeamPlayerForm({...teamPlayerForm, player_id: e.target.value})
                        }
                    >
                        <option value="">-- Sélectionner --</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.username}
                            </option>
                        ))}
                    </select>

                    <label>Poste</label>
                    <input
                        placeholder="Poste (ex: ADC)"
                        value={teamPlayerForm.position}
                        onChange={(e) =>
                            setTeamPlayerForm({...teamPlayerForm, position: e.target.value})
                        }
                    />

                    <label>Salaire</label>
                    <input
                        type="number"
                        placeholder="Salaire (€)"
                        value={teamPlayerForm.salary}
                        onChange={(e) =>
                            setTeamPlayerForm({
                                ...teamPlayerForm,
                                salary: parseFloat(e.target.value),
                            })
                        }
                    />

                    <label>Date d'entrée</label>
                    <input
                        type="date"
                        value={teamPlayerForm.join_date}
                        onChange={(e) =>
                            setTeamPlayerForm({...teamPlayerForm, join_date: e.target.value})
                        }
                    />


                    <button type="submit">Ajouter joueur à l’équipe</button>
                </form>

                <ul style={{listStyle: "none", padding: 0}}>
                    {teamPlayers.map((tp) => (
                        <li
                            key={tp.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                maxWidth: "500px",
                            }}
                        >
                            <strong>
                                {tp.players?.username} → {tp.teams?.name}
                            </strong>{" "}
                            ({tp.position || "?"}, {tp.salary || 0}€)
                            <br/>
                            <small>
                                📅 Entré le{" "}
                                {tp.join_date
                                    ? new Date(tp.join_date).toLocaleDateString("fr-FR")
                                    : "—"}
                            </small>
                            <button
                                style={{marginLeft: "10px"}}
                                onClick={() => removePlayerFromTeam(tp.id)}
                            >
                                Retirer
                            </button>
                        </li>
                    ))}
                </ul>
            </section>


            {/* --------- MATCHES --------- */}
            <section>
                <h2>🎮 Gestion des matchs</h2>

                <form
                    onSubmit={editingMatchId ? updateMatch : createMatch}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        maxWidth: "400px",
                        marginBottom: "2rem",
                    }}
                >
                    <label>Jeu</label>
                    <select
                        value={matchForm.game_id || ""}
                        onChange={(e) => setMatchForm({...matchForm, game_id: e.target.value})}
                    >
                        <option value="">-- Sélectionner un jeu --</option>
                        {games.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>

                    <label>Équipe 1</label>
                    <select
                        value={matchForm.team1_id || ""}
                        onChange={(e) => setMatchForm({...matchForm, team1_id: e.target.value})}
                    >
                        <option value="">-- Sélectionner --</option>
                        {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <label>Équipe 2</label>
                    <select
                        value={matchForm.team2_id || ""}
                        onChange={(e) => setMatchForm({...matchForm, team2_id: e.target.value})}
                    >
                        <option value="">-- Sélectionner --</option>
                        {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <label>Date du match</label>
                    <input
                        type="datetime-local"
                        value={matchForm.match_date || ""}
                        onChange={(e) =>
                            setMatchForm({...matchForm, match_date: e.target.value})
                        }
                    />

                    <input
                        placeholder="Format (ex: BO3)"
                        value={matchForm.format || ""}
                        onChange={(e) => setMatchForm({...matchForm, format: e.target.value})}
                    />

                    <label>Statut</label>
                    <select
                        value={matchForm.status || "scheduled"}
                        onChange={(e) => setMatchForm({...matchForm, status: e.target.value})}
                    >
                        <option value="scheduled">Prévu</option>
                        <option value="ongoing">En cours</option>
                        <option value="finished">Terminé</option>
                    </select>

                    <button type="submit">
                        {editingMatchId ? "Mettre à jour le match" : "Créer match"}
                    </button>
                    {editingMatchId && (
                        <button type="button" onClick={cancelEditMatch}>
                            Annuler
                        </button>
                    )}
                </form>

                <ul style={{listStyle: "none", padding: 0}}>
                    {matches.map((m) => (
                        <li
                            key={m.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                maxWidth: "500px",
                            }}
                        >
                            <strong>
                                {teams.find((t) => t.id === m.team1_id)?.name || "?"} vs{" "}
                                {teams.find((t) => t.id === m.team2_id)?.name || "?"}
                            </strong>{" "}
                            – {games.find((g) => g.id === m.game_id)?.name || "?"} – {m.status}{" "}
                            ({m.format || "?"})
                            <br/>
                            🏆 Tournoi :{" "}
                            {m.tournament_id
                                ? tournaments.find((t) => t.id === m.tournament_id)?.name || "—"
                                : "Aucun"}
                            <div
                                style={{
                                    marginTop: "0.5rem",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                }}
                            >
                                <button onClick={() => startEditingMatch(m)}>Modifier</button>
                                <button onClick={() => deleteMatch(m.id)}>Supprimer</button>

                                {/* Sélecteur de tournoi pour assignation */}
                                <select
                                    defaultValue=""
                                    onChange={(e) =>
                                        assignMatchToTournament(m.id, e.target.value)
                                    }
                                >
                                    <option value="">-- Assigner à un tournoi --</option>
                                    {tournaments.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* --------- TOURNOIS --------- */}
            <section style={{marginBottom: "4rem"}}>
                <h2>🏆 Gestion des tournois</h2>

                <form
                    onSubmit={editingTournamentId ? updateTournament : createTournament}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        maxWidth: "400px",
                        marginBottom: "2rem",
                    }}
                >
                    <input
                        placeholder="Nom du tournoi"
                        value={tournamentForm.name || ""}
                        onChange={(e) =>
                            setTournamentForm({...tournamentForm, name: e.target.value})
                        }
                    />

                    <label>Jeu associé</label>
                    <select
                        value={tournamentForm.game_id || ""}
                        onChange={(e) =>
                            setTournamentForm({...tournamentForm, game_id: e.target.value})
                        }
                    >
                        <option value="">-- Sélectionner un jeu --</option>
                        {games.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Prize Pool (€)"
                        value={tournamentForm.prize_pool || ""}
                        onChange={(e) =>
                            setTournamentForm({
                                ...tournamentForm,
                                prize_pool: Number(e.target.value),
                            })
                        }
                    />

                    <label>Date de début</label>
                    <input
                        type="date"
                        value={tournamentForm.start_date || ""}
                        onChange={(e) =>
                            setTournamentForm({
                                ...tournamentForm,
                                start_date: e.target.value,
                            })
                        }
                    />

                    <label>Date de fin</label>
                    <input
                        type="date"
                        value={tournamentForm.end_date || ""}
                        onChange={(e) =>
                            setTournamentForm({
                                ...tournamentForm,
                                end_date: e.target.value,
                            })
                        }
                    />

                    <input
                        placeholder="Lieu"
                        value={tournamentForm.location || ""}
                        onChange={(e) =>
                            setTournamentForm({
                                ...tournamentForm,
                                location: e.target.value,
                            })
                        }
                    />

                    <label>Statut</label>
                    <select
                        value={tournamentForm.status || "upcoming"}
                        onChange={(e) =>
                            setTournamentForm({
                                ...tournamentForm,
                                status: e.target.value,
                            })
                        }
                    >
                        <option value="upcoming">À venir</option>
                        <option value="ongoing">En cours</option>
                        <option value="finished">Terminé</option>
                    </select>

                    <div style={{display: "flex", gap: "10px", marginTop: "0.5rem"}}>
                        <button type="submit">
                            {editingTournamentId ? "Modifier le tournoi" : "Créer tournoi"}
                        </button>
                        {editingTournamentId && (
                            <button type="button" onClick={cancelEditTournament}>
                                Annuler
                            </button>
                        )}
                    </div>
                </form>

                <ul style={{listStyle: "none", padding: 0}}>
                    {tournaments.map((t) => (
                        <li
                            key={t.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                maxWidth: "500px",
                            }}
                        >
                            <strong>{t.name}</strong> –{" "}
                            {games.find((g) => g.id === t.game_id)?.name || "?"}
                            <br/>
                            💰 {t.prize_pool ? `${t.prize_pool} €` : "N/A"} | 📅{" "}
                            {t.start_date
                                ? new Date(t.start_date).toLocaleDateString("fr-FR")
                                : "?"}{" "}
                            →{" "}
                            {t.end_date
                                ? new Date(t.end_date).toLocaleDateString("fr-FR")
                                : "?"}
                            <br/>
                            📍 {t.location || "—"} | {t.status}
                            <div
                                style={{marginTop: "0.5rem", display: "flex", gap: "10px"}}
                            >
                                <button onClick={() => startEditingTournament(t)}>
                                    Modifier
                                </button>
                                <button onClick={() => deleteTournament(t.id)}>
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    );
}

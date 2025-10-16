"use client";

import { useEffect, useState } from "react";
import TeamsSection from "../../components/admin/TeamsSection";
import GamesSection from "../../components/admin/GamesSection";
import PlayersSection from "../../components/admin/PlayersSection";
import TeamPlayersSection from "../../components/admin/TeamPlayersSection";
import MatchesSection from "../../components/admin/MatchesSection";
import TournamentsSection from "../../components/admin/TournamentsSection";
import Navbar from "../../components/Navbar";

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
    const [activeSection, setActiveSection] = useState<string>("teams");
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

    // --------- PLAYER SUBMIT HANDLER ---------
    async function handlePlayerSubmit(e: React.FormEvent) {
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
    }

    function startEditingPlayer(player: Player) {
        const {avatar_url, ...rest} = player;
        setPlayerForm(rest);
        setEditingPlayerId(player.id);
    }

    async function deletePlayer(id: string) {
        await fetch(`/api/players/${id}`, {method: "DELETE"});
        fetchPlayers();
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

    // --------- SIDEBAR NAVIGATION ---------
    const sidebarItems = [
        { id: "teams", label: "Équipes", icon: "⚙️" },
        { id: "games", label: "Jeux", icon: "🎯" },
        { id: "players", label: "Joueurs", icon: "👤" },
        { id: "teamplayers", label: "Équipes/Joueurs", icon: "👥" },
        { id: "matches", label: "Matchs", icon: "🎮" },
        { id: "tournaments", label: "Tournois", icon: "🏆" },
    ];

    const renderActiveSection = () => {
        switch (activeSection) {
            case "teams":
                return (
                    <TeamsSection
                        teams={teams}
                        form={form}
                        file={file}
                        editingId={editingId}
                        onSubmit={(e) => (editingId ? updateTeam(e) : createTeam(e))}
                        cancelEdit={cancelEdit}
                        startEditing={startEditing}
                        deleteTeam={deleteTeam}
                        setForm={(u) => setForm(u)}
                        setFile={(f) => setFile(f)}
                    />
                );
            case "games":
                return (
                    <GamesSection
                        games={games}
                        gameForm={gameForm}
                        editingGameId={editingGameId}
                        onSubmit={(e) => (editingGameId ? updateGame(e) : createGame(e))}
                        cancelEditGame={cancelEditGame}
                        startEditingGame={startEditingGame}
                        deleteGame={deleteGame}
                        setGameForm={(u) => setGameForm(u)}
                    />
                );
            case "players":
                return (
                    <PlayersSection
                        players={players}
                        playerForm={playerForm}
                        playerFile={playerFile}
                        editingPlayerId={editingPlayerId}
                        onSubmit={handlePlayerSubmit}
                        setPlayerForm={(u) => setPlayerForm(u)}
                        setPlayerFile={(f) => setPlayerFile(f)}
                        setEditingPlayerId={(id) => setEditingPlayerId(id)}
                        startEditingPlayer={startEditingPlayer}
                        deletePlayer={deletePlayer}
                    />
                );
            case "teamplayers":
                return (
                    <TeamPlayersSection
                        teamPlayers={teamPlayers}
                        teamPlayerForm={teamPlayerForm}
                        teams={teams}
                        players={players}
                        onSubmit={addPlayerToTeam}
                        setTeamPlayerForm={(u) => setTeamPlayerForm(u)}
                        removePlayerFromTeam={removePlayerFromTeam}
                    />
                );
            case "matches":
                return (
                    <MatchesSection
                        matches={matches}
                        matchForm={matchForm}
                        editingMatchId={editingMatchId}
                        teams={teams}
                        games={games}
                        tournaments={tournaments}
                        onSubmit={(e) => (editingMatchId ? updateMatch(e) : createMatch(e))}
                        cancelEditMatch={cancelEditMatch}
                        startEditingMatch={startEditingMatch}
                        deleteMatch={deleteMatch}
                        assignMatchToTournament={assignMatchToTournament}
                        setMatchForm={(u) => setMatchForm(u)}
                    />
                );
            case "tournaments":
                return (
                    <TournamentsSection
                        tournaments={tournaments}
                        tournamentForm={tournamentForm}
                        editingTournamentId={editingTournamentId}
                        games={games}
                        onSubmit={(e) => (editingTournamentId ? updateTournament(e) : createTournament(e))}
                        cancelEditTournament={cancelEditTournament}
                        startEditingTournament={startEditingTournament}
                        deleteTournament={deleteTournament}
                        setTournamentForm={(u) => setTournamentForm(u)}
                    />
                );
            default:
                return null;
        }
    };

    // --------- UI ---------
    return (
        <div className="min-h-screen bg-gray-900">

            <Navbar />
            
            
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 shadow-xl h-screen overflow-hidden sticky top-0 self-start">
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-gray-700">
                            <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <nav className="p-4 space-y-2">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeSection === item.id
                                                ? "bg-blue-600 text-white border-r-4 border-blue-400"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        }`}
                                    >
                                        <span className="text-xl mr-3">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                        {renderActiveSection()}
                    </div>
                </div>
            </div>
        </div>
    );
}

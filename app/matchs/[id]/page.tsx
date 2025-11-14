"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LiveBetSection from "@/components/LiveBetSection";

type Team = {
  id: string;
  name: string;
  tag?: string;
  logo_url?: string;
  country?: string;
};

type Tournament = {
  id: string;
  name: string;
  location?: string;
};

type RawMatch = {
  id: string;
  status?: "scheduled" | "live" | "completed" | string;
  match_date?: string;
  format?: string;
  game_id?: string;
  team1_id?: string;
  team2_id?: string;
  team1_score?: number;
  team2_score?: number;
  teams_matches_team1_idToteams?: Team;
  teams_matches_team2_idToteams?: Team;
  teams_matches_winner_idToteams?: Team | null;
  games?: { id: string; name: string; category: string };
  tournaments?: Tournament & { status?: string };
  // odds peut être string (Prisma.Decimal) -> prévoir les deux
  match_odds?: { id: string; team_id: string; odds: number | string }[];
};

type ViewMatch = {
  id: string;
  status?: string;
  match_date?: string;
  format?: string;
  team1?: Team;
  team2?: Team;
  team1_score?: number;
  team2_score?: number;
  tournament?: Tournament;
  odds?: { team1?: number; team2?: number };
};

// ---- NEW: types paris + helpers ----
type Bet = {
  id: string;
  match_id: string;
  team_id: string;
  amount: number | string;
  odds: number | string;
  potential_payout?: number | string;
  status: "pending" | "won" | "lost" | string;
  placed_at?: string;
};

const toNum = (v: unknown) => {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : undefined;
};

export default function MatchPage() {
  const params = useParams<{ id?: string | string[] }>();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [raw, setRaw] = React.useState<RawMatch | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // ---- NEW: état paris ----
  const [bets, setBets] = React.useState<Bet[]>([]);
  const [betsLoading, setBetsLoading] = React.useState(false);

  // ---- NEW: état bouton clôture ----
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const [statusError, setStatusError] = React.useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = React.useState<string | null>(null);

  // -------- fetcher match --------
  const load = React.useCallback(async () => {
    try {
      if (!id) {
        setErr("Identifiant de match manquant.");
        setRaw(null);
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/matches/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Impossible de récupérer le match (${res.status}).`);
      const data: RawMatch = await res.json();
      setRaw(data ?? null);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ---- NEW: fetcher paris ----
  const loadBets = React.useCallback(async (mid?: string) => {
    try {
      if (!mid) return setBets([]);
      setBetsLoading(true);
      const res = await fetch(`/api/bets`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Impossible de récupérer les paris (${res.status}).`);
      const data: Bet[] = await res.json();
      setBets((data ?? []).filter((b) => b.match_id === mid));
    } catch {
      setBets([]);
    } finally {
      setBetsLoading(false);
    }
  }, []);

  // ---- NEW: handler clôture match + règlement des paris ----
  const handleSetFinished = React.useCallback(async () => {
    if (!id) return;

    try {
      setUpdatingStatus(true);
      setStatusError(null);
      setStatusSuccess(null);

      const res = await fetch(`/api/matches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          payload?.error ?? `Impossible de mettre à jour le statut (${res.status}).`
        );
      }

      // On recharge match + paris (qui viennent d'être réglés)
      await load();
      await loadBets(id);

      setStatusSuccess("Match clôturé et paris réglés.");
    } catch (e: any) {
      setStatusError(e?.message ?? "Erreur lors de la clôture du match.");
    } finally {
      setUpdatingStatus(false);
    }
  }, [id, load, loadBets]);

  // -------- initial fetch --------
  React.useEffect(() => {
    load();
  }, [load]);

  // ---- NEW: charge les paris quand l'id change ----
  React.useEffect(() => {
    if (id) loadBets(id);
  }, [id, loadBets]);

  // -------- mapping view --------
  const match: ViewMatch | null = React.useMemo(() => {
    if (!raw) return null;

    const team1: Team | undefined = (() => {
      const base = raw.teams_matches_team1_idToteams;
      const id = base?.id ?? raw.team1_id;
      if (!id) return undefined;
      return {
        id,
        name: base?.name ?? "Équipe 1",
        tag: base?.tag,
        logo_url: base?.logo_url,
        country: base?.country,
      };
    })();

    const team2: Team | undefined = (() => {
      const base = raw.teams_matches_team2_idToteams;
      const id = base?.id ?? raw.team2_id;
      if (!id) return undefined;
      return {
        id,
        name: base?.name ?? "Équipe 2",
        tag: base?.tag,
        logo_url: base?.logo_url,
        country: base?.country,
      };
    })();

    const findOdds = (tid?: string) => {
      if (!tid || !raw.match_odds) return undefined;
      const row = raw.match_odds.find((o) => o.team_id === tid);
      const n = toNum(row?.odds);
      return n && n > 0 ? n : undefined;
    };

    const odds = {
      team1: findOdds(team1?.id ?? raw.team1_id),
      team2: findOdds(team2?.id ?? raw.team2_id),
    };

    return {
      id: raw.id,
      status: raw.status,
      match_date: raw.match_date,
      format: raw.format,
      team1,
      team2,
      team1_score: raw.team1_score,
      team2_score: raw.team2_score,
      tournament: raw.tournaments,
      odds,
    };
  }, [raw]);

  // -------- renders (après tous les hooks) --------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (err || !match) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Navbar />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Match introuvable</h1>
          <p className="text-gray-300 mb-6">{err ?? "Le match demandé n’existe pas."}</p>
          <Link
            href="/matchs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2621BF] hover:bg-[#3c36e0] transition"
          >
            ← Retour aux matchs
          </Link>
        </div>
      </div>
    );
  }

  const {
    team1,
    team2,
    tournament,
    status,
    team1_score,
    team2_score,
    format,
    match_date,
    odds,
  } = match;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>

      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: infos match */}
            <div className="flex items-center gap-4">
              <Link
                href="/matchs"
                className="text-gray-300 hover:text-white transition"
              >
                ← Matchs
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {(team1?.tag || team1?.name) ?? "Équipe 1"} vs{" "}
                  {(team2?.tag || team2?.name) ?? "Équipe 2"}
                </h1>
                <p className="text-gray-300">
                  {tournament?.name ?? "Tournoi"} • {format ?? "Format inconnu"}
                </p>
                <p className="text-gray-400">
                  {status === "live"
                    ? "En direct"
                    : status === "scheduled"
                    ? "Programmé"
                    : "Terminé"}
                  {match_date ? ` • ${new Date(match_date).toLocaleString()}` : ""}
                  {tournament?.location ? ` • ${tournament.location}` : ""}
                </p>

                {statusError && (
                  <p className="text-sm text-red-400 mt-1">
                    {statusError}
                  </p>
                )}
                {statusSuccess && (
                  <p className="text-sm text-emerald-400 mt-1">
                    {statusSuccess}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1-2: résumé du match */}
        <div className="lg:col-span-2 space-y-8">
          {/* Scoreboard */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="grid grid-cols-3 items-center">
              <TeamCell team={team1} align="left" />
              <div className="text-center">
                <div className="text-4xl font-extrabold text-white">
                  {(team1_score ?? 0)} — {(team2_score ?? 0)}
                </div>
                <div className="text-gray-400 text-sm">
                  {status === "live"
                    ? "En direct"
                    : status === "scheduled"
                    ? "À venir"
                    : "Terminé"}
                </div>
              </div>
              <TeamCell team={team2} align="right" />
            </div>
          </div>

          {/* Détails */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Détails du match</h2>
            <ul className="text-sm text-gray-300 space-y-2">
              <InfoRow label="Tournoi" value={tournament?.name ?? "—"} />
              <InfoRow label="Format" value={format ?? "—"} />
              <InfoRow label="Statut" value={status ?? "—"} />
              <InfoRow
                label="Date & heure"
                value={
                  match_date ? new Date(match_date).toLocaleString() : "—"
                }
              />
              {tournament?.location && (
                <InfoRow label="Lieu" value={tournament.location} />
              )}
              <InfoRow
                label="Cote équipe 1"
                value={odds?.team1 ? odds.team1.toFixed(2) : "—"}
              />
              <InfoRow
                label="Cote équipe 2"
                value={odds?.team2 ? odds.team2.toFixed(2) : "—"}
              />
            </ul>
          </div>
        </div>

        {/* Col 3: actions + paris */}
        <div className="space-y-8">
          <LiveBetSection
            isLive={status === "live"}
            matchId={match.id}
            team1={team1}
            team2={team2}
            odds={odds}
            // ---- NEW: rafraîchir match + paris après un pari ----
            onBetPlaced={async () => {
              await load();
              await loadBets(match.id);
            }}
          />

          {/* ---- NEW: panneau Mes paris ---- */}
          <BetsPanel bets={bets} team1={team1} team2={team2} loading={betsLoading} />

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-2">À propos des équipes</h3>
            <p className="text-gray-400 text-sm">
              Ajoute ici des stats H2H, les formes récentes, ou des liens vers les
              pages équipes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamCell({
  team,
  align = "left",
}: {
  team?: Team | null;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center ${
        align === "right" ? "justify-end" : ""
      } gap-3`}
    >
      {align === "left" && (
        <Logo src={team?.logo_url} alt={team?.name || "Team"} />
      )}
      <div className={align === "right" ? "text-right" : ""}>
        <div className="text-white font-semibold">{team?.name ?? "—"}</div>
        <div className="text-gray-400 text-sm">{team?.tag ?? ""}</div>
      </div>
      {align === "right" && (
        <Logo src={team?.logo_url} alt={team?.name || "Team"} />
      )}
    </div>
  );
}

function Logo({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative h-12 w-12">
      <Image
        src={src || "/placeholder-team.png"}
        alt={alt}
        fill
        sizes="48px"
        className="object-contain rounded-lg"
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-gray-700/60 last:border-none pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </li>
  );
}

// ---- NEW: composant Mes paris ----
function BetsPanel({
  bets,
  team1,
  team2,
  loading,
}: {
  bets: Bet[];
  team1?: Team;
  team2?: Team;
  loading?: boolean;
}) {
  const totalStake = bets.reduce((s, b) => s + (toNum(b.amount) ?? 0), 0);
  const totalPotential = bets.reduce((s, b) => {
    const p = toNum(b.potential_payout);
    if (p !== undefined) return s + p;
    const amt = toNum(b.amount) ?? 0;
    const od = toNum(b.odds) ?? 0;
    return s + amt * od;
  }, 0);

  const teamName = (tid: string) => {
    if (tid === team1?.id) return team1?.name ?? "Équipe 1";
    if (tid === team2?.id) return team2?.name ?? "Équipe 2";
    return "Équipe";
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-white font-semibold">Mes paris</h3>
        {loading && <span className="text-xs text-gray-400">Chargement…</span>}
      </div>

      {bets.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun pari sur ce match.</p>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
            <span>Mise totale</span>
            <span className="text-white font-semibold">
              {totalStake.toFixed(2)} €
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
            <span>Gain potentiel total</span>
            <span className="text-white font-semibold">
              {totalPotential.toFixed(2)} €
            </span>
          </div>

          <ul className="space-y-3">
            {bets.map((b) => {
              const amount = toNum(b.amount) ?? 0;
              const odds = toNum(b.odds) ?? 0;
              const payout =
                toNum(b.potential_payout) ?? amount * odds;
              const dt = b.placed_at
                ? new Date(b.placed_at).toLocaleString()
                : "";

              return (
                <li
                  key={b.id}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {teamName(b.team_id)}
                      </div>
                      <div className="text-gray-400 text-xs">{dt}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 text-sm">
                        Mise{" "}
                        <span className="text-white font-semibold">
                          {amount.toFixed(2)} €
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        Cote{" "}
                        <span className="text-white font-semibold">
                          {odds.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        Potentiel{" "}
                        <span className="text-white font-semibold">
                          {payout.toFixed(2)} €
                        </span>
                      </div>
                      <div className="text-xs mt-1">
                        <StatusPill status={b.status} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  const label =
    status === "won"
      ? "Gagné"
      : status === "lost"
      ? "Perdu"
      : status === "pending"
      ? "En attente"
      : status ?? "—";

  const base = "px-2 py-0.5 rounded-full border text-xs";
  const cls =
    status === "won"
      ? "border-emerald-600 text-emerald-400"
      : status === "lost"
      ? "border-rose-600 text-rose-400"
      : "border-gray-600 text-gray-300";
  return <span className={`${base} ${cls}`}>{label}</span>;
}

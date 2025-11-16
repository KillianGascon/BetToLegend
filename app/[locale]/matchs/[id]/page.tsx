"use client";

import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LiveBetSection from "@/components/matchs/detail/LiveBetSection";
import Link from "next/link";
import MatchLocales from "@/app/[locale]/matchs/[id]/locales.json";
import MatchHeader from "@/components/matchs/detail/MatchHeader";
import Scoreboard from "@/components/matchs/detail/Scoreboard";
import MatchDetails from "@/components/matchs/detail/MatchDetails";
import BetsPanel from "@/components/matchs/detail/BetsPanel";

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
  const locale = (() => {
    try {
      const seg = (window.location.pathname.split("/")[1] || "fr") as keyof typeof MatchLocales;
      return ["fr", "en", "ko"].includes(seg) ? seg : "fr";
    } catch {
      return "fr";
    }
  })() as keyof typeof MatchLocales;
  const copy = MatchLocales[locale];

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
      <div className="relative min-h-screen">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/bg.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 lg:h-20 lg:w-20 border-b-2 border-legend-red"></div>
            <p className="text-white font-montserrat text-base sm:text-lg lg:text-xl">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (err || !match) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/bg.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
            <Navbar />
          </header>
          <div className="container mx-auto px-6 lg:px-16 py-16 text-center flex-1 flex items-center justify-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                {copy.notFound.title}
              </h1>
              <p className="text-white/80 font-montserrat text-lg sm:text-xl mb-8">
                {err ?? copy.notFound.description}
              </p>
              <Link
                href={`/${locale}/matchs`}
                className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-[12px] bg-legend-red text-white font-montserrat font-medium text-base sm:text-lg hover:bg-legend-red/80 duration-200 hover:scale-105 active:scale-95 transition-transform"
              >
                {copy.notFound.back}
              </Link>
            </div>
          </div>
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
    <div className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="container mx-auto px-6 py-4 lg:px-16 lg:py-6 shrink-0">
          <Navbar />
        </header>

        <MatchHeader
          locale={locale}
          backLabel={copy.header.back}
          vsPattern={copy.header.vs}
          tournamentFormatPattern={copy.header.tournamentFormat}
          tournament={tournament?.name}
          format={format}
          team1={team1}
          team2={team2}
          status={status}
          matchDate={match_date}
          location={tournament?.location}
          statusLabels={copy.header.status}
        />

        {/* Body */}
        <main className="flex-1 container mx-auto px-6 lg:px-16 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Col 1-2: résumé du match */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <Scoreboard
                team1={team1}
                team2={team2}
                team1Score={team1_score}
                team2Score={team2_score}
                status={status}
                statusLabels={copy.scoreboard.status}
              />

              <MatchDetails
                title={copy.details.title}
                labels={copy.details}
                tournament={tournament?.name}
                format={format}
                status={status}
                matchDate={match_date}
                location={tournament?.location}
                odds={odds}
              />
            </div>

            {/* Col 3: actions + paris */}
            <div className="space-y-6 lg:space-y-8">
              <LiveBetSection
                isLive={status === "live"}
                matchId={match.id}
                team1={team1}
                team2={team2}
                odds={odds}
                copy={copy.liveBet}
                // ---- NEW: rafraîchir match + paris après un pari ----
                onBetPlaced={async () => {
                  await load();
                  await loadBets(match.id);
                }}
              />

              <BetsPanel
                bets={bets}
                team1={team1}
                team2={team2}
                loading={betsLoading}
                labels={copy.betsPanel}
              />

              <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6">
                <h3 className="text-white font-montserrat font-bold text-lg sm:text-xl mb-3">
                  {copy.aboutTeams.title}
                </h3>
                <p className="text-white/70 font-montserrat text-sm sm:text-base">
                  {copy.aboutTeams.body}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

 

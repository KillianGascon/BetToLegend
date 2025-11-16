"use client";

import Image from "next/image";
import React, { useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

// Types basiques pour les props
export type Team = {
  id: string;
  name: string;
  tag?: string;
  logo_url?: string;
  country?: string;
};

export type LiveBetSectionProps = {
  isLive: boolean;
  matchId: string;
  team1?: Team | null;
  team2?: Team | null;
  odds?: { team1?: number; team2?: number };
  onBetPlaced?: () => void;
  copy?: {
    notLive: { title: string; description: string };
    title: string;
    signedOutText: string;
    signIn: string;
    form: {
      amountLabel: string;
      amountPlaceholder: string;
      potentialTitle: string;
      submit: string;
      submitting: string;
      disclaimer: string;
      teamOddsPrefix: string;
      errorChooseTeam: string;
      errorInvalidAmount: string;
      successPattern: string;
    };
  };
};

export default function LiveBetSection({
  isLive,
  matchId,
  team1,
  team2,
  odds,
  onBetPlaced,
  copy,
}: LiveBetSectionProps) {
  if (!isLive) {
    return (
      <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6">
        <h3 className="text-white font-montserrat font-bold text-lg sm:text-xl mb-3">
          {copy?.notLive.title ?? "Parier sur ce match"}
        </h3>
        <p className="text-white/70 font-montserrat text-sm sm:text-base">
          {copy?.notLive.description ?? "Les paris ouvrent uniquement lorsque le match est en direct."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] p-6">
      <h3 className="text-white font-montserrat font-bold text-lg sm:text-xl mb-6">
        {copy?.title ?? "Parier en direct"}
      </h3>

      <SignedOut>
        <p className="text-white/70 font-montserrat text-sm sm:text-base mb-4">
          {copy?.signedOutText ?? "Connecte-toi pour placer un pari en direct."}
        </p>
        <SignInButton mode="modal">
          <button className="w-full px-4 py-3 rounded-[12px] bg-legend-red hover:bg-legend-red/80 text-white font-montserrat font-medium transition-all duration-200 hover:scale-105 active:scale-95">
            {copy?.signIn ?? "Se connecter"}
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <BetForm
          matchId={matchId}
          team1={team1}
          team2={team2}
          odds={odds}
          onBetPlaced={onBetPlaced}
          copy={copy?.form}
        />
      </SignedIn>
    </div>
  );
}

/* ---------------- Formulaire ---------------- */

function BetForm({
  matchId,
  team1,
  team2,
  odds,
  onBetPlaced,
  copy,
}: {
  matchId: string;
  team1?: Team | null;
  team2?: Team | null;
  odds?: { team1?: number; team2?: number };
  onBetPlaced?: () => void;
  copy?: {
    amountLabel: string;
    amountPlaceholder: string;
    potentialTitle: string;
    submit: string;
    submitting: string;
    disclaimer: string;
    teamOddsPrefix: string;
    errorChooseTeam: string;
    errorInvalidAmount: string;
    successPattern: string;
  };
}) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedOdds =
    selectedTeamId === team1?.id ? odds?.team1 :
    selectedTeamId === team2?.id ? odds?.team2 :
    undefined;

  const payout = selectedOdds && amount
    ? Number(amount) * selectedOdds
    : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const amt = Number(amount);
    if (!selectedTeamId) return setError(copy?.errorChooseTeam ?? "Choisis une équipe.");
    if (!Number.isFinite(amt) || amt <= 0) return setError(copy?.errorInvalidAmount ?? "Montant invalide.");

    try {
      setLoading(true);
      // IMPORTANT: ne pas envoyer 'odds' - le serveur calcule et fige la cote
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: matchId,
          team_id: selectedTeamId,
          amount: amt,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        // remonte le message précis de l'API si dispo
        const msg = json?.error || `Erreur ${res.status}`;
        throw new Error(msg);
      }

      // La réponse contient la cote réellement prise en compte + payout
      const serverOdds: number | string | undefined = json?.odds;
      const serverPayout: number | string | undefined = json?.potential_payout;

      const pattern = copy?.successPattern ?? "Pari placé : cote {odds} • gains potentiels {payout}";
      setSuccess(pattern.replace("{odds}", fmtNum(serverOdds)).replace("{payout}", fmtNum(serverPayout)));
      setAmount("");
      setSelectedTeamId(null);

      // refresh des cotes côté parent
      onBetPlaced?.();
    } catch (err: any) {
      setError(err?.message ?? "Impossible de placer le pari.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sélection des équipes */}
      <div className="grid grid-cols-2 gap-3">
        <TeamButton
          team={team1}
          odds={odds?.team1}
          selected={selectedTeamId === team1?.id}
          onSelect={() => setSelectedTeamId(team1?.id || null)}
        />
        <TeamButton
          team={team2}
          odds={odds?.team2}
          selected={selectedTeamId === team2?.id}
          onSelect={() => setSelectedTeamId(team2?.id || null)}
        />
      </div>

      {/* Montant */}
      <div>
        <label className="block text-sm sm:text-base text-white/70 font-montserrat mb-2">
          {copy?.amountLabel ?? "Montant"}
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={copy?.amountPlaceholder ?? "Ex: 10.00"}
          className="w-full px-4 py-3 bg-white/10 border-2 border-legend-blue rounded-[12px] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-legend-red focus:border-legend-red font-montserrat"
          aria-label={copy?.amountLabel ?? "Montant du pari"}
        />
      </div>

      {/* Gains estimés (indicatif client) */}
      <div className="bg-legend-red/20 border-2 border-legend-red rounded-[12px] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-white/70 font-montserrat">
            {(copy?.potentialTitle ?? "Gains potentiels")}
          </span>
          <span className="text-xl sm:text-2xl font-montserrat font-extrabold text-legend-red">
            {payout ? payout.toFixed(2) : "—"}€
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-legend-red/20 border-2 border-legend-red rounded-[12px] p-3">
          <p className="text-white font-montserrat text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-legend-blue/30 border-2 border-legend-blue rounded-[12px] p-3">
          <p className="text-white font-montserrat text-sm">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedTeamId || !amount}
        className="w-full px-4 py-3 rounded-[12px] bg-legend-red hover:bg-legend-red/80 text-white font-montserrat font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
      >
        {loading ? (copy?.submitting ?? "Placement...") : (copy?.submit ?? "Placer le pari")}
      </button>

      <p className="text-xs text-white/50 font-montserrat">
        {copy?.disclaimer ?? "Les cotes peuvent évoluer. Les gains sont validés côté serveur."}
      </p>
    </form>
  );
}

/* ---------------- UI helpers ---------------- */

function TeamButton({
  team,
  odds,
  selected,
  onSelect,
  oddsPrefix,
}: {
  team?: Team | null;
  odds?: number;
  selected: boolean;
  onSelect: () => void;
  oddsPrefix?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`border-2 rounded-[12px] p-4 text-left transition-all duration-200 ${
        selected
          ? "border-legend-red bg-legend-red/20 hover:bg-legend-red/30 scale-105"
          : "border-legend-blue bg-legend-blue/10 hover:bg-legend-blue/20 hover:scale-105 active:scale-95"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <MiniLogo src={team?.logo_url} alt={team?.name || "Équipe"} />
        <div className="flex-1 min-w-0">
          <div className="text-white font-montserrat font-bold text-sm sm:text-base truncate">
            {team?.name ?? "Équipe"}
          </div>
          <div className="text-white/70 font-montserrat text-xs sm:text-sm">
            {(oddsPrefix ?? "Cote")} {formatOdds(odds)}
          </div>
        </div>
      </div>
    </button>
  );
}

function MiniLogo({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 32px, 40px"
          className="object-contain rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-montserrat font-bold text-xs sm:text-sm">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

function formatOdds(v?: number) {
  return typeof v === "number" ? v.toFixed(2) : "—";
}

function fmtNum(v: number | string | undefined) {
  if (v === undefined || v === null) return "—";
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n.toFixed(2) : String(v);
}

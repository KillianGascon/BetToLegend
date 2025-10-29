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
};

export default function LiveBetSection({
                                           isLive,
                                           matchId,
                                           team1,
                                           team2,
                                           odds,
                                       }: LiveBetSectionProps) {
    if (!isLive) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-2">Parier sur ce match</h3>
                <p className="text-gray-400 text-sm">
                    Les paris ouvrent uniquement lorsque le match est en direct.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Parier en direct</h3>

            <SignedOut>
                <p className="text-gray-300 text-sm mb-4">
                    Connecte-toi pour placer un pari en direct.
                </p>
                <SignInButton mode="modal">
                    <button className="w-full px-4 py-2 rounded-xl bg-[#2621BF] hover:bg-[#3c36e0] text-white transition">
                        Se connecter
                    </button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <BetForm
                    matchId={matchId}
                    team1={team1}
                    team2={team2}
                    odds={odds}
                />
            </SignedIn>
        </div>
    );
}

// ----- Sous-composant Formulaire -----

function BetForm({
                     matchId,
                     team1,
                     team2,
                     odds,
                 }: {
    matchId: string;
    team1?: Team | null;
    team2?: Team | null;
    odds?: { team1?: number; team2?: number };
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
        if (!selectedTeamId) return setError("Choisis une équipe.");
        if (!Number.isFinite(amt) || amt <= 0) return setError("Montant invalide.");

        try {
            setLoading(true);
            const res = await fetch("/api/bets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    match_id: matchId,
                    team_id: selectedTeamId,
                    amount: amt,
                    odds: selectedOdds,
                }),
            });

            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            setSuccess("Pari placé avec succès !");
            setAmount("");
            setSelectedTeamId(null);
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
                <label className="block text-sm text-gray-300 mb-1">Montant</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: 10.00"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:border-[#6a66ff]"
                />
            </div>

            {/* Gains estimés */}
            <div className="text-sm text-gray-300">
                Gains potentiels&nbsp;:&nbsp;
                <span className="text-white font-semibold">
          {payout ? payout.toFixed(2) : "—"}
        </span>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button
                type="submit"
                disabled={loading || !selectedTeamId || !amount}
                className="w-full px-4 py-2 rounded-xl bg-[#2621BF] hover:bg-[#3c36e0] text-white disabled:opacity-50 transition"
            >
                {loading ? "Placement..." : "Placer le pari"}
            </button>

            <p className="text-xs text-gray-500">
                Les cotes peuvent évoluer. Les gains sont validés côté serveur.
            </p>
        </form>
    );
}

// ----- Sous-composants visuels -----

function TeamButton({
                        team,
                        odds,
                        selected,
                        onSelect,
                    }: {
    team?: Team | null;
    odds?: number;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`border rounded-xl p-3 text-left transition ${
                selected ? "border-[#6a66ff] bg-[#6a66ff]/10" : "border-gray-700 hover:border-gray-600"
            }`}
        >
            <div className="flex items-center gap-2">
                <MiniLogo src={team?.logo_url} alt={team?.name || "Équipe"} />
                <div>
                    <div className="text-white font-medium">{team?.name ?? "Équipe"}</div>
                    <div className="text-gray-400 text-sm">Cote {formatOdds(odds)}</div>
                </div>
            </div>
        </button>
    );
}

function MiniLogo({ src, alt }: { src?: string; alt: string }) {
    return (
        <div className="relative h-6 w-6">
            <Image
                src={src || "/placeholder-team.png"}
                alt={alt}
                fill
                sizes="24px"
                className="object-contain rounded"
            />
        </div>
    );
}

function formatOdds(v?: number) {
    return typeof v === "number" ? v.toFixed(2) : "—";
}

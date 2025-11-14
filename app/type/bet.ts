import type { Decimal } from "@prisma/client/runtime/library";
import type { bets, matches, match_odds, users } from "@prisma/client";

/**
 * Payload brut envoyé par le client avant parsing Zod.
 * Attention : les valeurs sont inconnues / string / mixed.
 */
export interface RawBetPayload {
  match_id?: unknown;
  team_id?: unknown;
  amount?: unknown;
}

/**
 * Payload validé après Zod:
 * match_id   = string UUID
 * team_id    = string UUID
 * amount     = Decimal (de Prisma)
 */
export interface ParsedBetPayload {
  match_id: string;
  team_id: string;
  amount: Decimal;
}

/**
 * Réponse API standard lors de la création d’un pari.
 */
export interface BetApiResponse {
  id: string;
  user_id: string;
  match_id: string;
  team_id: string;
  amount: Decimal;
  odds: Decimal;
  potential_payout: Decimal;
  status: string;
  placed_at: Date;
  reqId?: string;
}

export interface OddsComputed {
  o1: Decimal;
  o2: Decimal;
}

/**
 * Groupe les volumes d'un match :
 * key = team_id
 * value = Decimal (somme des paris)
 */
export type MatchVolumeMap = Map<string, Decimal>;

/**
 * Structure utile pour le logging et le recalcul.
 */
export interface VolumeSnapshots {
  before: MatchVolumeMap;
  after: MatchVolumeMap;
}

/**
 * Cotes stockées avant/après mouvement.
 */
export interface OddsMovement {
  pre: Record<string, Decimal>;
  post: Record<string, Decimal>;
}

/**
 * Full bet incluant les relations Prisma.
 */
export interface FullBet extends bets {
  matches: matches & {
    match_odds?: match_odds[];
  };
  users: users;
}

/**
 * Type Guard : vérifie qu'un payload contient les clés minimales
 */
export function isRawBetPayload(v: unknown): v is RawBetPayload {
  if (!v || typeof v !== "object") return false;
  return "match_id" in v || "team_id" in v || "amount" in v;
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";
import type { Prisma } from "@prisma/client";

type UnknownRecord = Record<string, unknown>;
type Tx = Prisma.TransactionClient;

/**
 * Safely stringify any value for logging.
 * - Truncates long strings to avoid log spam.
 * - Falls back to String() if JSON.stringify fails.
 */
function safeStringify(v: unknown, max = 800) {
  try {
    const s = JSON.stringify(v);
    return s.length > max ? s.slice(0, max) + `…(+${s.length - max} chars)` : s;
  } catch {
    return String(v);
  }
}

/**
 * Better typeof helper that:
 * - Distinguishes null / arrays / objects.
 */
function typeOf(v: unknown) {
  if (v === null) return "null";
  const t = typeof v;
  if (t !== "object") return t;
  if (Array.isArray(v)) return "array";
  return "object";
}

/**
 * Extracts basic debug info for a set of fields:
 * - key
 * - presence in body
 * - type
 * - short value preview (only for string/number)
 */
function fieldInfo(body: UnknownRecord, keys: string[]) {
  return keys.map((k) => ({
    key: k,
    present: Object.prototype.hasOwnProperty.call(body, k),
    type: typeOf(body[k]),
    valuePreview:
      typeof body[k] === "string" || typeof body[k] === "number"
        ? String(body[k])
        : undefined,
  }));
}

/**
 * Logging helpers standardized with request ID prefix.
 */
function logStart(reqId: string, msg: string, extra?: unknown) {
  console.log(
    `[bets][${reqId}] ${msg}${extra ? " " + safeStringify(extra) : ""}`,
  );
}

function logDebug(reqId: string, msg: string, extra?: unknown) {
  console.debug(
    `[bets][${reqId}] ${msg}${extra ? " " + safeStringify(extra) : ""}`,
  );
}

function logError(reqId: string, msg: string, extra?: unknown) {
  console.error(
    `[bets][${reqId}] ${msg}${extra ? " " + safeStringify(extra) : ""}`,
  );
}

/**
 * Read and normalize the request body depending on content-type:
 * - application/json → req.json()
 * - multipart/form-data → formData() (string fields only)
 * - x-www-form-urlencoded → URLSearchParams
 * - fallback: try JSON again, else empty {}
 */
async function readBody(
  req: Request,
): Promise<{ body: UnknownRecord; ct: string }> {
  const ct = (req.headers.get("content-type") || "").toLowerCase();

  if (ct.includes("application/json")) {
    try {
      const body = (await req.json()) as UnknownRecord;
      return { body, ct };
    } catch {
      return { body: {}, ct };
    }
  }

  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const obj: UnknownRecord = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") obj[k] = v.trim();
    });
    return { body: obj, ct };
  }

  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const obj: UnknownRecord = {};
    for (const [k, v] of params.entries()) obj[k] = v.trim();
    return { body: obj, ct };
  }

  // Last attempt: try JSON again, else empty body
  try {
    const body = (await req.json()) as UnknownRecord;
    return { body, ct: ct || "unknown" };
  } catch {
    return { body: {}, ct: ct || "unknown" };
  }
}

/**
 * Normalize incoming body keys and values:
 * - Map camelCase → snake_case for matchId/teamId.
 * - Trim string values.
 * - Normalize numeric-like strings ("1,23" → "1.23").
 */
function normalizeKeys(raw: UnknownRecord): UnknownRecord {
  const body: UnknownRecord = { ...raw };

  if ("matchId" in body && !("match_id" in body)) {
    body.match_id = body.matchId;
  }
  if ("teamId" in body && !("team_id" in body)) {
    body.team_id = body.teamId;
  }

  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string") {
      const t = v.trim();
      // Accept integers or decimals with , or . as separator
      body[k] = /^-?\d+(?:[.,]\d+)?$/.test(t) ? t.replace(",", ".") : t;
    }
  }

  return body;
}

/**
 * Zod transformer for required decimal fields:
 * - Rejects undefined/null/empty string.
 * - Creates a Decimal instance.
 * - Ensures the value is finite.
 */
const requiredDecimal = (name: string) =>
  z.any().transform<Decimal>((v) => {
    if (
      v === undefined ||
      v === null ||
      (typeof v === "string" && v.trim() === "")
    ) {
      throw new Error(`${name} is required`);
    }

    try {
      const d = new Decimal(v as any);

      if (typeof (d as any).isFinite === "function" && !(d as any).isFinite()) {
        throw new Error(`${name} must be finite`);
      }

      return d;
    } catch {
      throw new Error(`${name} is not a valid decimal`);
    }
  });

/**
 * Request body schema for placing a bet.
 * - match_id: UUID string
 * - team_id: UUID string
 * - amount: positive Decimal
 *   (converted via requiredDecimal and refined to be > 0)
 */
const BetBody = z
  .object({
    match_id: z.string().uuid({ message: "match_id must be a UUID" }),
    team_id: z.string().uuid({ message: "team_id must be a UUID" }),
    amount: requiredDecimal("amount").refine((d) => d.gt(0), {
      message: "amount must be > 0",
    }),
  })
  .strict();

type BetBodyInput = z.infer<typeof BetBody>;

/**
 * Constants for odds calculation:
 * - MIN_ODDS / MAX_ODDS: clamps odds.
 * - PRIOR: Bayesian prior volume added per team.
 * - OVERROUND: factor to apply bookmaker overround (here 1 = fair).
 */
const MIN_ODDS = new Decimal(1.01);
const MAX_ODDS = new Decimal(99.99);
const PRIOR = new Decimal(5);
const OVERROUND = new Decimal(1);
const TWO = new Decimal(2);

/**
 * Round Decimal to 2 decimal places, HALF_UP.
 */
const round2 = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

/**
 * Acquire a transaction-scoped advisory lock on a key.
 * - Uses PostgreSQL pg_advisory_xact_lock(hashtext(key)).
 * - Ensures serialized operations per match_id.
 */
async function advisoryLock(tx: Tx, key: string) {
  await tx.$executeRawUnsafe(
    `SELECT pg_advisory_xact_lock(hashtext($1))`,
    key,
  );
}

/**
 * Compute current bet volumes per team for a match.
 * - Returns a Map<team_id, Decimal(total_amount)>.
 */
async function currentVolumes(tx: Tx, matchId: string) {
  const grouped = await tx.bets.groupBy({
    by: ["team_id"],
    where: { match_id: matchId },
    _sum: { amount: true },
  });

  const map = new Map<string, Decimal>();

  for (const g of grouped) {
    if (!g.team_id) continue;
    map.set(g.team_id, new Decimal(g._sum.amount ?? 0));
  }

  return map;
}

/**
 * Compute odds for a 2-team market based on bet volumes:
 * - Adds PRIOR to each team's volume (Bayesian smoothing).
 * - Converts to implied probabilities p1, p2.
 * - Inverts to odds (1/p).
 * - Applies OVERROUND if ≠ 1.
 * - Clamps between MIN_ODDS and MAX_ODDS.
 */
function computeOddsFromVolumes(v1: Decimal, v2: Decimal) {
  const a1 = v1.add(PRIOR);
  const a2 = v2.add(PRIOR);
  const tot = a1.add(a2);
  if (tot.lte(0)) return { o1: TWO, o2: TWO }; // fallback symmetric odds

  const p1 = a1.div(tot);
  const p2 = a2.div(tot);

  let o1 = new Decimal(1).div(p1);
  let o2 = new Decimal(1).div(p2);

  if (!OVERROUND.eq(1)) {
    o1 = o1.div(OVERROUND);
    o2 = o2.div(OVERROUND);
  }

  o1 = round2(Decimal.max(MIN_ODDS, Decimal.min(MAX_ODDS, o1)));
  o2 = round2(Decimal.max(MIN_ODDS, Decimal.min(MAX_ODDS, o2)));
  return { o1, o2 };
}

/**
 * POST /api/bets
 *
 * Core workflow:
 * 1. Auth user via Clerk.
 * 2. Parse and normalize body.
 * 3. Validate with Zod, convert amount → Decimal.
 * 4. In a DB transaction (with advisory lock on match_id):
 *    - Check match exists and is open.
 *    - Check team belongs to match.
 *    - Load user and validate balance.
 *    - Read current volumes and compute pre-bet odds.
 *    - Upsert pre-bet odds into match_odds.
 *    - Create bet, debit user balance and update total_bet.
 *    - Recompute odds after including this bet and update match_odds.
 * 5. Return created bet + reqId, or functional error with 400, else 500.
 */
export async function POST(req: Request) {
  const reqId =
    (globalThis as any).crypto?.randomUUID?.() ?? `r${Date.now()}`;
  const t0 = Date.now();
  logStart(reqId, "POST /api/bets start", {
    method: req.method,
    url: (req as any).url,
  });

  try {
    // 1. Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", reqId },
        { status: 401 },
      );
    }
    logDebug(reqId, "auth ok", { userId });

    // 2. Body parsing + logging
    const { body: raw, ct } = await readBody(req);
    logDebug(reqId, "content-type & raw body", {
      contentType: ct,
      rawPreview: fieldInfo(raw, ["match_id", "team_id", "amount", "odds"]),
    });

    const body = normalizeKeys(raw);

    // Ignore odds if client sends them (odds are server-controlled)
    if (Object.prototype.hasOwnProperty.call(body, "odds")) {
      logDebug(reqId, "client sent odds — ignored", {
        sentOdds: (body as any).odds,
      });
      delete (body as any).odds;
    }

    logDebug(reqId, "normalized body", {
      fields: fieldInfo(body, ["match_id", "team_id", "amount"]),
    });

    // 3. Validation with Zod
    const parsed = BetBody.safeParse(body);
    if (!parsed.success) {
      logError(reqId, "validation failed", { issues: parsed.error.issues });
      const flat = parsed.error.flatten();
      const keys = ["match_id", "team_id", "amount"] as const;

      return NextResponse.json(
        {
          error: "Validation failed",
          fieldErrors: flat.fieldErrors,
          formErrors: flat.formErrors,
          receivedTypes: Object.fromEntries(
            keys.map((k) => [k, typeOf(body[k])]),
          ),
          receivedValues: Object.fromEntries(
            keys.map((k) => [k, body[k] ?? null]),
          ),
          reqId,
        },
        { status: 400 },
      );
    }

    const { match_id, team_id, amount } = parsed.data as BetBodyInput; // amount is a Decimal

    // 4. Main transactional logic
    const bet = await prisma.$transaction(async (tx: Tx) => {
      // Serialize operations on this match to avoid race conditions on odds/volumes
      await advisoryLock(tx, match_id);

      // Load match and check status
      const match = await tx.matches.findUnique({
        where: { id: match_id },
        select: {
          status: true,
          team1_id: true,
          team2_id: true,
        },
      });

      if (!match) {
        logError(reqId, "match not found", { match_id });
        throw new Error("Match not found");
      }

      if (match.status === "finished") {
        logDebug(reqId, "betting closed", {
          match_id,
          status: match.status,
        });
        throw new Error("Betting closed for this match");
      }

      const t1 = match.team1_id;
      const t2 = match.team2_id;

      if (!t1 || !t2) {
        throw new Error("Match is missing teams");
      }

      if (team_id !== t1 && team_id !== t2) {
        logError(reqId, "team not in match", { team_id, valid: [t1, t2] });
        throw new Error("Selected team is not part of this match");
      }

      // Load user and check balance
      const user = await tx.users.findUnique({ where: { clerkid: userId } });
      if (!user) {
        logError(reqId, "user not found");
        throw new Error("User not found");
      }

      const currentBalance = new Decimal(user.balance ?? 0);
      if (currentBalance.lt(amount)) {
        logDebug(reqId, "insufficient balance", {
          required: amount.toString(),
          balance: currentBalance.toString(),
        });
        throw new Error("Insufficient balance");
      }

      // Current market volumes before placing this bet
      const vols = await currentVolumes(tx, match_id);
      const v1_before = vols.get(t1) ?? new Decimal(0);
      const v2_before = vols.get(t2) ?? new Decimal(0);

      // Pre-bet odds (used for this bet and for UI)
      const { o1: preO1, o2: preO2 } = computeOddsFromVolumes(
        v1_before,
        v2_before,
      );

      // Upsert odds for both teams before the bet (snapshot of current market)
      await tx.match_odds.upsert({
        where: { match_id_team_id: { match_id, team_id: t1 } },
        update: { odds: preO1, updated_at: new Date() },
        create: { match_id, team_id: t1, odds: preO1 },
      });

      await tx.match_odds.upsert({
        where: { match_id_team_id: { match_id, team_id: t2 } },
        update: { odds: preO2, updated_at: new Date() },
        create: { match_id, team_id: t2, odds: preO2 },
      });

      // Odds used for this specific bet
      const oddsForBet = team_id === t1 ? preO1 : preO2;
      const potential_payout = amount.mul(oddsForBet);

      // Create bet row
      const createdBet = await tx.bets.create({
        data: {
          user_id: user.id,
          match_id,
          team_id,
          amount,
          odds: oddsForBet,
          potential_payout,
          status: "pending",
        },
      });

      // Update user balance & total_bet atomically
      await tx.users.update({
        where: { id: user.id },
        data: {
          total_bet: new Decimal(user.total_bet ?? 0).add(amount),
          balance: currentBalance.sub(amount),
        },
      });

      // Market volumes after including this bet
      const v1_after = team_id === t1 ? v1_before.add(amount) : v1_before;
      const v2_after = team_id === t2 ? v2_before.add(amount) : v2_before;

      // Post-bet odds (market moves because of this bet)
      const { o1: postO1, o2: postO2 } = computeOddsFromVolumes(
        v1_after,
        v2_after,
      );

      // Update match odds to reflect the new market state
      await tx.match_odds.update({
        where: { match_id_team_id: { match_id, team_id: t1 } },
        data: { odds: postO1, updated_at: new Date() },
      });

      await tx.match_odds.update({
        where: { match_id_team_id: { match_id, team_id: t2 } },
        data: { odds: postO2, updated_at: new Date() },
      });

      logDebug(reqId, "odds moved", {
        pre: { [t1]: preO1.toString(), [t2]: preO2.toString() },
        post: { [t1]: postO1.toString(), [t2]: postO2.toString() },
        vols_before: {
          [t1]: v1_before.toString(),
          [t2]: v2_before.toString(),
        },
        vols_after: {
          [t1]: v1_after.toString(),
          [t2]: v2_after.toString(),
        },
      });

      return createdBet;
    });

    // Successful response
    logStart(reqId, "POST /api/bets end", { ms: Date.now() - t0 });
    return NextResponse.json({ ...bet, reqId });
  } catch (error: unknown) {
    // Global error handler: log and map functional vs technical errors
    const message = error instanceof Error ? error.message : "Unknown error";
    logError(reqId, "unhandled error", { message });
    logStart(reqId, "POST /api/bets end (500)", { ms: Date.now() - t0 });

    const functionalMessages = new Set<string>([
      "Match not found",
      "Betting closed for this match",
      "Match is missing teams",
      "Selected team is not part of this match",
      "Insufficient balance",
      "User not found",
    ]);

    const isFunctional = functionalMessages.has(message);
    return NextResponse.json(
      { error: message, reqId },
      { status: isFunctional ? 400 : 500 },
    );
  }
}

/**
 * GET /api/bets
 *
 * Returns all bets for the authenticated user:
 * - Auth via Clerk.
 * - Lookup user by clerkid.
 * - Fetch bets with:
 *   - match info
 *   - teams (team1 / team2)
 *   - game info
 * - Ordered by placed_at DESC.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.users.findUnique({ where: { clerkid: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const bets = await prisma.bets.findMany({
      where: { user_id: user.id },
      include: {
        matches: {
          include: {
            teams_matches_team1_idToteams: true,
            teams_matches_team2_idToteams: true,
            games: true,
          },
        },
        teams: true,
      },
      orderBy: { placed_at: "desc" },
    });

    return NextResponse.json(bets);
  } catch (error: unknown) {
    console.error("Error in GET /api/bets:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

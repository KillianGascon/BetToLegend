import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

// ------------ Utils LOG ------------
function safeStringify(v: unknown, max = 800) {
  try { const s = JSON.stringify(v); return s.length > max ? s.slice(0, max) + `…(+${s.length - max} chars)` : s; }
  catch { return String(v); }
}
function typeOf(v: unknown) {
  if (v === null) return "null";
  const t = typeof v; if (t !== "object") return t;
  if (Array.isArray(v)) return "array"; return "object";
}
function fieldInfo(body: Record<string, unknown>, keys: string[]) {
  return keys.map(k => ({
    key: k,
    present: Object.prototype.hasOwnProperty.call(body, k),
    type: typeOf(body[k]),
    valuePreview: typeof body[k] === "string" || typeof body[k] === "number" ? String(body[k]) : undefined,
  }));
}
function logStart(reqId: string, msg: string, extra?: unknown) {
  console.log(`[bets][${reqId}] ${msg}${extra ? " " + safeStringify(extra) : ""}`);
}
function logDebug(reqId: string, msg: string, extra?: unknown) {
  console.debug(`[bets][${reqId}] ${msg}${extra ? " " + safeStringify(extra) : ""}`);
}
function logError(reqId: string, msg: string, extra?: unknown) {
  console.error(`[bets][${reqId}] ${msg}${extra ? " " + safeStringify(extra) : ""}`);
}

// ------------ Body Readers ------------
async function readBody(req: Request): Promise<{ body: Record<string, unknown>; ct: string }> {
  const ct = (req.headers.get("content-type") || "").toLowerCase();

  if (ct.includes("application/json")) {
    try { const body = (await req.json()) as Record<string, unknown>; return { body, ct }; }
    catch { return { body: {}, ct }; }
  }

  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const obj: Record<string, unknown> = {};
    fd.forEach((v, k) => { if (typeof v === "string") obj[k] = v.trim(); });
    return { body: obj, ct };
  }

  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const obj: Record<string, unknown> = {};
    for (const [k, v] of params.entries()) obj[k] = v.trim();
    return { body: obj, ct };
  }

  try { const body = (await req.json()) as Record<string, unknown>; return { body, ct: ct || "unknown" }; }
  catch { return { body: {}, ct: ct || "unknown" }; }
}

function normalizeKeys<T extends Record<string, unknown>>(raw: T) {
  const body: Record<string, unknown> = { ...raw };
  if (body.matchId !== undefined && body.match_id === undefined) body.match_id = body.matchId;
  if (body.teamId !== undefined && body.team_id === undefined) body.team_id = body.teamId;

  for (const k of Object.keys(body)) {
    const v = body[k];
    if (typeof v === "string") {
      const t = v.trim();
      body[k] = /^-?\d+(?:[.,]\d+)?$/.test(t) ? t.replace(",", ".") : t;
    }
  }
  return body;
}

// ------------ Zod fields ------------
const requiredDecimal = (name: string) =>
  z.any().transform((v, ctx) => {
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      ctx.addIssue({ code: "custom", message: `${name} is required` }); return z.NEVER;
    }
    try {
      const d = new Decimal(v as any);
      // @ts-ignore decimal-like
      if (!(d as any).isFinite || !(d as any).isFinite()) {
        ctx.addIssue({ code: "custom", message: `${name} must be finite` }); return z.NEVER;
      }
      return d;
    } catch {
      ctx.addIssue({ code: "custom", message: `${name} is not a valid decimal` }); return z.NEVER;
    }
  });

const BetBody = z.object({
  match_id: z.string().uuid({ message: "match_id must be a UUID" }),
  team_id: z.string().uuid({ message: "team_id must be a UUID" }),
  amount: requiredDecimal("amount").refine((d) => d.gt(0), { message: "amount must be > 0" }),
}).strict();

// ------------ Constants + helpers odds ------------
const MIN_ODDS = new Decimal(1.01);
const MAX_ODDS = new Decimal(99.99);
const PRIOR = new Decimal(5);     // a priori en "euros virtuels"
const OVERROUND = new Decimal(1); // 1 = pas de marge ; >1 pour marge (ex 1.05)
const TWO = new Decimal(2);

const round2 = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

async function advisoryLock(tx: any, key: string) {
  // évite les recalculs concurrents par match
  await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(hashtext($1))`, key);
}

async function currentVolumes(tx: any, matchId: string) {
  const grouped = await tx.bets.groupBy({
    by: ["team_id"],
    where: { match_id: matchId },
    _sum: { amount: true },
  });
  const map = new Map<string, Decimal>();
  for (const g of grouped) map.set(g.team_id, new Decimal(g._sum.amount ?? 0));
  return map;
}

/** Calcule cotes à partir de volumes (avec a priori + overround) */
function computeOddsFromVolumes(v1: Decimal, v2: Decimal) {
  // lissage
  const a1 = v1.add(PRIOR);
  const a2 = v2.add(PRIOR);
  const tot = a1.add(a2);
  if (tot.lte(0)) return { o1: TWO, o2: TWO }; // fallback

  const p1 = a1.div(tot);
  const p2 = a2.div(tot);

  let o1 = new Decimal(1).div(p1);
  let o2 = new Decimal(1).div(p2);

  // marge => diviser les cotes par OVERROUND
  if (!OVERROUND.eq(1)) {
    o1 = o1.div(OVERROUND);
    o2 = o2.div(OVERROUND);
  }

  o1 = round2(Decimal.max(MIN_ODDS, Decimal.min(MAX_ODDS, o1)));
  o2 = round2(Decimal.max(MIN_ODDS, Decimal.min(MAX_ODDS, o2)));
  return { o1, o2 };
}

// ------------ POST ------------
export async function POST(req: Request) {
  const reqId = (globalThis as any).crypto?.randomUUID?.() ?? `r${Date.now()}`;
  const t0 = Date.now();
  logStart(reqId, "POST /api/bets start", { method: req.method, url: (req as any).url });

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized", reqId }, { status: 401 });
    logDebug(reqId, "auth ok", { userId });

    const { body: raw, ct } = await readBody(req);
    logDebug(reqId, "content-type & raw body", { contentType: ct, rawPreview: fieldInfo(raw, ["match_id","team_id","amount","odds"]) });

    const body = normalizeKeys(raw);
    // on ignore toute clé odds envoyée par le client (schéma strict)
    if (Object.prototype.hasOwnProperty.call(body, "odds")) {
      logDebug(reqId, "client sent odds — ignored", { sentOdds: (body as any).odds });
      delete (body as any).odds;
    }
    logDebug(reqId, "normalized body", { fields: fieldInfo(body, ["match_id","team_id","amount"]) });

    const parsed = BetBody.safeParse(body);
    if (!parsed.success) {
      logError(reqId, "validation failed", { issues: parsed.error.issues });
      const flat = parsed.error.flatten();
      return NextResponse.json(
        {
          error: "Validation failed",
          fieldErrors: flat.fieldErrors,
          formErrors: flat.formErrors,
          receivedTypes: Object.fromEntries(["match_id","team_id","amount"].map(k => [k, typeOf((body as any)[k])])),
          receivedValues: Object.fromEntries(["match_id","team_id","amount"].map(k => [k, (body as any)[k] ?? null])),
          reqId,
        },
        { status: 400 }
      );
    }

    const { match_id, team_id, amount } = parsed.data; // amount: Decimal

    // --- Transaction callback pour atomicité ---
    const bet = await prisma.$transaction(async (tx) => {
      await advisoryLock(tx, match_id);

      // Match + team ids
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
        logDebug(reqId, "betting closed", { match_id, status: match.status });
        throw new Error("Betting closed for this match");
      }
      const t1 = match.team1_id;
      const t2 = match.team2_id;
      if (!t1 || !t2) throw new Error("Match is missing teams");
      if (team_id !== t1 && team_id !== t2) {
        logError(reqId, "team not in match", { team_id, valid: [t1, t2] });
        throw new Error("Selected team is not part of this match");
      }

      // Utilisateur
      const user = await tx.users.findUnique({ where: { clerkid: (await auth()).userId! } });
      if (!user) {
        logError(reqId, "user not found");
        throw new Error("User not found");
      }
      const currentBalance = new Decimal(user.balance ?? 0);
      if (currentBalance.lt(amount)) {
        logDebug(reqId, "insufficient balance", { required: amount.toString(), balance: currentBalance.toString() });
        throw new Error("Insufficient balance");
      }

      // Volumes *avant* ce pari
      const vols = await currentVolumes(tx, match_id);
      const v1_before = vols.get(t1) ?? new Decimal(0);
      const v2_before = vols.get(t2) ?? new Decimal(0);

      // Cotes pré-pari (persistées si absentes)
      let { o1: preO1, o2: preO2 } = computeOddsFromVolumes(v1_before, v2_before);

      // Upsert pre-odds si pas présents ou à 0
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

      const oddsForBet = team_id === t1 ? preO1 : preO2;
      const potential_payout = amount.mul(oddsForBet);

      // Crée le bet avec la cote pré-pari
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

      // Débiter l'utilisateur
      await tx.users.update({
        where: { id: user.id },
        data: {
          total_bet: new Decimal(user.total_bet ?? 0).add(amount),
          balance: currentBalance.sub(amount),
        },
      });

      // Volumes *après* ce pari (ajout virtuel sur l'équipe choisie)
      const v1_after = team_id === t1 ? v1_before.add(amount) : v1_before;
      const v2_after = team_id === t2 ? v2_before.add(amount) : v2_before;

      // Cotes post-pari → update
      const { o1: postO1, o2: postO2 } = computeOddsFromVolumes(v1_after, v2_after);
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
        vols_before: { [t1]: v1_before.toString(), [t2]: v2_before.toString() },
        vols_after: { [t1]: v1_after.toString(), [t2]: v2_after.toString() },
      });

      return createdBet;
    });

    logStart(reqId, "POST /api/bets end", { ms: Date.now() - t0 });
    return NextResponse.json({ ...bet, reqId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError(reqId, "unhandled error", { message });
    logStart(reqId, "POST /api/bets end (500)", { ms: Date.now() - t0 });
    // harmonise les erreurs fonctionnelles en 400 (solde, team, etc.)
    const isFunctional = [
      "Match not found",
      "Betting closed for this match",
      "Match is missing teams",
      "Selected team is not part of this match",
      "Insufficient balance",
      "User not found",
    ].includes(message);
    return NextResponse.json({ error: message, reqId }, { status: isFunctional ? 400 : 500 });
  }
}

// ------------ GET (inchangé) ------------
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.users.findUnique({ where: { clerkid: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

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
    console.error("❌ Error in GET /api/bets:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

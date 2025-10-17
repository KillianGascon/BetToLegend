import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * 🎯 POST /api/bets
 * Create a new bet record in the database.
 */
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse JSON body from the incoming request
        const body = await req.json();
        const {
            match_id,
            team_id,
            amount,
            odds,
        } = body;

        // Validate required fields
        if (!match_id || !team_id || !amount || !odds) {
            return NextResponse.json({ 
                error: "Missing required fields: match_id, team_id, amount, odds" 
            }, { status: 400 });
        }

        // Get user from database
        const user = await prisma.users.findUnique({
            where: { clerkid: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user has sufficient balance
        if (user.balance && user.balance < amount) {
            return NextResponse.json({ 
                error: "Insufficient balance" 
            }, { status: 400 });
        }

        // Calculate potential payout
        const potential_payout = Number(amount) * Number(odds);

        // Create the new bet using Prisma ORM
        const bet = await prisma.bets.create({
            data: {
                user_id: user.id,
                match_id: match_id,
                team_id: team_id,
                amount: amount,
                odds: odds,
                potential_payout: potential_payout,
                status: "pending",
            },
        });

        // Update user's total bet amount
        await prisma.users.update({
            where: { id: user.id },
            data: {
                total_bet: (user.total_bet || 0) + Number(amount),
                balance: (user.balance || 0) - Number(amount),
            },
        });

        // Return the newly created bet as JSON
        return NextResponse.json(bet);
    } catch (error: unknown) {
        // Log the error for debugging
        console.error("❌ Error in POST /api/bets:", error);

        // Return appropriate error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 📋 GET /api/bets
 * Retrieve a list of all bets for the authenticated user.
 */
export async function GET() {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user from database
        const user = await prisma.users.findUnique({
            where: { clerkid: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch all bets for the user with related data
        const bets = await prisma.bets.findMany({
            where: { user_id: user.id },
            include: {
                matches: {
                    include: {
                        teams_matches_team1_idToteams: true,
                        teams_matches_team2_idToteams: true,
                        games: true,
                    }
                },
                teams: true,
            },
            orderBy: { placed_at: "desc" },
        });

        // Return the list of bets as JSON
        return NextResponse.json(bets);
    } catch (error: unknown) {
        // Log error for debugging
        console.error("❌ Error in GET /api/bets:", error);

        // Return an appropriate error response
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

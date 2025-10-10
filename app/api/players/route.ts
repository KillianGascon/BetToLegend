import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * 👤 POST /api/players
 * Create a new player record with optional avatar upload.
 */
export async function POST(req: Request) {
    try {
        console.log("📥 Incoming POST request to /api/players");

        // Parse incoming multipart/form-data request
        const formData = await req.formData();
        console.log("✅ FormData successfully parsed");

        // Extract form fields
        const username = formData.get("username") as string | null;
        const real_name = formData.get("real_name") as string | null;
        const country = (formData.get("country") as string) || "FR";
        const age = formData.get("age") ? Number(formData.get("age")) : null;
        const role = formData.get("role") as string | null;
        const twitch_followers = formData.get("twitch_followers")
            ? Number(formData.get("twitch_followers"))
            : 0;
        const youtube_subscribers = formData.get("youtube_subscribers")
            ? Number(formData.get("youtube_subscribers"))
            : 0;

        const file = formData.get("file") as File | null;
        console.log("📄 Fields received:", { username, real_name, country, age, file });

        // Validate required field
        if (!username) {
            console.warn("⚠️ Missing username field");
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        let avatar_url: string | undefined = undefined;

        // 📁 Handle avatar upload (same logic as Teams)
        if (file) {
            console.log("⬆️ Uploading avatar file:", file.name);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure the upload directory exists
            const uploadDir = path.join(process.cwd(), "public", "uploads", "avatar");
            await fs.mkdir(uploadDir, { recursive: true });

            // Generate a unique file name
            const ext = path.extname(file.name) || ".png";
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
            const filePath = path.join(uploadDir, uniqueName);

            // Save the file to disk
            await fs.writeFile(filePath, buffer);
            console.log("✅ Avatar saved successfully:", filePath);

            // Store the public URL
            avatar_url = `/uploads/avatar/${uniqueName}`;
        } else {
            console.log("ℹ️ No file uploaded, skipping avatar_url");
        }

        // 🗄️ Create player in the database
        console.log("🗄️ Creating player record in database...");
        const player = await prisma.players.create({
            data: {
                username,
                real_name,
                country,
                age,
                role,
                twitch_followers,
                youtube_subscribers,
                avatar_url,
            },
        });

        console.log("✅ Player created successfully:", player);
        return NextResponse.json(player);
    } catch (error: unknown) {
        console.error("❌ Error in POST /api/players:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 📋 GET /api/players
 * Retrieve a list of all players, ordered by creation date (newest first).
 */
export async function GET() {
    try {
        console.log("📥 Incoming GET request to /api/players");

        // Fetch all players from the database
        const players = await prisma.players.findMany({
            orderBy: { created_at: "desc" },
        });

        console.log(`✅ Successfully retrieved ${players.length} players`);
        return NextResponse.json(players);
    } catch (error: unknown) {
        console.error("❌ Error in GET /api/players:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

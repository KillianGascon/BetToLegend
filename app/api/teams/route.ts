import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto"; // Used to generate unique filenames

/**
 * 🧩 POST /api/teams
 * Create a new team and optionally upload a logo file.
 */
export async function POST(req: Request) {
    try {
        console.log("📥 Incoming POST request to /api/teams");

        const formData = await req.formData();
        console.log("✅ FormData successfully parsed");

        const name = formData.get("name") as string | null;
        const tag = formData.get("tag") as string | null;
        const country = formData.get("country") as string | null;
        const founded_year = formData.get("founded_year")
            ? Number(formData.get("founded_year"))
            : null;

        const file = formData.get("file") as File | null;
        console.log("📄 Received fields:", { name, tag, country, founded_year, file });

        // Validate required fields
        if (!name || !tag) {
            console.warn("⚠️ Missing required fields: name or tag");
            return NextResponse.json(
                { error: "Name and tag are required" },
                { status: 400 }
            );
        }

        let logo_url: string | undefined = undefined;

        // Handle file upload (if provided)
        if (file) {
            console.log("⬆️ Saving uploaded logo file locally:", file.name);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(uploadDir, { recursive: true });

            // Generate a unique filename while keeping original extension
            const ext = path.extname(file.name) || ".png";
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
            const filePath = path.join(uploadDir, uniqueName);

            await fs.writeFile(filePath, buffer);
            console.log("✅ File successfully saved:", filePath);

            logo_url = `/uploads/${uniqueName}`;
        } else {
            console.log("ℹ️ No file received; logo_url will be empty");
        }

        console.log("🗄️ Creating new team in database...");
        const team = await prisma.teams.create({
            data: {
                name,
                tag,
                country: country ?? undefined,
                founded_year: founded_year ?? undefined,
                logo_url,
            },
        });
        console.log("✅ Team created successfully:", team);

        return NextResponse.json(team);
    } catch (error: unknown) {
        console.error("❌ Error in POST /api/teams:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 📋 GET /api/teams
 * Retrieve all teams.
 */
export async function GET() {
    try {
        console.log("📥 Incoming GET request to /api/teams");

        const teams = await prisma.teams.findMany();
        console.log("✅ Teams retrieved successfully:", teams.length);

        return NextResponse.json(teams);
    } catch (error: unknown) {
        console.error("❌ Error in GET /api/teams:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

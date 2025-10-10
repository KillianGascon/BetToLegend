import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * 🧹 Helper – Deletes a local file if it exists.
 */
async function deleteLocalFile(filePath: string) {
    try {
        const absolutePath = path.join(process.cwd(), "public", filePath);
        await fs.unlink(absolutePath);
        console.log("🧹 File deleted:", absolutePath);
    } catch {
        console.warn("⚠️ File not found or already deleted:", filePath);
    }
}

/**
 * 💾 Helper – Saves a new uploaded file locally and returns its public path.
 */
async function saveLocalFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".png";
    const base = path.basename(file.name, ext);
    const safeBase = base.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
    const uniqueName = `${Date.now()}_${crypto.randomUUID()}_${safeBase}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    await fs.writeFile(filePath, buffer);
    console.log("✅ New file saved:", filePath);

    return `/uploads/${uniqueName}`;
}

/**
 * 🔹 GET /api/teams/[id]
 * Retrieve a single team by ID.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const team = await prisma.teams.findUnique({
            where: { id: params.id },
        });

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        return NextResponse.json(team);
    } catch (error: unknown) {
        console.error("❌ Error in GET /api/teams/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🔹 PUT /api/teams/[id]
 * Update a team, optionally replacing its logo.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string | null;
        const tag = formData.get("tag") as string | null;
        const country = formData.get("country") as string | null;
        const founded_year = formData.get("founded_year")
            ? Number(formData.get("founded_year"))
            : null;

        const file = formData.get("file") as File | null;

        // Find existing team before update
        const existingTeam = await prisma.teams.findUnique({
            where: { id: params.id },
        });

        if (!existingTeam) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        let logo_url = existingTeam.logo_url;

        // If a new file is uploaded, delete the old one and save the new file
        if (file) {
            console.log("🔄 New file received, replacing old one...");
            if (existingTeam.logo_url) {
                await deleteLocalFile(existingTeam.logo_url);
            }
            logo_url = await saveLocalFile(file);
        }

        // Update team record in the database
        const updatedTeam = await prisma.teams.update({
            where: { id: params.id },
            data: {
                name: name ?? undefined,
                tag: tag ?? undefined,
                country: country ?? undefined,
                founded_year: founded_year ?? undefined,
                logo_url,
            },
        });

        console.log("✅ Team updated successfully:", updatedTeam);
        return NextResponse.json(updatedTeam);
    } catch (error: unknown) {
        console.error("❌ Error in PUT /api/teams/[id]:", error);
        if (error instanceof Error) {
            if ((error as any).code === "P2002") {
                return NextResponse.json(
                    { error: "A team with this tag already exists." },
                    { status: 400 }
                );
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🔹 DELETE /api/teams/[id]
 * Delete a team and its associated local logo file if present.
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const team = await prisma.teams.findUnique({
            where: { id: params.id },
        });

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        // Delete logo file if one exists
        if (team.logo_url) {
            await deleteLocalFile(team.logo_url);
        }

        // Remove team from database
        await prisma.teams.delete({
            where: { id: params.id },
        });

        console.log("🗑️ Team deleted along with its logo:", team.logo_url);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("❌ Error in DELETE /api/teams/[id]:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

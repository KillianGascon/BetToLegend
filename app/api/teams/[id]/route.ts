import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// Helper pour supprimer un fichier local s’il existe
async function deleteLocalFile(filePath: string) {
    try {
        const absolutePath = path.join(process.cwd(), "public", filePath);
        await fs.unlink(absolutePath);
        console.log("🧹 Fichier supprimé :", absolutePath);
    } catch (err) {
        console.warn("⚠️ Fichier introuvable ou déjà supprimé :", filePath);
    }
}

// Helper pour sauvegarder un nouveau fichier et renvoyer son chemin
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
    console.log("✅ Nouveau fichier enregistré :", filePath);

    return `/uploads/${uniqueName}`;
}

// 🔹 READ one team
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const team = await prisma.teams.findUnique({
            where: { id: params.id },
        });

        if (!team) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(team);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

// 🔹 UPDATE team (avec modification d'image)
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string | null;
        const tag = formData.get("tag") as string | null;
        const country = formData.get("country") as string | null;
        const founded_year = formData.get("founded_year")
            ? Number(formData.get("founded_year"))
            : null;

        const file = formData.get("file") as File | null;

        const existingTeam = await prisma.teams.findUnique({
            where: { id: params.id },
        });

        if (!existingTeam) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        let logo_url = existingTeam.logo_url;

        // Si un nouveau fichier est envoyé, on supprime l’ancien et on sauvegarde le nouveau
        if (file) {
            console.log("🔄 Nouveau fichier reçu, remplacement de l'ancien...");
            if (existingTeam.logo_url) {
                await deleteLocalFile(existingTeam.logo_url);
            }
            logo_url = await saveLocalFile(file);
        }

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

        console.log("✅ Équipe mise à jour :", updatedTeam);
        return NextResponse.json(updatedTeam);
    } catch (error: unknown) {
        console.error("❌ Erreur PUT /api/teams :", error);
        if (error instanceof Error) {
            if ((error as any).code === "P2002") {
                return NextResponse.json(
                    { error: "Une équipe avec ce tag existe déjà." },
                    { status: 400 }
                );
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

// 🔹 DELETE team (avec suppression du fichier)
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const team = await prisma.teams.findUnique({
            where: { id: params.id },
        });

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        // Supprimer le fichier local si présent
        if (team.logo_url) {
            await deleteLocalFile(team.logo_url);
        }

        await prisma.teams.delete({
            where: { id: params.id },
        });

        console.log("🗑️ Équipe supprimée avec son image :", team.logo_url);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("❌ Erreur DELETE /api/teams :", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

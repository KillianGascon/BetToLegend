import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto"; // pour générer un nom unique

export async function POST(req: Request) {
    try {
        console.log("📥 Requête POST /api/teams reçue");

        const formData = await req.formData();
        console.log("✅ FormData récupéré");

        const name = formData.get("name") as string | null;
        const tag = formData.get("tag") as string | null;
        const country = formData.get("country") as string | null;
        const founded_year = formData.get("founded_year")
            ? Number(formData.get("founded_year"))
            : null;

        const file = formData.get("file") as File | null;
        console.log("📄 Champs reçus :", { name, tag, country, founded_year, file });

        if (!name || !tag) {
            console.warn("⚠️ name ou tag manquant");
            return NextResponse.json(
                { error: "Name and tag required" },
                { status: 400 }
            );
        }

        let logo_url: string | undefined = undefined;

        if (file) {
            console.log("⬆️ Sauvegarde du fichier localement :", file.name);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(uploadDir, { recursive: true });

            // Génération d’un nom unique (UUID-like) + conservation de l’extension
            const ext = path.extname(file.name) || ".png";
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
            const filePath = path.join(uploadDir, uniqueName);

            await fs.writeFile(filePath, buffer);
            console.log("✅ Fichier sauvegardé :", filePath);

            logo_url = `/uploads/${uniqueName}`;
        } else {
            console.log("ℹ️ Aucun fichier reçu, pas de logo_url");
        }

        console.log("🗄️ Création team en DB...");
        const team = await prisma.teams.create({
            data: {
                name,
                tag,
                country: country ?? undefined,
                founded_year: founded_year ?? undefined,
                logo_url,
            },
        });
        console.log("✅ Team créée :", team);

        return NextResponse.json(team);
    } catch (error: unknown) {
        console.error("❌ Erreur POST /api/teams :", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        console.log("📥 GET /api/teams");
        const teams = await prisma.teams.findMany();
        console.log("✅ Teams récupérées :", teams.length);
        return NextResponse.json(teams);
    } catch (error: unknown) {
        console.error("❌ Erreur GET /api/teams :", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

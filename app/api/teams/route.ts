import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Storacha SDK
import { UploadAPI } from "@storacha/upload-api";
import { Agent } from "@storacha/access/agent";
import { StoreConf } from "@storacha/access/stores/store-conf";
import { generate } from "@ucanto/principal/ed25519";

async function uploadToStoracha(file: File): Promise<string> {
    // store conf pour garder l’agent
    const store = new StoreConf({ profile: "teams-backend" });

    let agent;
    if (await store.exists()) {
        const data = await store.load();
        agent = Agent.from(data, { store });
    } else {
        const principal = await generate();
        agent = await Agent.create(
            { meta: { name: "teams-backend" }, principal },
            { store }
        );
    }

    // créer un espace si besoin
    const space = await agent.createSpace();

    // uploader avec l’API
    const uploader = new UploadAPI({ agent });
    const res = await uploader.upload(file, { space: space.did });

    // Retourne un lien IPFS via la gateway Storacha
    return `https://${res.cid}.ipfs.storacha.network/${file.name}`;
}

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
            console.log("⬆️ Upload du fichier vers Storacha :", file.name);
            logo_url = await uploadToStoracha(file);
            console.log("✅ Fichier uploadé sur Storacha :", logo_url);
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

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// READ one team
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

// UPDATE team
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { name, tag, country, logo_url, founded_year } = await req.json();

        const team = await prisma.teams.update({
            where: { id: params.id },
            data: { name, tag, country, logo_url, founded_year },
        });

        return NextResponse.json(team);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

// DELETE team
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.teams.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    // 👇 ici on await car TS pense que c'est une Promise
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ role: "guest" });
    }

    const user = await prisma.users.findUnique({
        where: { clerkid: userId },
    });

    return NextResponse.json({ role: user?.role ?? "user" });
}

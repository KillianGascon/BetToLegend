import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    // Clerk webhook signing secret (from your .env)
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!SIGNING_SECRET) {
        return new NextResponse("Clerk webhook secret not set", { status: 500 });
    }

    // Get raw request body (important for signature verification)
    const payload = await req.text();

    // Extract Svix headers added by Clerk
    const headersList = await headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Missing svix headers", { status: 400 });
    }

    // Initialize Svix webhook verifier
    const wh = new Webhook(SIGNING_SECRET);

    let evt: any;
    try {
        // Verify payload signature to make sure it's from Clerk
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return new NextResponse("Invalid signature", { status: 400 });
    }

    // Extract event type and data from Clerk
    const { type, data } = evt;

    // --- Handle user.created ---
    if (type === "user.created") {
        const { id: clerkid, email_addresses, first_name, last_name } = data;
        try {
            await prisma.users.create({
                data: {
                    clerkid, // store Clerk ID in your "clerkId" column
                    email: email_addresses[0]?.email_address,
                    username: `${first_name ?? ""} ${last_name ?? ""}`.trim() || clerkid,
                },
            });
            console.log("✅ User created in DB with clerkId:", clerkid);
        } catch (error) {
            console.error("DB insert error:", error);
        }
    }

    // --- Handle user.updated ---
    if (type === "user.updated") {
        const { id: clerkid, email_addresses, first_name, last_name } = data;
        try {
            await prisma.users.update({
                where: { clerkid }, // find the user by clerkId
                data: {
                    email: email_addresses[0]?.email_address,
                    username: `${first_name ?? ""} ${last_name ?? ""}`.trim() || clerkid,
                },
            });
            console.log("✏️ User updated in DB with clerkId:", clerkid);
        } catch (error) {
            console.error("DB update error:", error);
        }
    }

    // --- Handle user.deleted ---
    if (type === "user.deleted") {
        try {
            await prisma.users.delete({
                where: { clerkid: data.id }, // delete user by clerkId
            });
            console.log("🗑️ User deleted from DB with clerkId:", data.id);
        } catch (error) {
            console.error("DB delete error:", error);
        }
    }

    return new NextResponse("Webhook received", { status: 200 });
}
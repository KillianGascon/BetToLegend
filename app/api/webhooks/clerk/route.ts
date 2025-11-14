import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Base schema for any Clerk event:
 * - type: event type string (e.g. "user.created").
 * - data: opaque payload, validated later per event.
 */
const ClerkBaseEventSchema = z.object({
  type: z.string(),
  data: z.unknown(),
});

type ClerkBaseEvent = z.infer<typeof ClerkBaseEventSchema>;

/**
 * Schema for user payloads on user.created / user.updated.
 * - id: Clerk user id.
 * - email_addresses: array of email objects (validated as emails).
 * - first_name / last_name: optional/nullable strings.
 */
const ClerkUserSchema = z.object({
  id: z.string(),
  email_addresses: z
    .array(
      z.object({
        email_address: z.string().email(),
      }),
    )
    .default([]),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
});

type ClerkUser = z.infer<typeof ClerkUserSchema>;

/**
 * Schema for user.deleted payloads:
 * - Only `id` is needed to identify the user.
 */
const ClerkUserDeletedSchema = z.object({
  id: z.string(),
});

/**
 * POST /api/webhooks/clerk (or similar)
 *
 * Handles Clerk webhooks securely via Svix:
 * 1. Read CLERK_WEBHOOK_SECRET from env.
 * 2. Read raw body (req.text()) for signature verification.
 * 3. Extract Svix headers (svix-id, svix-timestamp, svix-signature).
 * 4. Verify signature using Svix Webhook.
 * 5. Validate generic event shape with ClerkBaseEventSchema.
 * 6. Branch logic on event type:
 *    - user.created: insert user into DB.
 *    - user.updated: update user in DB.
 *    - user.deleted: delete user from DB.
 * 7. Always return 200 when the webhook is processed
 *    (even if DB operations fail, they are logged but not re-thrown).
 */
export async function POST(req: Request) {
  // 1. Get Clerk webhook signing secret from environment
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error("Clerk webhook secret not set");
    return new NextResponse("Clerk webhook secret not set", { status: 500 });
  }

  // 2. Get raw request body as text (required by Svix for verification)
  const payload = await req.text();

  // 3. Extract Svix headers added by Clerk
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  // 4. Initialize Svix verifier with Clerk signing secret
  const wh = new Webhook(SIGNING_SECRET);

  let evtUnknown: unknown;

  try {
    // Verify the request is genuinely from Clerk
    evtUnknown = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // 5. Validate generic event structure (type + data) with Zod
  let evt: ClerkBaseEvent;
  try {
    evt = ClerkBaseEventSchema.parse(evtUnknown);
  } catch (err) {
    console.error("Invalid webhook event shape:", err);
    return new NextResponse("Invalid event payload", { status: 400 });
  }

  const { type } = evt;

  /**
   * Handle user.created and user.updated.
   * - Parse data as ClerkUser.
   * - Compute primaryEmail and username.
   * - user.created → create user in DB.
   * - user.updated → update user in DB.
   *
   * Any DB errors are logged but do NOT fail the webhook response.
   */
  if (type === "user.created" || type === "user.updated") {
    try {
      const data = ClerkUserSchema.parse(evt.data) as ClerkUser;

      const { id: clerkid, email_addresses, first_name, last_name } = data;
      const primaryEmail = email_addresses[0]?.email_address;
      const username =
        `${first_name ?? ""} ${last_name ?? ""}`.trim() || clerkid;

      if (type === "user.created") {
        try {
          await prisma.users.create({
            data: {
              clerkid,
              email: primaryEmail,
              username,
            },
          });
          console.log("User created in DB with clerkId:", clerkid);
        } catch (error) {
          console.error("DB insert error:", error);
        }
      } else {
        try {
          await prisma.users.update({
            where: { clerkid },
            data: {
              email: primaryEmail,
              username,
            },
          });
          console.log("User updated in DB with clerkId:", clerkid);
        } catch (error) {
          console.error("DB update error:", error);
        }
      }
    } catch (err) {
      // If user payload is malformed, log but don't reject the webhook
      console.error("Invalid user payload for event", type, err);
    }
  }

  /**
   * Handle user.deleted.
   * - Parse data with ClerkUserDeletedSchema.
   * - Delete user by clerkid in local DB.
   */
  if (type === "user.deleted") {
    try {
      const data = ClerkUserDeletedSchema.parse(evt.data);
      await prisma.users.delete({
        where: { clerkid: data.id },
      });
      console.log("User deleted from DB with clerkId:", data.id);
    } catch (err) {
      console.error("DB delete or payload error on user.deleted:", err);
    }
  }

  // Always acknowledge the webhook; failures are handled via logging
  return new NextResponse("Webhook received", { status: 200 });
}
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/user
 *
 * Returns a lightweight snapshot of the current authenticated user:
 * - If not authenticated → role: "guest"
 * - If authenticated → role, balance (as number), username, email
 *
 * This endpoint is useful for:
 * - Frontend role-based UI (admin/user/guest).
 * - Displaying wallet/balance information.
 * - Prefilling user info client-side.
 */
export async function GET() {
  // Ask Clerk for the current session
  const { userId } = await auth();

  // No authenticated user → treat as guest
  if (!userId) {
    return NextResponse.json({ role: "guest" });
  }

  // Look up the corresponding user in your own DB
  const user = await prisma.users.findUnique({
    where: { clerkid: userId },
  });

  // Normalize the response:
  // - role: default "user" if not set
  // - balance: cast Decimal/BigInt/etc. → number, default 0
  // - username/email: may be undefined if not present
  return NextResponse.json({
    role: user?.role ?? "user",
    balance: user?.balance ? Number(user.balance) : 0,
    username: user?.username,
    email: user?.email,
  });
}

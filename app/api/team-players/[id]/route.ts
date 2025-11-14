import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🧩 PUT /api/team-players/[id]
 * Update a player–team relationship (position, salary, join_date, is_active).
 */
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Extract route parameter (id)
        const { id } = await context.params;
        const data = await req.json();

        console.log("📝 Incoming PUT /api/team-players request:", { id, data });

        // Parse join_date safely, converting empty strings to null
        const parsedDate =
            data.join_date && data.join_date !== "" ? new Date(data.join_date) : null;

        // Update the player–team relationship record
        const updated = await prisma.team_players.update({
            where: { id },
            data: {
                position: data.position ?? undefined,
                salary: data.salary ? Number(data.salary) : undefined,
                join_date: parsedDate,
                is_active:
                    typeof data.is_active === "boolean" ? data.is_active : undefined,
            },
        });

        console.log("✅ Player–Team relation updated successfully:", updated.id);
        return NextResponse.json(updated);
    } catch (error: unknown) {
        console.error("❌ Error in PUT /api/team-players:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

/**
 * 🗑️ DELETE /api/team-players/[id]
 * Remove a player from a team.
 */
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Extract route parameter (id)
        const { id } = await context.params;
        console.log("🗑️ Deleting player–team relation with ID:", id);

        // Delete the relationship from the database
        await prisma.team_players.delete({ where: { id } });

        console.log("✅ Player successfully removed from team:", id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("❌ Error in DELETE /api/team-players:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

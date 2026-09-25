import { NextRequest, NextResponse } from "next/server";
import { toggleActionItem } from "@/lib/queries";

export const dynamic = "force-dynamic";

// PATCH /api/action-items/:id — flips the done flag and persists it.
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updated = await toggleActionItem(id);
    if (!updated) {
      return NextResponse.json({ error: "Action item not found" }, { status: 404 });
    }
    return NextResponse.json({ actionItem: updated });
  } catch (err) {
    console.error("PATCH /api/action-items/[id]", err);
    return NextResponse.json({ error: "Failed to update action item" }, { status: 500 });
  }
}

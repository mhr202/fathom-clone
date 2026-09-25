import { NextRequest, NextResponse } from "next/server";
import { getMeetingBySlug, addHighlight } from "@/lib/queries";

export const dynamic = "force-dynamic";

// POST /api/meetings/:slug/highlights  { timestamp, text, by }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const meeting = await getMeetingBySlug(slug);
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const body = await req.json();
    const text = (body?.text ?? "").toString().trim();
    const timestamp = Number(body?.timestamp ?? 0);
    const by = (body?.by ?? "Dev (you)").toString();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const highlight = await addHighlight({
      meetingId: meeting.id,
      timestamp: Math.max(0, Math.floor(timestamp)),
      text,
      by,
    });

    return NextResponse.json({ highlight }, { status: 201 });
  } catch (err) {
    console.error("POST /api/meetings/[slug]/highlights", err);
    return NextResponse.json({ error: "Failed to add highlight" }, { status: 500 });
  }
}

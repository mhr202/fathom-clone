import { NextRequest, NextResponse } from "next/server";
import { getMeetingBySlug } from "@/lib/queries";
import { toMeetingDTO } from "@/lib/dto";

export const dynamic = "force-dynamic";

// GET /api/meetings/:slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const meeting = await getMeetingBySlug(slug);
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    return NextResponse.json({ meeting: toMeetingDTO(meeting) });
  } catch (err) {
    console.error("GET /api/meetings/[slug]", err);
    return NextResponse.json({ error: "Failed to load meeting" }, { status: 500 });
  }
}

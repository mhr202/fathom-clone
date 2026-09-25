import { NextRequest, NextResponse } from "next/server";
import { listMeetings, createMeeting } from "@/lib/queries";
import { toMeetingDTO } from "@/lib/dto";

export const dynamic = "force-dynamic";

// GET /api/meetings?q=…&category=…
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  try {
    const meetings = await listMeetings({ q, category });
    return NextResponse.json({ meetings: meetings.map(toMeetingDTO) });
  } catch (err) {
    console.error("GET /api/meetings", err);
    return NextResponse.json({ error: "Failed to load meetings" }, { status: 500 });
  }
}

// POST /api/meetings  { title, platform, category? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = (body?.title ?? "").toString().trim();
    const platform = (body?.platform ?? "Zoom").toString();
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    const meeting = await createMeeting({ title, platform, category: body?.category });
    return NextResponse.json({ meeting: toMeetingDTO(meeting) }, { status: 201 });
  } catch (err) {
    console.error("POST /api/meetings", err);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}

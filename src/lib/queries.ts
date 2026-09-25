import { Prisma } from "@prisma/client";
import { prisma } from "./db";

// A meeting with all its relations — the shape the UI consumes.
const meetingInclude = {
  participants: true,
  actionItems: { orderBy: { createdAt: "asc" } },
  highlights: { orderBy: { timestamp: "asc" } },
  transcript: { orderBy: { start: "asc" } },
} satisfies Prisma.MeetingInclude;

export type MeetingWithRelations = Prisma.MeetingGetPayload<{
  include: typeof meetingInclude;
}>;

/**
 * List meetings, optionally filtered by full-text-ish search and category.
 * Filtering happens in Postgres, not in JS.
 */
export async function listMeetings(opts: { q?: string; category?: string } = {}) {
  const { q, category } = opts;

  const where: Prisma.MeetingWhereInput = {};
  if (category && category !== "All") where.category = category;

  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { category: { contains: term, mode: "insensitive" } },
      { keywords: { has: term.toLowerCase() } },
      { summary: { hasSome: [term] } },
      { participants: { some: { name: { contains: term, mode: "insensitive" } } } },
      { transcript: { some: { text: { contains: term, mode: "insensitive" } } } },
    ];
  }

  return prisma.meeting.findMany({
    where,
    include: meetingInclude,
    orderBy: { date: "desc" },
  });
}

export async function getMeetingBySlug(slug: string) {
  return prisma.meeting.findUnique({
    where: { slug },
    include: meetingInclude,
  });
}

export async function getCategories() {
  const rows = await prisma.meeting.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

export async function getStats() {
  const [meetings, totalActions, openActions, durations] = await Promise.all([
    prisma.meeting.count(),
    prisma.actionItem.count(),
    prisma.actionItem.count({ where: { done: false } }),
    prisma.meeting.aggregate({ _sum: { durationSec: true } }),
  ]);
  return {
    meetings,
    totalActions,
    openActions,
    hours: Math.round((durations._sum.durationSec ?? 0) / 3600),
  };
}

export async function getSharedHighlight(slug: string, highlightId: string) {
  const meeting = await getMeetingBySlug(slug);
  if (!meeting) return null;
  const highlight = meeting.highlights.find((h) => h.id === highlightId);
  if (!highlight) return null;
  return { meeting, highlight };
}

/** Every action item across every meeting — the cross-meeting accountability view. */
export async function listActionItems() {
  return prisma.actionItem.findMany({
    include: { meeting: { select: { slug: true, title: true, date: true } } },
    orderBy: [{ done: "asc" }, { createdAt: "asc" }],
  });
}

export async function toggleActionItem(id: string) {
  const current = await prisma.actionItem.findUnique({ where: { id } });
  if (!current) return null;
  return prisma.actionItem.update({
    where: { id },
    data: { done: !current.done },
  });
}

export async function addHighlight(input: {
  meetingId: string;
  timestamp: number;
  text: string;
  by: string;
}) {
  return prisma.highlight.create({ data: input });
}

export async function createMeeting(input: {
  title: string;
  platform: string;
  category?: string;
}) {
  const base = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "meeting";
  // Ensure a unique slug.
  let slug = base;
  let n = 1;
  while (await prisma.meeting.findUnique({ where: { slug } })) {
    slug = `${base}-${++n}`;
  }

  return prisma.meeting.create({
    data: {
      slug,
      title: input.title,
      date: new Date(),
      durationSec: 0,
      platform: input.platform,
      category: input.category ?? "Team",
      sentiment: "neutral",
      keywords: [],
      summary: [],
    },
    include: meetingInclude,
  });
}

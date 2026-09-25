import type { MeetingWithRelations } from "./queries";

// JSON-safe shapes shared by the API responses and the server components,
// so the client always sees one consistent contract.

export type ParticipantDTO = {
  id: string;
  name: string;
  initials: string;
  role: string | null;
  color: string;
};

export type ActionItemDTO = {
  id: string;
  task: string;
  owner: string;
  due: string | null;
  done: boolean;
};

export type HighlightDTO = {
  id: string;
  timestamp: number;
  text: string;
  by: string;
};

export type SegmentDTO = {
  id: string;
  speaker: string;
  start: number;
  text: string;
};

export type MeetingDTO = {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO
  durationSec: number;
  platform: string;
  category: string;
  sentiment: string;
  keywords: string[];
  summary: string[];
  participants: ParticipantDTO[];
  actionItems: ActionItemDTO[];
  highlights: HighlightDTO[];
  transcript: SegmentDTO[];
};

export function toMeetingDTO(m: MeetingWithRelations): MeetingDTO {
  return {
    id: m.id,
    slug: m.slug,
    title: m.title,
    date: m.date.toISOString(),
    durationSec: m.durationSec,
    platform: m.platform,
    category: m.category,
    sentiment: m.sentiment,
    keywords: m.keywords,
    summary: m.summary,
    participants: m.participants.map((p) => ({
      id: p.id,
      name: p.name,
      initials: p.initials,
      role: p.role,
      color: p.color,
    })),
    actionItems: m.actionItems.map((a) => ({
      id: a.id,
      task: a.task,
      owner: a.owner,
      due: a.due,
      done: a.done,
    })),
    highlights: m.highlights.map((h) => ({
      id: h.id,
      timestamp: h.timestamp,
      text: h.text,
      by: h.by,
    })),
    transcript: m.transcript.map((s) => ({
      id: s.id,
      speaker: s.speaker,
      start: s.start,
      text: s.text,
    })),
  };
}

// --- display helpers -----------------------------------------------------

export function formatDuration(sec: number): string {
  if (!sec) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

export function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relativeDate(iso: string, now: number): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return formatShortDate(iso);
}

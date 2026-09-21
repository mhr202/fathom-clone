// Domain model for the meeting-intelligence product.
// The capture/transcription layer is intentionally mocked (see README) — this models
// everything that exists *after* a meeting is recorded, which is where the product lives.

export type Participant = {
  name: string;
  initials: string;
  role?: string;
  color: string; // tailwind bg class for the avatar
};

export type TranscriptSegment = {
  id: string;
  speaker: string; // participant name
  start: number; // seconds from meeting start
  text: string;
};

export type ActionItem = {
  id: string;
  task: string;
  owner: string;
  due?: string;
  done: boolean;
};

export type Highlight = {
  id: string;
  timestamp: number; // seconds
  text: string;
  by: string; // who highlighted it
};

export type TemplateKey =
  | "general"
  | "sales"
  | "one_on_one"
  | "interview"
  | "customer_feedback";

export type SummaryTemplate = {
  key: TemplateKey;
  label: string;
  description: string;
  // Each template renders the same meeting through a different lens.
  render: (m: Meeting) => { heading: string; bullets: string[] }[];
};

export type Meeting = {
  id: string;
  title: string;
  date: string; // ISO
  durationSec: number;
  platform: "Zoom" | "Google Meet" | "Microsoft Teams";
  participants: Participant[];
  // Seeded "AI" outputs.
  summary: string[];
  keywords: string[];
  actionItems: ActionItem[];
  highlights: Highlight[];
  transcript: TranscriptSegment[];
  // Extra structured data used by templates.
  sentiment: "positive" | "neutral" | "mixed" | "tense";
  category: string;
};

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// `now` is passed in from the server so server and client compute the same string
// (avoids hydration mismatches from Date.now() drifting between render passes).
export function relativeDate(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatShortDate(iso);
}

// Absolute date formatters pinned to a fixed locale + timezone so SSR and client
// hydration always produce identical text.
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

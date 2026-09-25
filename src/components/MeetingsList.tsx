"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MeetingDTO,
  formatDuration,
  relativeDate,
} from "@/lib/dto";
import { AvatarStack } from "./Avatar";
import { Icon } from "./icons";
import { NewMeetingDialog } from "./NewMeetingDialog";

const SENTIMENT: Record<string, { dot: string; label: string }> = {
  positive: { dot: "bg-accent", label: "text-accent" },
  neutral: { dot: "bg-fog-500", label: "text-fog-400" },
  mixed: { dot: "bg-signal-warm", label: "text-signal-warm" },
  tense: { dot: "bg-signal-hot", label: "text-signal-hot" },
};

export function MeetingsList({
  initialMeetings,
  categories,
  now,
}: {
  initialMeetings: MeetingDTO[];
  categories: string[];
  now: number;
}) {
  const router = useRouter();
  const [meetings, setMeetings] = useState(initialMeetings);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const firstRender = useRef(true);

  // Every search/filter is a real request to the API, which queries Postgres.
  const fetchMeetings = useCallback(async (q: string, cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (cat !== "All") params.set("category", cat);
      const res = await fetch(`/api/meetings?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setMeetings(data.meetings ?? []);
    } catch {
      /* keep previous results on transient failure */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => fetchMeetings(query, category), 220);
    return () => clearTimeout(t);
  }, [query, category, fetchMeetings]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 border-b border-ink-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-fog-500">
            <Icon.Search className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transcripts, people, topics…"
            className="w-full border-0 border-b border-transparent bg-transparent py-2 pl-6 pr-6 text-sm text-fog-100 outline-none transition placeholder:text-fog-500 focus:border-accent/60"
          />
          {loading && (
            <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent pulse-dot" />
          )}
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-ink-950 transition hover:bg-accent-dim"
        >
          <Icon.Plus className="h-4 w-4" /> New meeting
        </button>
      </div>

      {/* Category filter */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-2.5 py-1 text-xs transition ${
              category === c
                ? "bg-fog-100 text-ink-950"
                : "text-fog-400 ring-1 ring-ink-700 hover:bg-ink-850 hover:text-fog-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Rows */}
      {meetings.length === 0 ? (
        <Empty query={query} />
      ) : (
        <ul className="mt-2 divide-y divide-ink-800">
          {meetings.map((m) => {
            const s = SENTIMENT[m.sentiment] ?? SENTIMENT.neutral;
            const open = m.actionItems.filter((a) => !a.done).length;
            return (
              <li key={m.id} className="rise">
                <Link
                  href={`/meeting/${m.slug}`}
                  className="group grid grid-cols-1 gap-3 py-5 transition md:grid-cols-[1fr_260px] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className="text-[11px] uppercase tracking-[0.14em] text-fog-500">
                        {m.category} · {relativeDate(m.date, now)} · {formatDuration(m.durationSec)}
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-display text-2xl leading-tight tracking-tight text-fog-50 transition group-hover:text-accent">
                      {m.title}
                    </h3>

                    {m.summary[0] && (
                      <p className="mt-1.5 line-clamp-1 max-w-xl text-sm text-fog-400">
                        {m.summary[0]}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <AvatarStack participants={m.participants} />
                      <div className="flex items-center gap-3 text-xs text-fog-500">
                        {open > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Icon.Check className="h-3.5 w-3.5" /> {open} open
                          </span>
                        )}
                        {m.highlights.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Icon.Star className="h-3.5 w-3.5 text-signal-warm" />
                            {m.highlights.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Signature element: a mini timeline of the meeting */}
                  <MiniTimeline meeting={m} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <NewMeetingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={(slug) => router.push(`/meeting/${slug}`)}
      />
    </div>
  );
}

function MiniTimeline({ meeting }: { meeting: MeetingDTO }) {
  const dur = meeting.durationSec || 1;
  return (
    <div className="hidden md:block">
      <div className="relative h-9 w-full overflow-hidden rounded-sm bg-ink-850 ring-1 ring-ink-800">
        {/* transcript density */}
        {meeting.transcript.map((s) => (
          <span
            key={s.id}
            className="absolute top-0 h-full w-px bg-ink-600"
            style={{ left: `${Math.min(99.8, (s.start / dur) * 100)}%` }}
          />
        ))}
        {/* highlights */}
        {meeting.highlights.map((h) => (
          <span
            key={h.id}
            title={h.text}
            className="absolute top-0 h-full w-[2px] bg-signal-warm"
            style={{ left: `${Math.min(99.6, (h.timestamp / dur) * 100)}%` }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-right text-[10px] uppercase tracking-[0.16em] text-fog-500">
        {meeting.transcript.length} segments · {meeting.platform}
      </p>
    </div>
  );
}

function Empty({ query }: { query: string }) {
  return (
    <div className="mt-16 text-center">
      <p className="font-display text-2xl text-fog-200">Nothing here</p>
      <p className="mt-1 text-sm text-fog-500">
        {query ? `No meeting matches “${query}”.` : "No meetings in this view yet."}
      </p>
    </div>
  );
}

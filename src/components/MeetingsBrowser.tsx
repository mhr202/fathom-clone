"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Meeting, formatDuration, relativeDate } from "@/lib/types";
import { AvatarStack } from "./Avatar";
import { Icon } from "./icons";
import { NewMeetingModal, LocalMeeting } from "./NewMeetingModal";

const sentimentStyles: Record<Meeting["sentiment"], string> = {
  positive: "bg-emerald-50 text-emerald-700",
  neutral: "bg-slate-100 text-slate-600",
  mixed: "bg-amber-50 text-amber-700",
  tense: "bg-rose-50 text-rose-700",
};

export function MeetingsBrowser({
  meetings,
  now,
}: {
  meetings: Meeting[];
  now: number;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [localMeetings, setLocalMeetings] = useState<LocalMeeting[]>([]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(meetings.map((m) => m.category)))],
    [meetings]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return meetings.filter((m) => {
      const matchesCategory = category === "All" || m.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        m.title,
        m.category,
        ...m.keywords,
        ...m.participants.map((p) => p.name),
        ...m.summary,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [meetings, query, category]);

  return (
    <div id="meetings">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon.Search className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings, people, topics…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Icon.Plus className="h-4 w-4" /> New meeting
        </button>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              category === c
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Locally-created (uploaded) meetings appear on top while "processing" */}
      {localMeetings.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {localMeetings.map((lm) => (
            <div
              key={lm.tempId}
              className="animate-in rounded-2xl border border-brand-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-brand-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                Processing transcript & AI summary…
              </div>
              <h3 className="mt-2 font-semibold text-slate-900">{lm.title}</h3>
              <p className="mt-1 text-sm text-slate-500">Just now · {lm.platform}</p>
              <Link
                href="/meeting/weekly-team-sync"
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
              >
                View example result →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/meeting/${m.id}`}
              className="animate-in group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
                  {m.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${sentimentStyles[m.sentiment]}`}
                >
                  {m.sentiment}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {relativeDate(m.date, now)} · {formatDuration(m.durationSec)} · {m.platform}
              </p>

              <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                {m.summary[0]}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {m.keywords.slice(0, 3).map((k) => (
                  <span
                    key={k}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                  >
                    {k}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <AvatarStack participants={m.participants} size={28} />
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Icon.Doc className="h-3.5 w-3.5" /> {m.actionItems.length}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon.Star className="h-3.5 w-3.5 text-amber-400" /> {m.highlights.length}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <NewMeetingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(lm) => setLocalMeetings((prev) => [lm, ...prev])}
      />
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon.Search className="h-6 w-6" />
      </div>
      <p className="mt-3 font-medium text-slate-700">No meetings found</p>
      <p className="mt-1 text-sm text-slate-400">
        {query ? `Nothing matches “${query}”.` : "Try a different filter."}
      </p>
    </div>
  );
}

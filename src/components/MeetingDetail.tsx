"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Meeting, formatDuration, formatTimestamp, formatFullDate } from "@/lib/types";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { Avatar } from "./Avatar";
import { Icon } from "./icons";

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [templateKey, setTemplateKey] = useState("general");
  const [items, setItems] = useState(meeting.actionItems);
  const [toast, setToast] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Simulated playback clock.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTime((t) => {
        if (t >= meeting.durationSec) {
          setPlaying(false);
          return meeting.durationSec;
        }
        return t + 1;
      });
    }, 120); // sped up so the demo timeline moves visibly
    return () => clearInterval(id);
  }, [playing, meeting.durationSec]);

  const activeSegmentId = useMemo(() => {
    const sorted = [...meeting.transcript].sort((a, b) => a.start - b.start);
    let active = sorted[0]?.id;
    for (const s of sorted) {
      if (s.start <= time) active = s.id;
      else break;
    }
    return active;
  }, [time, meeting.transcript]);

  // Keep the active transcript line in view.
  useEffect(() => {
    const el = document.getElementById(`seg-${activeSegmentId}`);
    if (el && transcriptRef.current) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeSegmentId]);

  const template = getTemplate(templateKey);
  const sections = template.render(meeting);

  function seek(t: number) {
    setTime(Math.max(0, Math.min(meeting.durationSec, t)));
  }

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    );
  }

  async function share(highlightId?: string) {
    const url = highlightId
      ? `${location.origin}/share/${meeting.id}/${highlightId}`
      : `${location.origin}/share/${meeting.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Share link copied to clipboard");
    } catch {
      setToast(url);
    }
    setTimeout(() => setToast(null), 2600);
  }

  const progress = (time / meeting.durationSec) * 100;

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-8">
      {/* Back + title */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <Icon.ArrowLeft className="h-4 w-4" /> All meetings
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {meeting.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {formatFullDate(meeting.date)} · {formatDuration(meeting.durationSec)} ·{" "}
            {meeting.platform}
          </p>
        </div>
        <button
          onClick={() => share()}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
        >
          <Icon.Share className="h-4 w-4" /> Share
        </button>
      </div>

      {/* Player */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <Waveform progress={progress} />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-500"
          >
            {playing ? <Icon.Pause className="h-5 w-5" /> : <Icon.Play className="h-5 w-5" />}
          </button>
          <span className="w-12 text-xs tabular-nums text-slate-300">
            {formatTimestamp(time)}
          </span>
          <div
            className="relative h-2 flex-1 cursor-pointer rounded-full bg-slate-700"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seek(pct * meeting.durationSec);
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-brand-500"
              style={{ width: `${progress}%` }}
            />
            {/* Highlight markers */}
            {meeting.highlights.map((h) => (
              <button
                key={h.id}
                title={h.text}
                onClick={(e) => {
                  e.stopPropagation();
                  seek(h.timestamp);
                }}
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 ring-2 ring-slate-900 transition hover:scale-125"
                style={{ left: `${(h.timestamp / meeting.durationSec) * 100}%` }}
              />
            ))}
          </div>
          <span className="w-12 text-right text-xs tabular-nums text-slate-400">
            {formatTimestamp(meeting.durationSec)}
          </span>
        </div>
      </div>

      {/* Body: two columns */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: summary, action items, highlights */}
        <div className="space-y-6">
          {/* AI summary with template switcher */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon.Sparkles className="h-4 w-4" />
                </span>
                <h2 className="font-semibold text-slate-900">AI Summary</h2>
              </div>
              <select
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-400"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-slate-400">{template.description}</p>

            <div className="mt-4 space-y-4">
              {sections.map((sec) => (
                <div key={sec.heading}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {sec.heading}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Action items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Action items</h2>
              <span className="text-xs text-slate-400">
                {items.filter((i) => i.done).length}/{items.length} done
              </span>
            </div>
            <ul className="mt-4 space-y-2">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                >
                  <button
                    onClick={() => toggleItem(it.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      it.done
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-300 bg-white hover:border-brand-400"
                    }`}
                  >
                    {it.done && <Icon.Check className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`text-sm ${
                        it.done ? "text-slate-400 line-through" : "text-slate-800"
                      }`}
                    >
                      {it.task}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {it.owner}
                      {it.due ? ` · due ${it.due}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Highlights */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Highlights</h2>
            <ul className="mt-4 space-y-2">
              {meeting.highlights.map((h) => (
                <li
                  key={h.id}
                  className="group flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3"
                >
                  <button
                    onClick={() => seek(h.timestamp)}
                    className="mt-0.5 shrink-0 rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold tabular-nums text-amber-700 hover:bg-amber-200"
                  >
                    {formatTimestamp(h.timestamp)}
                  </button>
                  <p className="flex-1 text-sm text-slate-700">{h.text}</p>
                  <button
                    onClick={() => share(h.id)}
                    title="Share this moment"
                    className="shrink-0 rounded-md p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-brand-600"
                  >
                    <Icon.Share className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right: participants + transcript */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <Icon.Users className="h-4 w-4 text-slate-400" /> Participants
            </h2>
            <ul className="mt-3 space-y-2.5">
              {meeting.participants.map((p) => (
                <li key={p.name} className="flex items-center gap-3">
                  <Avatar participant={p} size={30} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.name}</p>
                    {p.role && <p className="text-xs text-slate-400">{p.role}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Transcript</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Follows along as you play. Click a line to jump.
            </p>
            <div
              ref={transcriptRef}
              className="scroll-thin mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1"
            >
              {[...meeting.transcript]
                .sort((a, b) => a.start - b.start)
                .map((s) => {
                  const active = s.id === activeSegmentId;
                  return (
                    <div
                      key={s.id}
                      id={`seg-${s.id}`}
                      onClick={() => seek(s.start)}
                      className={`cursor-pointer rounded-lg p-2 transition ${
                        active ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800">
                          {s.speaker}
                        </span>
                        <span className="text-[11px] tabular-nums text-slate-400">
                          {formatTimestamp(s.start)}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 text-sm ${
                          active ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {s.text}
                      </p>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="animate-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function Waveform({ progress }: { progress: number }) {
  // Decorative, deterministic waveform so SSR and client render identically.
  const bars = 64;
  return (
    <div className="flex h-20 items-center gap-[3px] px-6">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 0.7) * 60) + (i % 5) * 4;
        const played = (i / bars) * 100 <= progress;
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full ${played ? "bg-brand-400" : "bg-slate-600"}`}
            style={{ height: `${Math.min(80, h)}%` }}
          />
        );
      })}
    </div>
  );
}

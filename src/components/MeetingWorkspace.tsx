"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MeetingDTO,
  ActionItemDTO,
  HighlightDTO,
  formatDuration,
  formatFullDate,
  formatTimestamp,
} from "@/lib/dto";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { Avatar } from "./Avatar";
import { Icon } from "./icons";

export function MeetingWorkspace({ meeting }: { meeting: MeetingDTO }) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [templateKey, setTemplateKey] = useState("general");
  const [items, setItems] = useState<ActionItemDTO[]>(meeting.actionItems);
  const [highlights, setHighlights] = useState<HighlightDTO[]>(meeting.highlights);
  const [toast, setToast] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [noteText, setNoteText] = useState("");

  const duration = meeting.durationSec || 1;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTime((t) => {
        if (t >= duration) {
          setPlaying(false);
          return duration;
        }
        return t + 1;
      });
    }, 110);
    return () => clearInterval(id);
  }, [playing, duration]);

  const activeId = useMemo(() => {
    let active = meeting.transcript[0]?.id;
    for (const s of meeting.transcript) {
      if (s.start <= time) active = s.id;
      else break;
    }
    return active;
  }, [time, meeting.transcript]);

  useEffect(() => {
    const el = document.getElementById(`seg-${activeId}`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function seek(t: number) {
    setTime(Math.max(0, Math.min(duration, Math.round(t))));
  }

  // Persists to Postgres through PATCH /api/action-items/:id
  async function toggle(item: ActionItemDTO) {
    const optimistic = items.map((i) =>
      i.id === item.id ? { ...i, done: !i.done } : i
    );
    setItems(optimistic);
    try {
      const res = await fetch(`/api/action-items/${item.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
    } catch {
      setItems(items); // roll back
      flash("Could not save — try again");
    }
  }

  // Creates a real highlight row at the current playhead.
  async function captureMoment() {
    const text = noteText.trim();
    if (!text) return;
    setCapturing(true);
    try {
      const res = await fetch(`/api/meetings/${meeting.slug}/highlights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, timestamp: time, by: "Dev (you)" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setHighlights((h) =>
        [...h, data.highlight as HighlightDTO].sort((a, b) => a.timestamp - b.timestamp)
      );
      setNoteText("");
      flash("Moment saved");
    } catch {
      flash("Could not save the moment");
    } finally {
      setCapturing(false);
    }
  }

  async function share(highlightId?: string) {
    const url = highlightId
      ? `${location.origin}/share/${meeting.slug}/${highlightId}`
      : `${location.origin}/share/${meeting.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch {
      flash(url);
    }
  }

  const template = getTemplate(templateKey);
  const sections = template.render({ ...meeting, actionItems: items, highlights });
  const progress = (time / duration) * 100;

  return (
    <div className="px-5 py-7 sm:px-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fog-500 transition hover:text-fog-200"
      >
        <Icon.ArrowLeft className="h-3.5 w-3.5" /> Meetings
      </Link>

      {/* Masthead */}
      <header className="mt-4 flex flex-col gap-4 border-b border-ink-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-4xl leading-none tracking-tight text-fog-50 sm:text-5xl">
            {meeting.title}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-fog-500">
            {formatFullDate(meeting.date)} · {formatDuration(meeting.durationSec)} ·{" "}
            {meeting.platform}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-1.5">
            {meeting.participants.map((p) => (
              <Avatar key={p.id} participant={p} size={28} />
            ))}
          </div>
          <button
            onClick={() => share()}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-fog-300 ring-1 ring-ink-700 transition hover:bg-ink-850 hover:text-fog-100"
          >
            <Icon.Share className="h-4 w-4" /> Share
          </button>
        </div>
      </header>

      {/* Timeline — the signature surface */}
      <section className="mt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink-950 transition hover:bg-accent-dim"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Icon.Pause className="h-5 w-5" /> : <Icon.Play className="h-5 w-5" />}
          </button>

          <span className="w-12 font-mono text-xs text-fog-300">{formatTimestamp(time)}</span>

          <div
            className="group relative h-16 flex-1 cursor-pointer overflow-hidden rounded-md bg-ink-875 ring-1 ring-ink-800"
            style={{ backgroundColor: "#101016" }}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - r.left) / r.width) * duration);
            }}
          >
            {/* transcript density bars */}
            {meeting.transcript.map((s) => (
              <span
                key={s.id}
                className="absolute bottom-0 w-px bg-ink-600"
                style={{
                  left: `${(s.start / duration) * 100}%`,
                  height: `${Math.min(80, 28 + (s.text.length % 50))}%`,
                }}
              />
            ))}
            {/* played region */}
            <span
              className="absolute inset-y-0 left-0 bg-accent/10"
              style={{ width: `${progress}%` }}
            />
            {/* playhead */}
            <span
              className="absolute inset-y-0 w-[2px] bg-accent"
              style={{ left: `${progress}%` }}
            />
            {/* highlight markers */}
            {highlights.map((h) => (
              <button
                key={h.id}
                title={h.text}
                onClick={(e) => {
                  e.stopPropagation();
                  seek(h.timestamp);
                }}
                className="absolute top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-signal-warm ring-2 ring-ink-950 transition hover:scale-125"
                style={{ left: `${(h.timestamp / duration) * 100}%` }}
              />
            ))}
          </div>

          <span className="w-12 text-right font-mono text-xs text-fog-500">
            {formatTimestamp(duration)}
          </span>
        </div>

        {/* Capture a moment at the playhead → writes to the DB */}
        <div className="mt-3 flex items-center gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && captureMoment()}
            placeholder={`Capture what matters at ${formatTimestamp(time)}…`}
            className="flex-1 rounded-md border border-ink-750 bg-ink-850 px-3 py-2 text-sm text-fog-100 outline-none transition placeholder:text-fog-500 focus:border-accent/60"
          />
          <button
            onClick={captureMoment}
            disabled={capturing || !noteText.trim()}
            className="rounded-md px-3 py-2 text-sm text-ink-950 transition disabled:cursor-not-allowed disabled:bg-ink-750 disabled:text-fog-500 enabled:bg-signal-warm enabled:hover:opacity-90"
          >
            <Icon.Star className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Body */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Transcript as the reading column */}
        <section>
          <SectionTitle>Transcript</SectionTitle>
          <div className="scroll-thin mt-4 max-h-[620px] space-y-5 overflow-y-auto pr-2">
            {meeting.transcript.length === 0 && (
              <p className="text-sm text-fog-500">
                No transcript yet — this meeting was just created.
              </p>
            )}
            {meeting.transcript.map((s) => {
              const active = s.id === activeId;
              return (
                <div
                  key={s.id}
                  id={`seg-${s.id}`}
                  onClick={() => seek(s.start)}
                  className="cursor-pointer border-l-2 pl-4 transition"
                  style={{ borderColor: active ? "#CBF24D" : "#26262F" }}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xs uppercase tracking-[0.14em] ${
                        active ? "text-accent" : "text-fog-500"
                      }`}
                    >
                      {s.speaker}
                    </span>
                    <span className="font-mono text-[10px] text-fog-500">
                      {formatTimestamp(s.start)}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-[15px] leading-relaxed ${
                      active ? "text-fog-50" : "text-fog-300"
                    }`}
                  >
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right rail */}
        <aside className="space-y-9">
          {/* Summary */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle>Summary</SectionTitle>
              <select
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                className="rounded-md border border-ink-700 bg-ink-850 px-2 py-1 text-xs text-fog-200 outline-none focus:border-accent/60"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-xs text-fog-500">{template.description}</p>

            <div className="mt-4 space-y-5">
              {sections.map((sec) => (
                <div key={sec.heading}>
                  <h4 className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
                    {sec.heading}
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {sec.bullets.length === 0 && (
                      <li className="text-sm text-fog-500">—</li>
                    )}
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="text-sm leading-relaxed text-fog-200">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Action items */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle>Action items</SectionTitle>
              <span className="font-mono text-[10px] text-fog-500">
                {items.filter((i) => i.done).length}/{items.length}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {items.length === 0 && <li className="text-sm text-fog-500">None yet.</li>}
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    onClick={() => toggle(it)}
                    className="flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition hover:bg-ink-850"
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        it.done
                          ? "border-accent bg-accent text-ink-950"
                          : "border-ink-600"
                      }`}
                    >
                      {it.done && <Icon.Check className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-sm ${
                          it.done ? "text-fog-500 line-through" : "text-fog-100"
                        }`}
                      >
                        {it.task}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-fog-500">
                        {it.owner}
                        {it.due ? ` · ${it.due}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Highlights */}
          <section>
            <SectionTitle>Moments</SectionTitle>
            <ul className="mt-3 space-y-2">
              {highlights.length === 0 && (
                <li className="text-sm text-fog-500">
                  Nothing captured yet — use the field above.
                </li>
              )}
              {highlights.map((h) => (
                <li key={h.id} className="group flex items-start gap-2.5">
                  <button
                    onClick={() => seek(h.timestamp)}
                    className="mt-0.5 shrink-0 font-mono text-[10px] text-signal-warm transition hover:underline"
                  >
                    {formatTimestamp(h.timestamp)}
                  </button>
                  <p className="flex-1 text-sm leading-relaxed text-fog-200">{h.text}</p>
                  <button
                    onClick={() => share(h.id)}
                    title="Share this moment"
                    className="shrink-0 p-1 text-fog-500 opacity-0 transition group-hover:opacity-100 hover:text-accent"
                  >
                    <Icon.Share className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {toast && (
        <div className="rise fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-fog-100 px-3.5 py-2 text-sm font-medium text-ink-950">
          {toast}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.2em] text-fog-400">{children}</h2>
  );
}

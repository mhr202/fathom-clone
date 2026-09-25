"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

const STEPS = [
  "Uploading recording",
  "Transcribing audio",
  "Separating speakers",
  "Writing the summary",
  "Extracting action items",
];

/**
 * Creates a real row in Postgres via POST /api/meetings.
 * The capture/transcription pipeline itself is stubbed (documented in the README) —
 * the progress steps narrate what a production pipeline would be doing.
 */
export function NewMeetingDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (slug: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Zoom");
  const [stage, setStage] = useState<"form" | "working">("form");
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setStage("form");
      setStep(0);
      setError(null);
    }
  }, [open]);

  async function submit() {
    if (!title.trim()) {
      setError("Give the meeting a title.");
      return;
    }
    setError(null);
    setStage("working");

    // Narrate the pipeline while the record is actually created.
    const ticker = setInterval(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 420);

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), platform }),
      });
      const data = await res.json();
      clearInterval(ticker);

      if (!res.ok) {
        setError(data?.error ?? "Could not create the meeting.");
        setStage("form");
        return;
      }
      setStep(STEPS.length - 1);
      setTimeout(() => onCreated(data.meeting.slug), 400);
    } catch {
      clearInterval(ticker);
      setError("Network error — please try again.");
      setStage("form");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="rise relative w-full max-w-md rounded-xl border border-ink-750 bg-ink-900 p-6">
        {stage === "form" ? (
          <>
            <h2 className="font-display text-2xl text-fog-50">New meeting</h2>
            <p className="mt-1 text-sm text-fog-400">
              Creates a real record in the database.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  autoFocus
                  placeholder="Roadmap review"
                  className="mt-1.5 w-full rounded-md border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-fog-100 outline-none transition placeholder:text-fog-500 focus:border-accent/60"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
                  Platform
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {["Zoom", "Google Meet", "Microsoft Teams"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`rounded-md px-2.5 py-1.5 text-xs transition ${
                        platform === p
                          ? "bg-accent text-ink-950"
                          : "text-fog-300 ring-1 ring-ink-700 hover:bg-ink-850"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="mt-4 text-xs text-signal-hot">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-md px-3.5 py-2 text-sm text-fog-400 transition hover:text-fog-100"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-ink-950 transition hover:bg-accent-dim"
              >
                Create
              </button>
            </div>
          </>
        ) : (
          <div className="py-2">
            <h2 className="font-display text-2xl text-fog-50">Processing</h2>
            <ul className="mt-5 space-y-2.5">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-sm">
                  {i < step ? (
                    <Icon.Check className="h-4 w-4 text-accent" />
                  ) : i === step ? (
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-accent pulse-dot" />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-ink-600" />
                  )}
                  <span className={i <= step ? "text-fog-100" : "text-fog-500"}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

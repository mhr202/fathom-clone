"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

export type LocalMeeting = {
  tempId: string;
  title: string;
  platform: string;
};

// Simulates the capture → processing pipeline. The recording/transcription layer is
// intentionally mocked (see README); this shows the UX around it end to end.
export function NewMeetingModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (m: LocalMeeting) => void;
}) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Zoom");
  const [stage, setStage] = useState<"form" | "processing">("form");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setStage("form");
      setProgress(0);
      setTitle("");
    }
  }, [open]);

  useEffect(() => {
    if (stage !== "processing") return;
    const steps = [
      "Uploading recording…",
      "Transcribing audio…",
      "Detecting speakers…",
      "Generating AI summary…",
      "Extracting action items…",
    ];
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setProgress(Math.min(100, (i / steps.length) * 100));
      if (i >= steps.length) {
        clearInterval(timer);
        setTimeout(() => {
          onCreated({
            tempId: crypto.randomUUID(),
            title: title.trim() || "Untitled meeting",
            platform,
          });
          onClose();
        }, 500);
      }
    }, 650);
    return () => clearInterval(timer);
  }, [stage, title, platform, onCreated, onClose]);

  if (!open) return null;

  const steps = [
    "Uploading recording…",
    "Transcribing audio…",
    "Detecting speakers…",
    "Generating AI summary…",
    "Extracting action items…",
  ];
  const currentStep = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-in relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {stage === "form" ? (
          <>
            <h2 className="text-lg font-bold text-slate-900">New meeting</h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a recording or drop in a meeting link. We&apos;ll transcribe and
              summarize it.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Meeting title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product roadmap review"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Platform
                </label>
                <div className="mt-1 flex gap-2">
                  {["Zoom", "Google Meet", "Microsoft Teams"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        platform === p
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-6 text-center hover:border-brand-300">
                <Icon.Play className="h-6 w-6 text-slate-400" />
                <span className="mt-2 text-sm font-medium text-slate-600">
                  Drop a recording or click to upload
                </span>
                <span className="text-xs text-slate-400">MP4, MOV, or MP3 — optional for demo</span>
                <input type="file" className="hidden" />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setStage("processing")}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Create meeting
              </button>
            </div>
          </>
        ) : (
          <div className="py-4">
            <div className="flex items-center gap-2 text-brand-700">
              <Icon.Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-bold">Processing your meeting</h2>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ul className="mt-5 space-y-2">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2 text-sm">
                  {i < currentStep ? (
                    <Icon.Check className="h-4 w-4 text-emerald-500" />
                  ) : i === currentStep ? (
                    <span className="h-4 w-4 animate-pulse rounded-full bg-brand-400" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-slate-200" />
                  )}
                  <span className={i <= currentStep ? "text-slate-700" : "text-slate-400"}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { getHighlight } from "@/lib/data";
import { formatTimestamp, formatFullDate } from "@/lib/types";
import { ShareHeader } from "@/components/ShareHeader";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

export default async function SharedHighlightPage({
  params,
}: {
  params: Promise<{ meetingId: string; highlightId: string }>;
}) {
  const { meetingId, highlightId } = await params;
  const found = getHighlight(meetingId, highlightId);
  if (!found) notFound();
  const { meeting, highlight } = found;

  // A little transcript context around the highlighted moment.
  const context = [...meeting.transcript]
    .sort((a, b) => a.start - b.start)
    .filter(
      (s) => s.start >= highlight.timestamp - 90 && s.start <= highlight.timestamp + 90
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <ShareHeader />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-sm font-medium text-brand-600">Shared highlight</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {meeting.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {formatFullDate(meeting.date)} · {meeting.platform}
        </p>

        {/* Highlighted moment */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2 text-amber-700">
            <Icon.Star className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Highlight · {formatTimestamp(highlight.timestamp)}
            </span>
          </div>
          <p className="mt-3 text-lg font-medium leading-relaxed text-slate-900">
            {highlight.text}
          </p>
          <p className="mt-3 text-xs text-slate-500">Highlighted by {highlight.by}</p>
        </div>

        {/* Context */}
        {context.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">In context</h2>
            <div className="mt-3 space-y-3">
              {context.map((s) => (
                <div key={s.id} className="flex gap-3">
                  <span className="w-12 shrink-0 pt-0.5 text-[11px] tabular-nums text-slate-400">
                    {formatTimestamp(s.start)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{s.speaker}</p>
                    <p className="text-sm text-slate-600">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-slate-400">Participants:</span>
          <div className="flex -space-x-2">
            {meeting.participants.map((p) => (
              <Avatar key={p.name} participant={p} size={26} />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          Captured with Notably — the AI meeting notetaker.
        </p>
      </main>
    </div>
  );
}

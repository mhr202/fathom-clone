import { notFound } from "next/navigation";
import { getMeeting } from "@/lib/data";
import { formatDuration, formatFullDate } from "@/lib/types";
import { ShareHeader } from "@/components/ShareHeader";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

export default async function SharedMeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  const meeting = getMeeting(meetingId);
  if (!meeting) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <ShareHeader />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-sm font-medium text-brand-600">Shared meeting recap</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {meeting.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {formatFullDate(meeting.date)} · {formatDuration(meeting.durationSec)} ·{" "}
          {meeting.platform}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {meeting.participants.map((p) => (
              <Avatar key={p.name} participant={p} size={26} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon.Sparkles className="h-4 w-4" />
            </span>
            <h2 className="font-semibold text-slate-900">AI Summary</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {meeting.summary.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Action items */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Action items</h2>
          <ul className="mt-4 space-y-2">
            {meeting.actionItems.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    a.done ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300"
                  }`}
                >
                  {a.done && <Icon.Check className="h-3.5 w-3.5" />}
                </span>
                <span className={a.done ? "text-slate-400 line-through" : "text-slate-800"}>
                  {a.task} <span className="text-slate-400">· {a.owner}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          Captured with Notably — the AI meeting notetaker.
        </p>
      </main>
    </div>
  );
}

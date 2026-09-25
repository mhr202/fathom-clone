import { notFound } from "next/navigation";
import { getMeetingBySlug } from "@/lib/queries";
import { toMeetingDTO, formatDuration, formatFullDate } from "@/lib/dto";
import { ShareHeader } from "@/components/ShareHeader";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function SharedMeetingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getMeetingBySlug(slug);
  if (!record) notFound();
  const meeting = toMeetingDTO(record);

  return (
    <div className="min-h-screen bg-ink-950 text-fog-100">
      <ShareHeader />
      <main className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
          Shared recap
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-fog-50">
          {meeting.title}
        </h1>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-fog-500">
          {formatFullDate(meeting.date)} · {formatDuration(meeting.durationSec)} ·{" "}
          {meeting.platform}
        </p>

        <div className="mt-5 flex -space-x-1.5">
          {meeting.participants.map((p) => (
            <Avatar key={p.id} participant={p} size={26} />
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-fog-400">Summary</h2>
          <ul className="mt-3 space-y-2.5">
            {meeting.summary.map((s, i) => (
              <li key={i} className="text-[15px] leading-relaxed text-fog-200">
                {s}
              </li>
            ))}
            {meeting.summary.length === 0 && (
              <li className="text-sm text-fog-500">No summary yet.</li>
            )}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-fog-400">
            Action items
          </h2>
          <ul className="mt-3 space-y-2">
            {meeting.actionItems.map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-sm">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    a.done ? "border-accent bg-accent text-ink-950" : "border-ink-600"
                  }`}
                >
                  {a.done && <Icon.Check className="h-3 w-3" />}
                </span>
                <span className={a.done ? "text-fog-500 line-through" : "text-fog-200"}>
                  {a.task} <span className="text-fog-500">· {a.owner}</span>
                </span>
              </li>
            ))}
            {meeting.actionItems.length === 0 && (
              <li className="text-sm text-fog-500">None.</li>
            )}
          </ul>
        </section>

        <p className="mt-16 text-center text-[11px] uppercase tracking-[0.18em] text-fog-500">
          Captured with Rec
        </p>
      </main>
    </div>
  );
}

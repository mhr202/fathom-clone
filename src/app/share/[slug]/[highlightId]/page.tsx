import { notFound } from "next/navigation";
import { getSharedHighlight } from "@/lib/queries";
import { toMeetingDTO, formatFullDate, formatTimestamp } from "@/lib/dto";
import { ShareHeader } from "@/components/ShareHeader";
import { Avatar } from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default async function SharedMomentPage({
  params,
}: {
  params: Promise<{ slug: string; highlightId: string }>;
}) {
  const { slug, highlightId } = await params;
  const found = await getSharedHighlight(slug, highlightId);
  if (!found) notFound();

  const meeting = toMeetingDTO(found.meeting);
  const highlight = found.highlight;

  // Transcript context either side of the captured moment.
  const context = meeting.transcript.filter(
    (s) => s.start >= highlight.timestamp - 120 && s.start <= highlight.timestamp + 120
  );

  return (
    <div className="min-h-screen bg-ink-950 text-fog-100">
      <ShareHeader />
      <main className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-signal-warm">
          Shared moment · {formatTimestamp(highlight.timestamp)}
        </p>

        <blockquote className="mt-5 border-l-2 border-signal-warm pl-5">
          <p className="font-display text-3xl leading-snug tracking-tight text-fog-50">
            {highlight.text}
          </p>
        </blockquote>

        <p className="mt-4 text-xs text-fog-500">
          Captured by {highlight.by} in{" "}
          <span className="text-fog-300">{meeting.title}</span> ·{" "}
          {formatFullDate(meeting.date)}
        </p>

        {context.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-fog-400">
              In context
            </h2>
            <div className="mt-4 space-y-4">
              {context.map((s) => (
                <div key={s.id} className="flex gap-4">
                  <span className="w-10 shrink-0 pt-0.5 font-mono text-[10px] text-fog-500">
                    {formatTimestamp(s.start)}
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-fog-500">
                      {s.speaker}
                    </p>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-fog-200">
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.16em] text-fog-500">
            In the room
          </span>
          <div className="flex -space-x-1.5">
            {meeting.participants.map((p) => (
              <Avatar key={p.id} participant={p} size={24} />
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-[11px] uppercase tracking-[0.18em] text-fog-500">
          Captured with Rec
        </p>
      </main>
    </div>
  );
}

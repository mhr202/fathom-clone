import { Shell } from "@/components/Shell";
import { MeetingsList } from "@/components/MeetingsList";
import { listMeetings, getCategories, getStats } from "@/lib/queries";
import { toMeetingDTO } from "@/lib/dto";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [meetings, categories, stats] = await Promise.all([
    listMeetings(),
    getCategories(),
    getStats(),
  ]);

  return (
    <Shell active="meetings">
      <div className="px-5 py-7 sm:px-10">
        <div className="flex flex-col gap-6 border-b border-ink-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-5xl leading-none tracking-tight text-fog-50">
              Meetings
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-fog-400">
              Everything that was said, decided and promised — on one timeline.
            </p>
          </div>

          <dl className="flex gap-8">
            <Stat label="Recorded" value={stats.meetings} />
            <Stat label="Hours" value={`${stats.hours}`} />
            <Stat label="Open" value={stats.openActions} accent />
          </dl>
        </div>

        <div className="mt-7">
          <MeetingsList
            initialMeetings={meetings.map(toMeetingDTO)}
            categories={categories}
            now={Date.now()}
          />
        </div>
      </div>
    </Shell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-fog-500">{label}</dt>
      <dd
        className={`mt-1 font-display text-3xl leading-none ${
          accent ? "text-accent" : "text-fog-100"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

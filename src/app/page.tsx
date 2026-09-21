import { AppShell } from "@/components/AppShell";
import { MeetingsBrowser } from "@/components/MeetingsBrowser";
import { getMeetings } from "@/lib/data";

export default function HomePage() {
  const meetings = getMeetings();

  const totalActionItems = meetings.reduce((n, m) => n + m.actionItems.length, 0);
  const openActionItems = meetings.reduce(
    (n, m) => n + m.actionItems.filter((a) => !a.done).length,
    0
  );
  const totalHours = Math.round(
    meetings.reduce((n, m) => n + m.durationSec, 0) / 3600
  );

  return (
    <AppShell active="home">
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Good afternoon, Dev 👋
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s what happened across your recent meetings.
          </p>
        </div>

        {/* Stat tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Meetings" value={meetings.length} />
          <Stat label="Hours captured" value={`${totalHours}h`} />
          <Stat label="Action items" value={totalActionItems} />
          <Stat label="Still open" value={openActionItems} accent />
        </div>

        {/* Browser */}
        <div className="mt-8">
          <MeetingsBrowser meetings={meetings} />
        </div>
      </div>
    </AppShell>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${
          accent ? "text-brand-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

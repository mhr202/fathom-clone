type P = { name: string; initials: string; role?: string | null; color: string };

// Seed stores a colour *name*; the design system maps it to a treatment.
const COLORS: Record<string, string> = {
  rose: "bg-rose-400/20 text-rose-200 ring-rose-400/30",
  amber: "bg-amber-400/20 text-amber-200 ring-amber-400/30",
  emerald: "bg-emerald-400/20 text-emerald-200 ring-emerald-400/30",
  violet: "bg-violet-400/20 text-violet-200 ring-violet-400/30",
  sky: "bg-sky-400/20 text-sky-200 ring-sky-400/30",
  fuchsia: "bg-fuchsia-400/20 text-fuchsia-200 ring-fuchsia-400/30",
  teal: "bg-teal-400/20 text-teal-200 ring-teal-400/30",
  orange: "bg-orange-400/20 text-orange-200 ring-orange-400/30",
  indigo: "bg-indigo-400/20 text-indigo-200 ring-indigo-400/30",
  accent: "bg-accent text-ink-950 ring-accent/40",
};

function classesFor(color: string) {
  return COLORS[color] ?? "bg-ink-700 text-fog-200 ring-ink-600";
}

export function Avatar({ participant, size = 30 }: { participant: P; size?: number }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-medium ring-1 ${classesFor(
        participant.color
      )}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      title={participant.role ? `${participant.name} · ${participant.role}` : participant.name}
    >
      {participant.initials}
    </div>
  );
}

export function AvatarStack({
  participants,
  max = 5,
  size = 26,
}: {
  participants: P[];
  max?: number;
  size?: number;
}) {
  const shown = participants.slice(0, max);
  const extra = participants.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-1.5">
        {shown.map((p) => (
          <Avatar key={p.name + p.initials} participant={p} size={size} />
        ))}
      </div>
      {extra > 0 && (
        <span
          className="ml-1.5 flex items-center justify-center rounded-full bg-ink-750 text-fog-300 ring-1 ring-ink-600"
          style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}

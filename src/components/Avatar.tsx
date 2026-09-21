import { Participant } from "@/lib/types";

export function Avatar({
  participant,
  size = 32,
}: {
  participant: Participant;
  size?: number;
}) {
  return (
    <div
      className={`${participant.color} flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-white`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={participant.role ? `${participant.name} · ${participant.role}` : participant.name}
    >
      {participant.initials}
    </div>
  );
}

export function AvatarStack({
  participants,
  max = 4,
  size = 32,
}: {
  participants: Participant[];
  max?: number;
  size?: number;
}) {
  const shown = participants.slice(0, max);
  const extra = participants.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((p) => (
          <Avatar key={p.name} participant={p} size={size} />
        ))}
      </div>
      {extra > 0 && (
        <div
          className="ml-1 flex items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 ring-2 ring-white"
          style={{ width: size, height: size, fontSize: size * 0.36 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

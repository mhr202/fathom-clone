import { Shell } from "@/components/Shell";
import { ActionsBoard } from "@/components/ActionsBoard";
import { listActionItems } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ActionsPage() {
  const rows = await listActionItems();

  return (
    <Shell active="actions">
      <div className="px-5 py-7 sm:px-10">
        <div className="border-b border-ink-800 pb-7">
          <h1 className="font-display text-5xl leading-none tracking-tight text-fog-50">
            Action items
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-fog-400">
            What everyone promised, pulled out of every meeting and grouped by owner.
          </p>
        </div>

        <div className="mt-7">
          <ActionsBoard
            rows={rows.map((r) => ({
              id: r.id,
              task: r.task,
              owner: r.owner,
              due: r.due,
              done: r.done,
              meeting: { slug: r.meeting.slug, title: r.meeting.title },
            }))}
          />
        </div>
      </div>
    </Shell>
  );
}

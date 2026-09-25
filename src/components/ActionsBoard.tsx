"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";

export type ActionRow = {
  id: string;
  task: string;
  owner: string;
  due: string | null;
  done: boolean;
  meeting: { slug: string; title: string };
};

export function ActionsBoard({ rows }: { rows: ActionRow[] }) {
  const [items, setItems] = useState(rows);
  const [showDone, setShowDone] = useState(false);

  async function toggle(row: ActionRow) {
    const prev = items;
    setItems(items.map((i) => (i.id === row.id ? { ...i, done: !i.done } : i)));
    try {
      const res = await fetch(`/api/action-items/${row.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
    } catch {
      setItems(prev);
    }
  }

  const visible = showDone ? items : items.filter((i) => !i.done);
  const byOwner = visible.reduce<Record<string, ActionRow[]>>((acc, i) => {
    (acc[i.owner] ??= []).push(i);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between border-b border-ink-800 pb-4">
        <p className="text-sm text-fog-400">
          {items.filter((i) => !i.done).length} open across all meetings
        </p>
        <button
          onClick={() => setShowDone((s) => !s)}
          className="text-xs uppercase tracking-[0.14em] text-fog-500 transition hover:text-fog-200"
        >
          {showDone ? "Hide completed" : "Show completed"}
        </button>
      </div>

      {Object.keys(byOwner).length === 0 ? (
        <p className="mt-16 text-center font-display text-2xl text-fog-300">
          Everything is done.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {Object.entries(byOwner).map(([owner, list]) => (
            <section key={owner}>
              <h2 className="font-display text-2xl text-fog-100">{owner}</h2>
              <ul className="mt-3 divide-y divide-ink-800 border-t border-ink-800">
                {list.map((it) => (
                  <li key={it.id} className="flex items-start gap-3 py-3">
                    <button
                      onClick={() => toggle(it)}
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        it.done ? "border-accent bg-accent text-ink-950" : "border-ink-600 hover:border-accent"
                      }`}
                    >
                      {it.done && <Icon.Check className="h-3 w-3" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${it.done ? "text-fog-500 line-through" : "text-fog-100"}`}>
                        {it.task}
                      </p>
                      <Link
                        href={`/meeting/${it.meeting.slug}`}
                        className="mt-0.5 inline-block text-[11px] text-fog-500 transition hover:text-accent"
                      >
                        {it.meeting.title}
                        {it.due ? ` · due ${it.due}` : ""}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

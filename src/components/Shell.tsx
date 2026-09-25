import Link from "next/link";
import { Icon } from "./icons";

export function Shell({
  children,
  active = "meetings",
}: {
  children: React.ReactNode;
  active?: "meetings" | "actions";
}) {
  return (
    <div className="min-h-screen bg-ink-950 text-fog-100">
      <div className="flex">
        {/* Left rail */}
        <aside className="sticky top-0 hidden h-screen w-[210px] shrink-0 flex-col border-r border-ink-800 bg-ink-900 px-4 py-6 lg:flex">
          <Link href="/" className="flex items-baseline gap-2 px-2">
            <span className="font-display text-3xl leading-none tracking-tightest text-fog-50">
              Rec
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </Link>
          <p className="mt-2 px-2 text-[11px] uppercase tracking-[0.18em] text-fog-500">
            Meeting intelligence
          </p>

          <nav className="mt-9 flex flex-col gap-0.5">
            <Rail href="/" label="Meetings" icon={<Icon.List />} active={active === "meetings"} />
            <Rail href="/actions" label="Action items" icon={<Icon.Check />} active={active === "actions"} />
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-lg border border-ink-750 bg-ink-850 p-3">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-dot" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-fog-400">
                  Live database
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-fog-400">
                Reading from Postgres via the API.
              </p>
            </div>

            <div className="flex items-center gap-2.5 border-t border-ink-800 pt-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-ink-950">
                ME
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-fog-100">Dev</p>
                <p className="truncate text-[11px] text-fog-500">dev@rec.app</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 surface-grain">{children}</main>
      </div>
    </div>
  );
}

function Rail({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
        active
          ? "bg-ink-800 text-fog-50"
          : "text-fog-400 hover:bg-ink-850 hover:text-fog-100"
      }`}
    >
      <span className={active ? "text-accent" : "text-fog-500 group-hover:text-fog-300"}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

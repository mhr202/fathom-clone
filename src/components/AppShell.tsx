import Link from "next/link";
import { Icon } from "./icons";

// Left navigation + top bar. A demo account is shown so the app is usable by anyone
// visiting the live link without signing in (per the assignment checklist).
export function AppShell({
  children,
  active = "home",
}: {
  children: React.ReactNode;
  active?: "home" | "meetings";
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 md:flex">
          <Link href="/" className="mb-8 flex items-center gap-2 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Icon.Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Notably
            </span>
          </Link>

          <nav className="flex flex-col gap-1">
            <NavItem href="/" label="Home" icon={<Icon.Home />} active={active === "home"} />
            <NavItem href="/#meetings" label="Meetings" icon={<Icon.List />} active={active === "meetings"} />
          </nav>

          <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-3">
            <div className="flex items-center gap-2 text-brand-700">
              <Icon.Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Free plan</span>
            </div>
            <p className="mt-1 text-xs text-brand-900/70">
              5 of 10 meetings used this month.
            </p>
          </div>

          <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              ME
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">Dev</p>
              <p className="truncate text-xs text-slate-400">dev@notably.app</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
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
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-brand-600" : "text-slate-400"}>{icon}</span>
      {label}
    </Link>
  );
}

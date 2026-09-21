import Link from "next/link";
import { Icon } from "./icons";
import { CopyLinkButton } from "./CopyLinkButton";

// Public, unauthenticated page chrome for shared meetings/clips.
export function ShareHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Icon.Sparkles className="h-4 w-4" />
          </span>
          <span className="font-bold tracking-tight text-slate-900">Notably</span>
        </Link>
        <CopyLinkButton />
      </div>
    </header>
  );
}

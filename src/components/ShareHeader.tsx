import Link from "next/link";
import { CopyLinkButton } from "./CopyLinkButton";

export function ShareHeader() {
  return (
    <header className="border-b border-ink-800">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none text-fog-50">Rec</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </Link>
        <CopyLinkButton />
      </div>
    </header>
  );
}

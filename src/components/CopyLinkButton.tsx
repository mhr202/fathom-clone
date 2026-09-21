"use client";

import { useState } from "react";
import { Icon } from "./icons";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
    >
      {copied ? <Icon.Check className="h-4 w-4 text-emerald-500" /> : <Icon.Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

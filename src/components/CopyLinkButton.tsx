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
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-fog-300 ring-1 ring-ink-700 transition hover:bg-ink-850 hover:text-fog-100"
    >
      {copied ? (
        <Icon.Check className="h-3.5 w-3.5 text-accent" />
      ) : (
        <Icon.Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

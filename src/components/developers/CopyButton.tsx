"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function markCopied() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function copy() {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const legacy = document.execCommand("copy");
    area.remove();

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => {
        if (legacy) markCopied();
      });
      return;
    }
    if (legacy) markCopied();
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy"}
      className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

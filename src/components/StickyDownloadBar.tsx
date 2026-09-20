"use client";

import { useEffect, useState } from "react";
import { logEvent } from "@/lib/analytics";
import { playStoreUrl } from "@/lib/google-play-href";
import { useKeyboardOpen } from "@/hooks/useKeyboardOpen";

const STORAGE_KEY = "traindekho-sticky-download-dismissed";

type StickyDownloadBarProps = {
  forceVisible?: boolean;
};

export default function StickyDownloadBar({
  forceVisible = false,
}: StickyDownloadBarProps) {
  const [downloadOffscreen, setDownloadOffscreen] = useState(forceVisible);
  const [dismissed, setDismissed] = useState(false);
  const keyboardOpen = useKeyboardOpen();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
      return;
    }

    if (forceVisible) {
      setDownloadOffscreen(true);
      return;
    }

    const download = document.getElementById("download");
    if (!download) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setDownloadOffscreen(!entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    observer.observe(download);
    return () => observer.disconnect();
  }, [forceVisible]);

  const visible = downloadOffscreen && !keyboardOpen && !dismissed;

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  }

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-2xl bg-blue-900 text-white shadow-2xl ring-1 ring-white/10 px-3 py-3">
        <p className="flex-1 text-sm font-semibold leading-snug">
          Live tracking is in the app — status, PNR, alerts & booking
        </p>
        <a
          href={playStoreUrl({ campaign: "sticky" })}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logEvent("app_cta_click", { placement: "sticky" })}
          className="shrink-0 rounded-full bg-blue-600 text-white text-xs font-medium px-3 py-2"
        >
          Get the app
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
          aria-label="Dismiss download bar"
        >
          ×
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getLiveTrainStatusHref, getTrainScheduleHref } from "@/lib/train-schedule-href";

type RouteTrainCardActionsProps = {
  trainNo: number;
};

type PendingAction = "schedule" | "live" | null;

export default function RouteTrainCardActions({ trainNo }: RouteTrainCardActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const loading = pendingAction !== null;

  async function navigateToSchedule() {
    if (loading) return;
    setPendingAction("schedule");

    const digits = String(trainNo).replace(/\D/g, "");
    try {
      const res = await fetch(`/api/trains/lookup?no=${encodeURIComponent(digits)}`);
      if (res.ok) {
        const { href } = (await res.json()) as { href: string };
        router.push(href);
        return;
      }
    } catch {
      // fall through to number-only URL
    }

    router.push(getTrainScheduleHref(trainNo));
  }

  function navigateToLiveStatus() {
    if (loading) return;
    setPendingAction("live");
    router.push(getLiveTrainStatusHref(trainNo));
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={navigateToSchedule}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-80 disabled:cursor-wait"
      >
        {pendingAction === "schedule" ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <TimetableIcon className="w-4 h-4" />
        )}
        {pendingAction === "schedule" ? "Loading…" : "View Schedule"}
      </button>
      <button
        type="button"
        onClick={navigateToLiveStatus}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-80 disabled:cursor-wait"
      >
        {pendingAction === "live" ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <LiveStatusIcon className="w-4 h-4" />
        )}
        {pendingAction === "live" ? "Loading…" : "Live Status"}
      </button>
    </div>
  );
}

function TimetableIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
        fill="currentColor"
      />
    </svg>
  );
}

function LiveStatusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
        fill="currentColor"
      />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className ?? ""}`}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

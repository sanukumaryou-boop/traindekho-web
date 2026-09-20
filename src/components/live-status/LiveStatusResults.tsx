"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LiveStatusOverview from "@/components/live-status/LiveStatusOverview";
import LiveStatusRefreshButton from "@/components/live-status/LiveStatusRefreshButton";
import LiveStatusSearchForm from "@/components/live-status/LiveStatusSearchForm";
import LiveStatusTimeline from "@/components/live-status/LiveStatusTimeline";
import TrainScheduleFAQ from "@/components/train-schedule/TrainScheduleFAQ";
import { titleCase } from "@/lib/format";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";
import type { FaqItem } from "@/lib/train-schedule-faq";
import type { LiveStatusFetchResult, TrainLiveStatusResponse } from "@/lib/types/live-status";

type LiveStatusResultsProps = {
  initialData: TrainLiveStatusResponse;
  trainNo: string;
  journeyDate: string;
  faqItems?: FaqItem[];
};

export default function LiveStatusResults({
  initialData,
  trainNo,
  journeyDate,
  faqItems = [],
}: LiveStatusResultsProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    setData(initialData);
    setRefreshError(null);
  }, [initialData]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function handleRefresh() {
    if (refreshing) return;

    setRefreshing(true);
    setRefreshError(null);

    try {
      const params = new URLSearchParams({ no: trainNo, date: journeyDate });
      const response = await fetch(`/api/trains/live-status?${params.toString()}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as LiveStatusFetchResult;

      if (result.ok) {
        setData(result.data);
      } else {
        setRefreshError(result.message);
      }
    } catch {
      setRefreshError("Could not refresh live status. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/live-train-status");
  }

  const trainName = titleCase(data.train_name);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative z-20 shrink-0 bg-gray-50/95 pb-3">
        <header className="border-b border-gray-200/80 bg-white pt-[env(safe-area-inset-top)] md:border-0 md:bg-transparent md:pt-3">
          <div className="flex items-center gap-1 md:gap-3 px-1 md:px-0 py-1.5 md:py-0 min-h-14 md:min-h-0">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="md:hidden shrink-0 flex h-11 w-11 items-center justify-center rounded-full text-gray-900 hover:bg-gray-100"
            >
              <BackIcon className="h-6 w-6" />
            </button>

            <h1 className="min-w-0 flex-1 flex items-center gap-2 md:hidden">
              <span className="inline-flex shrink-0 items-center rounded-full bg-blue-600 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                {data.train_no}
              </span>
              <span className="min-w-0 truncate text-[15px] font-bold tracking-tight text-gray-900">
                {trainName}
              </span>
            </h1>

            <h1 className="hidden md:flex min-w-0 flex-1 items-center gap-2 text-lg font-bold text-gray-900 tracking-tight leading-snug">
              <span className="inline-flex shrink-0 items-center rounded-full bg-blue-600 px-2.5 py-0.5 font-mono text-sm font-bold text-white">
                {data.train_no}
              </span>
              <span className="min-w-0 truncate">{trainName}</span>
            </h1>

            <div className="md:hidden">
              <LiveStatusSearchForm
                initialTrainNo={trainNo}
                initialDate={journeyDate}
                compact
                appearance="nav"
              />
            </div>
            <div className="hidden md:block">
              <LiveStatusSearchForm
                initialTrainNo={trainNo}
                initialDate={journeyDate}
                compact
              />
            </div>
          </div>
        </header>

        {refreshError && (
          <p className="mx-4 md:mx-0 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {refreshError}
          </p>
        )}

        <div className={`mx-4 md:mx-0 mt-3 ${refreshing ? "opacity-60 pointer-events-none" : ""}`}>
          <LiveStatusOverview data={data} />
        </div>
      </div>

      <div
        data-live-status-route
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 md:px-0 pb-36 md:pb-28 ${
          refreshing ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <LiveStatusTimeline
          schedule={data.schedule}
          currentStationCode={data.live_train_status.currentStation}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 mt-4 mb-2">
          <span>
            {data.source_code} → {data.destination_code}
          </span>
          <Link
            href={getTrainScheduleHref(data.train_no)}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Full schedule →
          </Link>
        </div>

        {faqItems.length > 0 ? (
          <div className="mt-6 mb-2">
            <TrainScheduleFAQ items={faqItems} />
          </div>
        ) : null}
      </div>

      <LiveStatusRefreshButton onRefresh={handleRefresh} pending={refreshing} />
    </div>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

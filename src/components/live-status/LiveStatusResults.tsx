"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LiveStatusOverview from "@/components/live-status/LiveStatusOverview";
import LiveStatusRefreshButton from "@/components/live-status/LiveStatusRefreshButton";
import LiveStatusSearchForm from "@/components/live-status/LiveStatusSearchForm";
import LiveStatusTimeline from "@/components/live-status/LiveStatusTimeline";
import { titleCase } from "@/lib/format";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";
import type { LiveStatusFetchResult, TrainLiveStatusResponse } from "@/lib/types/live-status";

type LiveStatusResultsProps = {
  initialData: TrainLiveStatusResponse;
  trainNo: string;
  journeyDate: string;
};

export default function LiveStatusResults({
  initialData,
  trainNo,
  journeyDate,
}: LiveStatusResultsProps) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    setData(initialData);
    setRefreshError(null);
  }, [initialData]);

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

  return (
    <>
      <header className="mb-4 pt-1">
        <Link
          href="/live-train-status"
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 mb-3"
        >
          <BackIcon className="h-4 w-4" />
          Back
        </Link>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
          <span className="font-mono text-blue-600">{data.train_no}</span>
          <span className="text-gray-400 mx-2 font-normal">-</span>
          {titleCase(data.train_name)}
        </h1>

        <div className="mt-3">
          <LiveStatusSearchForm
            initialTrainNo={trainNo}
            initialDate={journeyDate}
            compact
          />
        </div>
      </header>

      {refreshError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {refreshError}
        </p>
      )}

      <div className={`relative ${refreshing ? "opacity-60 pointer-events-none" : ""}`}>
        <section className="mb-5">
          <LiveStatusOverview data={data} journeyDate={journeyDate} />
        </section>

        <section className="mb-8">
          <LiveStatusTimeline
            schedule={data.schedule}
            currentStationCode={data.live_train_status.currentStation}
          />
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 mb-8">
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

      <LiveStatusRefreshButton onRefresh={handleRefresh} pending={refreshing} />
    </>
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

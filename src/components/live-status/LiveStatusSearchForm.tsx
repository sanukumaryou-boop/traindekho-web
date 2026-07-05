"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  formatLiveStatusApiDate,
  getQuickJourneyDateOptions,
  htmlDateToApiDate,
  apiDateToHtmlDate,
} from "@/lib/live-status-date";
import { getLiveTrainStatusHrefWithDate } from "@/lib/train-schedule-href";

type LiveStatusSearchFormProps = {
  initialTrainNo?: string;
  initialDate?: string;
  compact?: boolean;
};

export default function LiveStatusSearchForm({
  initialTrainNo = "",
  initialDate = formatLiveStatusApiDate(),
  compact = false,
}: LiveStatusSearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [trainNo, setTrainNo] = useState(initialTrainNo);
  const [date, setDate] = useState(apiDateToHtmlDate(initialDate));
  const dateOptions = getQuickJourneyDateOptions();

  useEffect(() => {
    setTrainNo(initialTrainNo);
    setDate(apiDateToHtmlDate(initialDate));
  }, [initialTrainNo, initialDate]);

  function navigate(train: string, apiDate: string) {
    const digits = train.replace(/\D/g, "");
    if (!digits) return;

    startTransition(() => {
      router.push(getLiveTrainStatusHrefWithDate(digits, apiDate));
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(trainNo, htmlDateToApiDate(date));
  }

  function selectDate(htmlDate: string, apiDate: string) {
    setDate(htmlDate);
    if (compact && initialTrainNo) {
      navigate(initialTrainNo, apiDate);
    }
  }

  if (compact && initialTrainNo) {
    return (
      <LiveStatusDateOptions
        value={date}
        options={dateOptions}
        onSelect={selectDate}
        pending={isPending}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Train Number
        </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          required
          value={trainNo}
          onChange={(event) => setTrainNo(event.target.value)}
          placeholder="e.g. 11057"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </label>

      <div>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Journey Date
        </span>
        <div className="mt-1.5">
          <LiveStatusDateOptions
            value={date}
            options={dateOptions}
            onSelect={selectDate}
            pending={isPending}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-80"
      >
        {isPending ? "Loading…" : "Check Live Status"}
      </button>
    </form>
  );
}

function LiveStatusDateOptions({
  value,
  options,
  onSelect,
  pending,
}: {
  value: string;
  options: ReturnType<typeof getQuickJourneyDateOptions>;
  onSelect: (htmlDate: string, apiDate: string) => void;
  pending?: boolean;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Journey date"
    >
      {options.map((option) => {
        const selected = value === option.htmlDate;

        return (
          <button
            key={option.apiDate}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option.htmlDate, option.apiDate)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              pending && selected ? "opacity-80" : ""
            } ${
              selected
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

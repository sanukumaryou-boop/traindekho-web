"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import {
  formatLiveStatusApiDate,
  getQuickJourneyDateOptions,
  htmlDateToApiDate,
  apiDateToHtmlDate,
  withSelectedJourneyDateOption,
} from "@/lib/live-status-date";
import { getLiveTrainStatusHrefWithDate } from "@/lib/train-schedule-href";

type LiveStatusSearchFormProps = {
  initialTrainNo?: string;
  initialDate?: string;
  compact?: boolean;
  appearance?: "default" | "nav";
};

export default function LiveStatusSearchForm({
  initialTrainNo = "",
  initialDate = formatLiveStatusApiDate(),
  compact = false,
  appearance = "default",
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
      <LiveStatusDateDropdown
        value={date}
        options={dateOptions}
        selectedApiDate={initialDate}
        onSelect={selectDate}
        pending={isPending}
        appearance={appearance}
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

function LiveStatusDateDropdown({
  value,
  options,
  selectedApiDate,
  onSelect,
  pending,
  appearance = "default",
}: {
  value: string;
  options: ReturnType<typeof getQuickJourneyDateOptions>;
  selectedApiDate?: string;
  onSelect: (htmlDate: string, apiDate: string) => void;
  pending?: boolean;
  appearance?: "default" | "nav";
}) {
  const dateOptions = withSelectedJourneyDateOption(options, selectedApiDate);
  const selected =
    dateOptions.find((option) => option.htmlDate === value) ?? dateOptions[0];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isNav = appearance === "nav";

  return (
    <div ref={rootRef} className={`relative z-20 shrink-0 ${isNav ? "" : "mt-0.5"}`}>
      <button
        type="button"
        aria-label="Journey date"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={pending}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={
          isNav
            ? "inline-flex min-h-11 cursor-pointer items-center gap-0.5 rounded-lg px-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:opacity-80"
            : "inline-flex min-w-[7.75rem] cursor-pointer items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-2.5 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm hover:border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-80"
        }
      >
        <span>{selected?.label ?? "Today"}</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${
            isNav ? "text-blue-500" : "text-gray-400"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Journey date"
          className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
        >
          {dateOptions.map((option) => {
            const isSelected = option.htmlDate === value;

            return (
              <button
                key={option.apiDate}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setOpen(false);
                  if (!isSelected) {
                    onSelect(option.htmlDate, option.apiDate);
                  }
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">
                    {option.label}
                  </span>
                  {option.detail ? (
                    <span
                      className={`mt-0.5 block text-[11px] font-medium ${
                        isSelected ? "text-blue-600/80" : "text-gray-400"
                      }`}
                    >
                      {option.detail}
                    </span>
                  ) : null}
                </span>
                {isSelected ? <CheckIcon className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

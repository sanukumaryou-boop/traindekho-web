"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { titleCase } from "@/lib/format";
import type { TrainListItem } from "@/lib/types/train-list";

type TrainSearchProps = {
  variant?: "default" | "page";
};

export default function TrainSearch({ variant = "default" }: TrainSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrainListItem[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);

  const isPage = variant === "page";

  const navigateToTrain = useCallback(
    (trainNo: number | string) => {
      const digits = String(trainNo).replace(/\D/g, "");
      if (!digits) return;
      setError("");
      setLoading(true);
      setOpen(false);
      router.push(`/train-schedule/${digits}`);
    },
    [router],
  );

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/trains/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = (await res.json()) as TrainListItem[];
        setResults(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setOpen(false);
        }
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a train number or name");
      return;
    }

    const digits = trimmed.replace(/\D/g, "");
    if (digits.length >= 4 && digits.length <= 5 && trimmed === digits) {
      navigateToTrain(digits);
      return;
    }

    if (activeIndex >= 0 && results[activeIndex]) {
      navigateToTrain(results[activeIndex].train_no);
      return;
    }

    if (results.length === 1) {
      navigateToTrain(results[0].train_no);
      return;
    }

    if (results.length > 0) {
      setError("Select a train from the list");
      setOpen(true);
      return;
    }

    setError("No train found — try a different number or name");
  }

  function handleSelect(train: TrainListItem) {
    setQuery(String(train.train_no));
    navigateToTrain(train.train_no);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="train-search"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Train number or name
      </label>
      <div className={isPage ? "flex flex-col gap-3" : "flex flex-col sm:flex-row gap-3"}>
        <div ref={containerRef} className={isPage ? "relative w-full" : "relative flex-1"}>
          <input
            ref={inputRef}
            id="train-search"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            placeholder={isPage ? "e.g. 12951 or Rajdhani Express" : "Train number or name"}
            value={query}
            disabled={loading}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError("");
              if (e.target.value.trim().length >= 2) setOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={
              isPage
                ? "w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                : "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            }
          />

          {searching && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <Spinner className="w-4 h-4 text-gray-400" />
            </div>
          )}

          {open && results.length > 0 && (
            <ul
              id={listboxId}
              role="listbox"
              className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1"
            >
              {results.map((train, index) => (
                <li
                  key={train.id}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(train)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      index === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-bold text-blue-600">
                          {train.train_no}
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {titleCase(train.train_name)}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-gray-500 pt-0.5">
                        {train.source_code ?? "—"} → {train.destination_code ?? "—"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={
            isPage
              ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-80 text-white font-semibold px-6 py-3.5 shadow-sm transition-colors disabled:cursor-not-allowed"
              : "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-80 text-white font-semibold px-6 py-3 shadow-sm transition-colors whitespace-nowrap min-w-[9.5rem] disabled:cursor-not-allowed"
          }
        >
          {loading ? (
            <>
              <Spinner className="w-4 h-4" />
              Loading…
            </>
          ) : (
            <>
              <ScheduleIcon className="w-4 h-4" />
              View Schedule
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
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

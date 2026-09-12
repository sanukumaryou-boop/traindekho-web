"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TrainListItem } from "@/lib/types/train-list";
import TrainSuggestions from "@/components/TrainSuggestions";
import {
  getLiveTrainStatusHref,
  getTrainScheduleHref,
} from "@/lib/train-schedule-href";

type TrainSearchProps = {
  variant?: "default" | "page" | "hero";
  inputId?: string;
  submitLabel?: string;
  hrefKind?: "schedule" | "live";
  onSearch?: () => void;
  onSelectTrain?: (
    trainNo: number,
    train?: TrainListItem,
  ) => void | Promise<void>;
};

export default function TrainSearch({
  variant = "default",
  inputId = "train-search",
  submitLabel,
  hrefKind = "schedule",
  onSearch,
  onSelectTrain,
}: TrainSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrainListItem[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [pendingTrainNo, setPendingTrainNo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const isPage = variant === "page";
  const isHero = variant === "hero";
  const resolvedSubmitLabel = submitLabel ?? "View Schedule";
  const suggestions = query.trim().length >= 2 ? results : [];

  const navigateToTrain = useCallback(
    async (trainNo: number | string, train?: TrainListItem) => {
      const digits = String(trainNo).replace(/\D/g, "");
      if (!digits || loading) return;
      setError("");
      setLoading(true);
      setPendingTrainNo(Number(digits));
      onSearch?.();

      if (onSelectTrain) {
        await onSelectTrain(Number(digits), train);
        setLoading(false);
        setPendingTrainNo(null);
        return;
      }

      const live = hrefKind === "live";
      if (train) {
        router.push(live ? getLiveTrainStatusHref(train) : getTrainScheduleHref(train));
        return;
      }

      try {
        const res = await fetch(`/api/trains/lookup?no=${encodeURIComponent(digits)}`);
        if (res.ok) {
          const data = (await res.json()) as {
            href: string;
            liveStatusHref?: string;
          };
          router.push(live ? data.liveStatusHref || `/live-train-status/${digits}` : data.href);
          return;
        }
      } catch {
        // fall through to number-only URL
      }

      router.push(live ? `/live-train-status/${digits}` : `/train-schedule/${digits}`);
    },
    [router, loading, onSelectTrain, onSearch, hrefKind],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      setOpen(false);
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
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setOpen(true);
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
    function updatePosition() {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }

    if (!open) {
      setDropdownPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loading) return;
      const target = event.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loading]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a train number or name");
      return;
    }

    const digits = trimmed.replace(/\D/g, "");
    if (digits.length >= 4 && digits.length <= 5 && trimmed === digits) {
      const match = suggestions.find((train) => String(train.train_no) === digits);
      navigateToTrain(digits, match);
      return;
    }

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigateToTrain(suggestions[activeIndex].train_no, suggestions[activeIndex]);
      return;
    }

    if (suggestions.length === 1) {
      navigateToTrain(suggestions[0].train_no, suggestions[0]);
      return;
    }

    if (suggestions.length > 0) {
      setError("Select a train from the list");
      setOpen(true);
      return;
    }

    setError("No train found — try a different number or name");
  }

  function handleSelect(train: TrainListItem) {
    navigateToTrain(train.train_no, train);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor={inputId}
        className={
          isHero
            ? "sr-only"
            : `block font-semibold text-gray-700 mb-2 ${isPage ? "text-xs uppercase tracking-wider text-gray-500" : "text-sm"}`
        }
      >
        {isPage ? "Search" : "Train number or name"}
      </label>
      <div className={isPage ? "flex flex-col gap-3" : isHero ? "flex flex-col sm:flex-row gap-2" : "flex flex-col sm:flex-row gap-3"}>
        <div ref={containerRef} className={isPage ? "relative w-full" : "relative flex-1"}>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            placeholder={
              isHero || isPage ? "e.g. 12951 or Rajdhani Express" : "Train number or name"
            }
            value={query}
            disabled={loading}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError("");
              if (e.target.value.trim().length >= 2) setOpen(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 2) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={
              isHero
                ? "w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-[0.95rem] text-[0.95rem] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                : isPage
                ? "w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                : "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            }
          />

          {searching && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <Spinner className="w-4 h-4 text-gray-400" />
            </div>
          )}

          {mounted &&
            open &&
            dropdownPosition &&
            (searching || query.trim().length >= 2) &&
            createPortal(
              <TrainSuggestions
                listboxId={listboxId}
                results={suggestions}
                activeIndex={activeIndex}
                query={query}
                searching={searching}
                loading={loading}
                pendingTrainNo={pendingTrainNo}
                disabled={loading}
                position={dropdownPosition}
                listRef={dropdownRef}
                onSelect={handleSelect}
              />,
              document.body,
            )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={
            isHero
              ? "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium px-6 py-[0.95rem] text-[0.95rem] transition-colors whitespace-nowrap disabled:cursor-not-allowed"
              : isPage
                ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3.5 transition-colors disabled:cursor-not-allowed"
                : "inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3 whitespace-nowrap min-w-[9.5rem] transition-colors disabled:cursor-not-allowed"
          }
        >
          {loading ? (
            <>
              <Spinner className="w-4 h-4" />
              Loading…
            </>
          ) : isHero ? (
            <>
              {resolvedSubmitLabel}
              <ArrowIcon className="w-4 h-4" />
            </>
          ) : (
            <>
              {submitLabel ? (
                <LiveIcon className="w-4 h-4" />
              ) : (
                <ScheduleIcon className="w-4 h-4" />
              )}
              {resolvedSubmitLabel}
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

function LiveIcon({ className }: { className?: string }) {
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

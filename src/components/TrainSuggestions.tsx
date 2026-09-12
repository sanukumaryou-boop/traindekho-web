"use client";

import { useEffect, type RefObject } from "react";
import { titleCase } from "@/lib/format";
import type { TrainListItem } from "@/lib/types/train-list";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

type TrainSuggestionsProps = {
  listboxId: string;
  results: TrainListItem[];
  activeIndex: number;
  query: string;
  searching: boolean;
  loading?: boolean;
  pendingTrainNo?: number | null;
  disabled?: boolean;
  position: DropdownPosition;
  listRef: RefObject<HTMLDivElement | null>;
  onSelect: (train: TrainListItem) => void;
};

export default function TrainSuggestions({
  listboxId,
  results,
  activeIndex,
  query,
  searching,
  loading = false,
  pendingTrainNo = null,
  disabled = false,
  position,
  listRef,
  onSelect,
}: TrainSuggestionsProps) {
  const showEmpty = !searching && results.length === 0;
  const showSkeletons = searching && results.length === 0;

  useEffect(() => {
    if (activeIndex < 0) return;
    const option = document.getElementById(`${listboxId}-option-${activeIndex}`);
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listboxId]);

  return (
    <div
      ref={listRef}
      id={listboxId}
      role="listbox"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: Math.max(position.width, 320),
        zIndex: 60,
      }}
      className="max-h-80 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
    >
      {showSkeletons && (
        <div className="space-y-1 p-1" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5">
              <div className="h-8 w-14 shrink-0 rounded-lg bg-gray-100 animate-pulse" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3.5 w-2/3 rounded bg-gray-100 animate-pulse" />
                <div className="h-2.5 w-1/3 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <TrainIcon className="w-4 h-4" />
          </span>
          <p className="text-sm font-medium text-gray-900">No trains found</p>
          <p className="mt-1 text-xs text-gray-500">Try a train number or name</p>
        </div>
      )}

      {results.map((train, index) => {
        const selected = index === activeIndex;
        const isNavigating = loading && pendingTrainNo === train.train_no;
        const name = train.train_name ? titleCase(train.train_name) : "Unknown train";
        const trainNo = String(train.train_no);
        const from = train.source_code ?? "—";
        const to = train.destination_code ?? "—";

        return (
          <button
            key={`${train.train_no}-${train.id}-${index}`}
            type="button"
            id={`${listboxId}-option-${index}`}
            role="option"
            aria-selected={selected}
            disabled={disabled || loading}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(train);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors disabled:cursor-wait ${
              selected || isNavigating ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <span className="inline-flex min-w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 px-2 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-gray-800">
              {isNavigating ? (
                <Spinner className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                highlightMatch(trainNo, query)
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900">
                {highlightMatch(name, query)}
              </span>
              <span className="mt-0.5 block truncate text-xs text-gray-500">
                {from} → {to}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const needle = query.trim();
  if (needle.length < 2) return text;

  const index = text.toLowerCase().indexOf(needle.toLowerCase());
  if (index < 0) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-bold text-gray-950">
        {text.slice(index, index + needle.length)}
      </mark>
      {text.slice(index + needle.length)}
    </>
  );
}

function TrainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 007.5 19L6 20.5V21h12v-.5L16.5 19a3.5 3.5 0 003.5-3.5V6c0-3.5-4-4-8-4zM7.5 17a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM18 10H6V6h12v4z"
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

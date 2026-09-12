"use client";

import { useEffect, type RefObject } from "react";
import { titleCase } from "@/lib/format";
import type { Station } from "@/lib/types/route-search";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

type StationSuggestionsProps = {
  listboxId: string;
  results: Station[];
  activeIndex: number;
  query: string;
  searching: boolean;
  disabled?: boolean;
  position: DropdownPosition;
  listRef: RefObject<HTMLDivElement | null>;
  onSelect: (station: Station) => void;
};

export default function StationSuggestions({
  listboxId,
  results,
  activeIndex,
  query,
  searching,
  disabled = false,
  position,
  listRef,
  onSelect,
}: StationSuggestionsProps) {
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
        width: Math.max(position.width, 280),
        zIndex: 60,
      }}
      className="max-h-80 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
    >
      {showSkeletons && (
        <div className="space-y-1 p-1" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5">
              <div className="h-8 w-12 shrink-0 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-3.5 flex-1 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <PinIcon className="w-4 h-4" />
          </span>
          <p className="text-sm font-medium text-gray-900">No stations found</p>
          <p className="mt-1 text-xs text-gray-500">Try a station name or code</p>
        </div>
      )}

      {results.map((station, index) => {
        const selected = index === activeIndex;
        const name = titleCase(station.station_name);

        return (
          <button
            key={`${station.station_code}-${station.id}-${index}`}
            type="button"
            id={`${listboxId}-option-${index}`}
            role="option"
            aria-selected={selected}
            disabled={disabled}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(station);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors disabled:cursor-not-allowed ${
              selected ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <span className="inline-flex min-w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 px-2 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-gray-800">
              {highlightMatch(station.station_code, query)}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
              {highlightMatch(name, query)}
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

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
        fill="currentColor"
      />
    </svg>
  );
}

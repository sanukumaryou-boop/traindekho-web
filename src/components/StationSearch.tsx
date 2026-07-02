"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { titleCase } from "@/lib/format";
import type { Station } from "@/lib/types/route-search";

type StationSearchProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  disabled?: boolean;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

export default function StationSearch({
  id,
  label,
  placeholder = "Station name or code",
  value,
  onChange,
  disabled = false,
}: StationSearchProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(value ? formatStationLabel(value) : "");
  const [results, setResults] = useState<Station[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value) {
      setQuery(formatStationLabel(value));
    }
  }, [value]);

  useEffect(() => {
    const q = query.trim();
    if (value && formatStationLabel(value) === q) {
      setResults([]);
      setSearching(false);
      return;
    }

    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/stations/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = (await res.json()) as Station[];
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
  }, [query, value]);

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

    if (!open || results.length === 0) {
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
  }, [open, results.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  }, []);

  function handleSelect(station: Station) {
    onChange(station);
    setQuery(formatStationLabel(station));
    setOpen(false);
    setActiveIndex(-1);
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

  const dropdown =
    mounted && open && results.length > 0 && dropdownPosition ? (
      <ul
        ref={dropdownRef}
        id={listboxId}
        role="listbox"
        style={{
          position: "fixed",
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 60,
        }}
        className="max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1"
      >
        {results.map((station, index) => (
          <li
            key={station.id}
            id={`${listboxId}-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
          >
            <button
              type="button"
              disabled={disabled}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(station);
              }}
              className={`w-full px-4 py-3 text-left transition-colors disabled:cursor-not-allowed ${
                index === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <p className="font-mono text-sm font-bold text-blue-600">
                {station.station_code}
              </p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {titleCase(station.station_name)}
              </p>
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        placeholder={placeholder}
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onChange(null);
          if (e.target.value.trim().length >= 2) setOpen(true);
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      />

      {searching && (
        <div className="pointer-events-none absolute right-4 top-[calc(50%+0.75rem)] -translate-y-1/2">
          <Spinner className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

function formatStationLabel(station: Station): string {
  return `${titleCase(station.station_name)} (${station.station_code})`;
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

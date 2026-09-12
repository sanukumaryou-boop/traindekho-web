"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StationSearch from "@/components/StationSearch";
import HeroActionButton from "@/components/HeroActionButton";
import { getRouteSearchHref } from "@/lib/route-search-slug";
import type { Station } from "@/lib/types/route-search";

type RouteSearchFormProps = {
  initialFrom?: string;
  initialTo?: string;
  variant?: "default" | "hero";
  onSearch?: () => void;
};

export default function RouteSearchForm({
  initialFrom = "",
  initialTo = "",
  variant = "default",
  onSearch,
}: RouteSearchFormProps) {
  const router = useRouter();
  const [from, setFrom] = useState<Station | null>(
    initialFrom ? { id: 0, station_code: initialFrom, station_name: initialFrom } : null,
  );
  const [to, setTo] = useState<Station | null>(
    initialTo ? { id: 0, station_code: initialTo, station_name: initialTo } : null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function resolveStation(code: string): Promise<Station | null> {
      try {
        const res = await fetch(`/api/stations/search?q=${encodeURIComponent(code)}`);
        if (!res.ok) return null;
        const data = (await res.json()) as Station[];
        return data.find((s) => s.station_code === code) ?? data[0] ?? null;
      } catch {
        return null;
      }
    }

    async function hydrateStations() {
      if (initialFrom) {
        const station = await resolveStation(initialFrom);
        if (station) setFrom(station);
      }
      if (initialTo) {
        const station = await resolveStation(initialTo);
        if (station) setTo(station);
      }
    }

    if (initialFrom || initialTo) {
      hydrateStations();
    }
  }, [initialFrom, initialTo]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!from?.station_code) {
      setError("Select a departure station");
      return;
    }
    if (!to?.station_code) {
      setError("Select an arrival station");
      return;
    }
    if (from.station_code === to.station_code) {
      setError("Departure and arrival stations must be different");
      return;
    }

    setError("");
    setLoading(true);
    onSearch?.();
    router.push(getRouteSearchHref(from.station_code, to.station_code));
  }

  function swapStations() {
    setFrom(to);
    setTo(from);
    if (error) setError("");
  }

  const fromField = (
    <StationSearch
      id={variant === "hero" ? "hero-route-from" : "route-from"}
      label="From"
      placeholder={variant === "hero" ? "From Station" : "Station name or code"}
      variant={variant === "hero" ? "hero" : "default"}
      value={from}
      onChange={(station) => {
        setFrom(station);
        if (error) setError("");
      }}
      disabled={loading}
    />
  );

  const toField = (
    <StationSearch
      id={variant === "hero" ? "hero-route-to" : "route-to"}
      label="To"
      placeholder={variant === "hero" ? "To Station" : "Station name or code"}
      variant={variant === "hero" ? "hero" : "default"}
      value={to}
      onChange={(station) => {
        setTo(station);
        if (error) setError("");
      }}
      disabled={loading}
    />
  );

  const submitButton =
    variant === "hero" ? (
      <HeroActionButton loading={loading} loadingLabel="Searching…">
        Search Trains
      </HeroActionButton>
    ) : (
      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3.5 transition-colors disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4" />
            Searching…
          </>
        ) : (
          <>
            Search Trains
            <ArrowIcon className="w-4 h-4" />
          </>
        )}
      </button>
    );

  const swapButton = (
    extraClassName = "",
  ) => (
    <button
      type="button"
      onClick={swapStations}
      disabled={loading || (!from && !to)}
      aria-label="Swap origin and destination"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:bg-white disabled:text-gray-400 disabled:cursor-not-allowed ${extraClassName}`}
    >
      <SwapIcon className="w-5 h-5 rotate-90 sm:rotate-0" />
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full min-w-0">
      {variant === "hero" ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:flex-1 [&_input]:pr-14 sm:[&_input]:pr-5">
            {fromField}
            {swapButton(
              "absolute right-3 bottom-0 z-10 translate-y-1/2 sm:hidden",
            )}
          </div>
          <div className="hidden sm:block">{swapButton()}</div>
          <div className="min-w-0 sm:flex-1 [&_input]:pr-14 sm:[&_input]:pr-5">
            {toField}
          </div>
          {submitButton}
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="min-w-0 sm:flex-1">{fromField}</div>
            <div className="flex justify-center sm:self-end">{swapButton()}</div>
            <div className="min-w-0 sm:flex-1">{toField}</div>
          </div>
          {submitButton}
        </>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function SwapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 10h11M15 6l4 4-4 4M17 14H6M9 18l-4-4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

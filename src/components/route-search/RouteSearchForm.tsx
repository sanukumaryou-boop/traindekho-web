"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StationSearch from "@/components/StationSearch";
import { getRouteSearchHref } from "@/lib/route-search-slug";
import type { Station } from "@/lib/types/route-search";

type RouteSearchFormProps = {
  initialFrom?: string;
  initialTo?: string;
};

export default function RouteSearchForm({
  initialFrom = "",
  initialTo = "",
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
    router.push(getRouteSearchHref(from.station_code, to.station_code));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StationSearch
          id="route-from"
          label="From"
          value={from}
          onChange={(station) => {
            setFrom(station);
            if (error) setError("");
          }}
          disabled={loading}
        />
        <StationSearch
          id="route-to"
          label="To"
          value={to}
          onChange={(station) => {
            setTo(station);
            if (error) setError("");
          }}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-80 text-white font-semibold px-6 py-3.5 shadow-sm transition-colors disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4" />
            Searching…
          </>
        ) : (
          <>
            <SearchIcon className="w-4 h-4" />
            Search Trains
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
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

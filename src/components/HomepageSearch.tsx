"use client";

import { FormEvent, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logEvent } from "@/lib/analytics";
import TrainSearch from "@/components/TrainSearch";
import RouteSearchForm from "@/components/route-search/RouteSearchForm";
import AppInstallGate, {
  type AppInstallGateProps,
} from "@/components/AppInstallGate";

type Tab = "live" | "schedule" | "route" | "pnr";

const TAB_HREFS: Record<Tab, string> = {
  route: "/",
  live: "/live",
  pnr: "/pnr",
  schedule: "/schedule",
};

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "route", label: "Find trains", icon: <TrainIcon className="w-5 h-5" /> },
  { id: "live", label: "Track Live", icon: <LivePinIcon className="w-5 h-5" /> },
  { id: "pnr", label: "PNR status", icon: <TicketIcon className="w-5 h-5" /> },
  { id: "schedule", label: "Schedule", icon: <CalendarIcon className="w-5 h-5" /> },
];

function tabFromPath(pathname: string): Tab {
  if (pathname === "/live" || pathname.startsWith("/live/")) return "live";
  if (pathname === "/pnr" || pathname.startsWith("/pnr/")) return "pnr";
  if (pathname === "/schedule" || pathname.startsWith("/schedule/")) {
    return "schedule";
  }
  return "route";
}

export default function HomepageSearch() {
  const pathname = usePathname();
  const tab = tabFromPath(pathname);
  const [gate, setGate] = useState<AppInstallGateProps | null>(null);

  function openPnrGate(pnr: string) {
    logEvent("homepage_search", { tab: "pnr", has_query: true });
    setGate({ kind: "pnr", pnr });
  }

  return (
    <div className="w-full text-left">
      <div
        role="tablist"
        aria-label="Search type"
        className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3"
      >
        {TABS.map((item) => {
          const selected = tab === item.id;
          return (
            <Link
              key={item.id}
              href={TAB_HREFS[item.id]}
              role="tab"
              aria-selected={selected}
              scroll={false}
              onClick={() => setGate(null)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-2xl px-2 py-2.5 sm:px-4 sm:py-3 text-[11px] sm:text-sm font-medium transition-colors ${
                selected
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-white/10 text-white/85 hover:bg-white/20 hover:text-white backdrop-blur-md"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-black/5 p-4 sm:p-6 lg:p-7">
        {gate ? (
          <AppInstallGate {...gate} onBack={() => setGate(null)} />
        ) : (
          <>
            {tab === "live" && (
              <TrainSearch
                variant="hero"
                inputId="hero-live-search"
                submitLabel="Track Live"
                hrefKind="live"
                onSearch={() =>
                  logEvent("homepage_search", { tab: "live", has_query: true })
                }
              />
            )}
            {tab === "schedule" && (
              <TrainSearch
                variant="hero"
                inputId="hero-schedule-search"
                onSearch={() =>
                  logEvent("homepage_search", { tab: "schedule", has_query: true })
                }
              />
            )}
            {tab === "route" && (
              <RouteSearchForm
                variant="hero"
                onSearch={() =>
                  logEvent("homepage_search", { tab: "route", has_query: true })
                }
              />
            )}
            {tab === "pnr" && <PnrSearch onSubmit={openPnrGate} />}
          </>
        )}
      </div>
    </div>
  );
}

function PnrSearch({ onSubmit }: { onSubmit: (pnr: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Enter a 10-digit PNR number");
      return;
    }
    setError("");
    onSubmit(digits);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="hero-pnr-search" className="sr-only">
        PNR number
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="hero-pnr-search"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={10}
          placeholder="10-digit PNR"
          value={value}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "").slice(0, 10);
            setValue(next);
            if (error) setError("");
          }}
          className="flex-1 w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-[0.95rem] text-[0.95rem] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-colors"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-[0.95rem] text-[0.95rem] transition-colors whitespace-nowrap"
        >
          Check PNR
          <ArrowIcon className="w-4 h-4" />
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

function LivePinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
        fill="currentColor"
      />
    </svg>
  );
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"
        fill="currentColor"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
        fill="currentColor"
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

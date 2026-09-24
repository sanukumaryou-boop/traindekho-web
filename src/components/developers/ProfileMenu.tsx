"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Account } from "@/lib/developers/public-api";

function limitLabel(value: number | null, unit: string) {
  return value == null ? `Unlimited ${unit}` : `${value.toLocaleString("en-IN")} ${unit}`;
}

export default function ProfileMenu({
  account,
  solid,
  onLogout,
}: {
  account: Account;
  solid: boolean;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = account.name.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Open profile"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          solid
            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-white/40 bg-white/15 text-white hover:bg-white/25"
        }`}
      >
        <UserIcon />
      </button>
      {open ? (
        <div className="glass absolute right-0 top-11 z-50 w-72 rounded-3xl p-4 text-gray-900">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{account.name}</p>
              <p className="text-sm text-gray-500">{account.plan.name} plan</p>
            </div>
          </div>
          <dl className="mt-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between gap-3">
              <dt>Daily</dt>
              <dd>{limitLabel(account.plan.daily_request_limit, "requests")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Monthly</dt>
              <dd>{limitLabel(account.plan.monthly_request_limit, "requests")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Per minute</dt>
              <dd>{limitLabel(account.plan.requests_per_minute, "requests")}</dd>
            </div>
          </dl>
          <Link
            href="/developers/keys"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-white"
          >
            API keys
          </Link>
          <Link
            href="/developers/usage"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-white"
          >
            Usage
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="mt-2 w-full rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5.5 19.25c1.3-2.7 3.6-4 6.5-4s5.2 1.3 6.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

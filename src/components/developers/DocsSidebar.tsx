"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiEndpoints, apiGroups } from "@/lib/developers/catalog";
import { methodBadgeClass } from "@/lib/developers/method";

function GuideTab({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-2xl px-2.5 py-2 font-medium transition-colors ${
        active ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:bg-white/45 hover:text-gray-900"
      }`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-xl ${
          active ? "bg-blue-600 text-white" : "bg-white/70 text-gray-400"
        }`}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

function itemClass(active: boolean) {
  return active
    ? "bg-white/80 text-blue-800 shadow-sm ring-1 ring-white/80"
    : "text-gray-600 hover:bg-white/45 hover:text-gray-900";
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const started = pathname === "/developers" || pathname === "/developers/reference";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/developers/session")
      .then((response) => {
        if (!cancelled) setSignedIn(response.ok);
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <nav aria-label="API reference" className="text-sm">
      {signedIn === null ? null : (
        <div className="rounded-[22px] bg-white/35 p-1.5 ring-1 ring-white/80">
          {signedIn ? (
            <>
              <GuideTab href="/developers" label="Plans" active={started} icon={<StartIcon />} />
              <GuideTab href="/developers/keys" label="API keys" active={pathname.startsWith("/developers/keys")} icon={<KeyIcon />} />
              <GuideTab href="/developers/usage" label="Usage" active={pathname.startsWith("/developers/usage")} icon={<UsageIcon />} />
            </>
          ) : (
            <GuideTab href="/developers" label="Get started" active={started} icon={<StartIcon />} />
          )}
        </div>
      )}

      {apiGroups.map((group) => (
        <div key={group} className="mt-6">
          <p className="mb-2 border-t border-white/70 px-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-900/40">
            {group}
          </p>
          <ul className="space-y-1">
            {apiEndpoints
              .filter((endpoint) => endpoint.group === group)
              .map((endpoint) => {
                const href = `/developers/reference/${endpoint.slug}`;
                const active = pathname === href;
                return (
                  <li key={endpoint.slug}>
                    <Link href={href} scroll={false} className={`flex items-start gap-2.5 rounded-2xl px-2.5 py-2 ${itemClass(active)}`}>
                      <span
                        className={`mt-0.5 inline-flex w-14 shrink-0 items-center justify-center rounded-md bg-white/70 py-0.5 font-mono text-[10px] font-bold tracking-wide ${methodBadgeClass(endpoint.method)}`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-5">{endpoint.summary}</span>
                        <span className={`mt-0.5 block truncate font-mono text-[11px] ${active ? "text-blue-700/70" : "text-gray-400"}`}>
                          {endpoint.path}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function StartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 19V6.5A1.5 1.5 0 0 1 6.5 5H14l5 4.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M14 5v5h5M8.5 13h7M8.5 16.5h4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="8" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11 14h9.5M16.5 14v2.5M19.5 14v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function UsageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 19V5M5 19h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M9 15v-4M13 15V8M17 15v-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}


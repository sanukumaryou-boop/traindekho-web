"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiEndpoints, apiGroups } from "@/lib/developers/catalog";
import { methodBadgeClass } from "@/lib/developers/method";

const accountLinks = [
  { href: "/developers", label: "Plans" },
  { href: "/developers/keys", label: "API keys" },
  { href: "/developers/usage", label: "Usage" },
];

function itemClass(active: boolean) {
  return active
    ? "bg-white/80 text-blue-800 shadow-sm ring-1 ring-white/80"
    : "text-gray-600 hover:bg-white/45 hover:text-gray-900";
}

function groupLabel(label: string, first = false) {
  return (
    <p
      className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-900/40 ${
        first ? "" : "border-t border-white/70 pt-4"
      }`}
    >
      {label}
    </p>
  );
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

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

  const links = signedIn ? accountLinks : accountLinks.filter((link) => link.href === "/developers");

  return (
    <nav aria-label="API reference" className="text-sm">
      <div>
        {groupLabel("Account", true)}
        <ul className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link href={link.href} scroll={false} className={`block rounded-2xl px-3 py-2 font-medium ${itemClass(active)}`}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {apiGroups.map((group) => (
        <div key={group} className="mt-6">
          {groupLabel(group)}
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



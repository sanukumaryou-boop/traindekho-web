"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiEndpoints, apiGroups } from "@/lib/developers/catalog";

function itemClass(active: boolean) {
  return active
    ? "bg-white/80 text-blue-800 shadow-sm ring-1 ring-white/80"
    : "text-gray-600 hover:bg-white/45 hover:text-gray-900";
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const started = pathname === "/developers" || pathname === "/developers/reference";

  return (
    <nav aria-label="API reference" className="text-sm">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-900/40">Guide</p>
      <div className="space-y-1">
        <Link href="/developers" className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 font-medium ${itemClass(started)}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${started ? "bg-blue-600" : "bg-gray-300"}`} />
          Get started
        </Link>
        <Link
          href="/developers/keys"
          className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 font-medium ${itemClass(pathname.startsWith("/developers/keys"))}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${pathname.startsWith("/developers/keys") ? "bg-blue-600" : "bg-gray-300"}`} />
          API keys
        </Link>
        <Link
          href="/developers/usage"
          className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 font-medium ${itemClass(pathname.startsWith("/developers/usage"))}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${pathname.startsWith("/developers/usage") ? "bg-blue-600" : "bg-gray-300"}`} />
          Usage
        </Link>
      </div>

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
                    <Link href={href} className={`flex items-start gap-2.5 rounded-2xl px-2.5 py-2 ${itemClass(active)}`}>
                      <span
                        className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide ${
                          active ? "bg-blue-600 text-white" : "bg-white/70 text-blue-700"
                        }`}
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

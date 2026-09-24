import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { methodBadgeClass } from "@/lib/developers/method";
import {
  ACCESS_COOKIE,
  PublicApiError,
  REFRESH_COOKIE,
  getUsage,
  listLogs,
  type AccountUsage,
  type RequestLogPage,
} from "@/lib/developers/public-api";

export const metadata: Metadata = {
  title: "Usage",
  description: "See how many Train Dekho API requests this account has used.",
};

function meter(count: number, limit: number | null) {
  if (limit == null || limit <= 0) return null;
  return Math.min(100, Math.round((count / limit) * 100));
}

function amount(limit: number | null, percent: number | null) {
  if (limit == null) return "No cap on this window";
  return `${percent ?? 0}% of ${limit.toLocaleString("en-IN")}`;
}

function usageDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function UsageCard({
  label,
  value,
  caption,
  percent,
}: {
  label: string;
  value: string;
  caption: string;
  percent: number | null;
}) {
  return (
    <div className="glass flex flex-col rounded-[28px] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</p>
      <p className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{caption}</p>
      {percent == null ? (
        <p className="mt-5 text-xs text-gray-400">Rate limit for each minute.</p>
      ) : (
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-200/80">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
        </div>
      )}
    </div>
  );
}

function logClock(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: value, time: "" };
  return {
    day: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
      hourCycle: "h23",
    }),
  };
}

function statusTone(code: number) {
  if (code >= 500) return "text-[#eb2013]";
  if (code >= 400) return "text-[#ff6c37]";
  return "text-[#0cbb52]";
}

function requestPath(path: string, query: string) {
  return query ? `${path}?${query}` : path;
}

function pageHref(page: number) {
  return page <= 1 ? "/developers/usage" : `/developers/usage?page=${page}`;
}

function PagerLink({
  href,
  label,
}: {
  href: string | null;
  label: string;
}) {
  if (!href) {
    return (
      <span className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300">{label}</span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-white transition hover:bg-white"
    >
      {label}
    </Link>
  );
}

function LogsTable({ logs }: { logs: RequestLogPage }) {
  const pages = Math.max(1, Math.ceil(logs.total / logs.page_size));
  const start = logs.total === 0 ? 0 : (logs.page - 1) * logs.page_size + 1;
  const end = Math.min(logs.total, logs.page * logs.page_size);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Request logs</h2>
          <p className="mt-1 text-sm text-gray-500">
            {logs.total.toLocaleString("en-IN")} request{logs.total === 1 ? "" : "s"} from this account’s API keys.
          </p>
        </div>
        <p className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-gray-500 ring-1 ring-white">
          {start.toLocaleString("en-IN")}–{end.toLocaleString("en-IN")}
        </p>
      </div>
      {logs.logs.length === 0 ? (
        <div className="glass rounded-[28px] px-5 py-14 text-center">
          <p className="text-sm font-semibold text-gray-900">No requests yet</p>
          <p className="mt-1 text-sm text-gray-500">API-key calls will show up here, and the counts above come from these rows.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-[28px]">
          <ul className="divide-y divide-slate-200/60 md:hidden">
            {logs.logs.map((log) => {
              const clock = logClock(log.created_at);
              const path = requestPath(log.path, log.query_string);
              return (
                <li key={`${log.request_id}-${log.created_at}`} className="px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-xs font-bold tracking-wide ${methodBadgeClass(log.method)}`}>{log.method}</span>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums ${statusTone(log.status_code)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {log.status_code}
                    </span>
                  </div>
                  <p className="mt-2 truncate rounded-xl bg-white/70 px-3 py-2 font-mono text-xs text-gray-800" title={path}>
                    {path}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-500">
                    <span>
                      {clock.day} · {clock.time} UTC
                    </span>
                    <span className="tabular-nums">{log.latency_ms} ms</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-gray-400" title={log.request_id}>
                    {log.request_id}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[16%]" />
                <col className="w-[9%]" />
                <col className="w-[36%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  <th className="px-5 py-3.5 font-semibold">Time</th>
                  <th className="px-3 py-3.5 font-semibold">Method</th>
                  <th className="px-3 py-3.5 font-semibold">Path</th>
                  <th className="px-3 py-3.5 font-semibold">Status</th>
                  <th className="px-3 py-3.5 font-semibold">Latency</th>
                  <th className="px-5 py-3.5 font-semibold">Request ID</th>
                </tr>
              </thead>
              <tbody>
                {logs.logs.map((log) => {
                  const clock = logClock(log.created_at);
                  const path = requestPath(log.path, log.query_string);
                  return (
                    <tr key={`${log.request_id}-${log.created_at}`} className="border-t border-slate-200/60 transition hover:bg-white/50">
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <p className="font-medium text-gray-900">{clock.time}</p>
                        <p className="text-xs text-gray-400">{clock.day} UTC</p>
                      </td>
                      <td className={`px-3 py-3.5 text-xs font-bold tracking-wide ${methodBadgeClass(log.method)}`}>{log.method}</td>
                      <td className="px-3 py-3.5">
                        <p className="truncate rounded-xl bg-white/70 px-2.5 py-1.5 font-mono text-xs text-gray-800" title={path}>
                          {path}
                        </p>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-semibold tabular-nums ${statusTone(log.status_code)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {log.status_code}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5">
                        <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium tabular-nums text-gray-600">
                          {log.latency_ms} ms
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="truncate font-mono text-xs text-gray-400" title={log.request_id}>
                          {log.request_id}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-slate-200/60 px-4 py-3 sm:px-5">
            <p className="text-xs text-gray-500">
              Page {logs.page} of {pages}
            </p>
            <div className="flex gap-2">
              <PagerLink href={logs.page > 1 ? pageHref(logs.page - 1) : null} label="Previous" />
              <PagerLink href={logs.page < pages ? pageHref(logs.page + 1) : null} label="Next" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function UsageView({
  usage,
  logs,
  logsError,
}: {
  usage: AccountUsage;
  logs: RequestLogPage | null;
  logsError: string | null;
}) {
  const dailyPercent = meter(usage.daily_request_count, usage.daily_request_limit);
  const monthlyPercent = meter(usage.monthly_request_count, usage.monthly_request_limit);

  return (
    <article>
      <p className="text-sm font-semibold tracking-wide text-blue-600">Account</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">Usage</h1>
      <p className="mt-3 text-gray-600">Request counts for {usageDate(usage.date)}, UTC.</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <UsageCard
          label="Today"
          value={usage.daily_request_count.toLocaleString("en-IN")}
          caption={amount(usage.daily_request_limit, dailyPercent)}
          percent={dailyPercent}
        />
        <UsageCard
          label="This month"
          value={usage.monthly_request_count.toLocaleString("en-IN")}
          caption={amount(usage.monthly_request_limit, monthlyPercent)}
          percent={monthlyPercent}
        />
        <UsageCard
          label="Per minute"
          value={usage.requests_per_minute == null ? "∞" : usage.requests_per_minute.toLocaleString("en-IN")}
          caption={usage.requests_per_minute == null ? "No per-minute cap" : "requests each minute"}
          percent={null}
        />
      </section>
      {logs ? (
        <LogsTable logs={logs} />
      ) : (
        <div className="glass mt-10 rounded-[28px] px-5 py-10 text-center text-sm text-gray-500">
          {logsError ?? "Request logs could not be loaded."}
        </div>
      )}
    </article>
  );
}

export default async function UsagePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const next = page > 1 ? `/developers/usage?page=${page}` : "/developers/usage";
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!access) {
    redirect(refresh ? `/api/developers/continue?next=${encodeURIComponent(next)}` : "/developers/login");
  }

  let usage: AccountUsage;
  try {
    usage = await getUsage(access);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 401) {
      redirect(refresh ? `/api/developers/continue?next=${encodeURIComponent(next)}` : "/developers/login");
    }
    throw error;
  }

  let logs: RequestLogPage | null = null;
  let logsError: string | null = null;
  try {
    logs = await listLogs(access, page);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 401) {
      redirect(refresh ? `/api/developers/continue?next=${encodeURIComponent(next)}` : "/developers/login");
    }
    logsError =
      error instanceof PublicApiError && error.status === 404
        ? "Request logs are not available on the API this site is calling yet."
        : error instanceof PublicApiError
          ? error.message
          : "Request logs could not be loaded.";
  }

  return <UsageView usage={usage} logs={logs} logsError={logsError} />;
}

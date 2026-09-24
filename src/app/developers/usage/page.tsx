import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DocsFrame from "@/components/developers/DocsFrame";
import {
  ACCESS_COOKIE,
  PublicApiError,
  REFRESH_COOKIE,
  getUsage,
  type AccountUsage,
} from "@/lib/developers/public-api";

export const metadata: Metadata = {
  title: "Usage",
  description: "See how many Train Dekho API requests this account has used.",
};

function meter(count: number, limit: number | null) {
  if (limit == null || limit <= 0) return null;
  return Math.min(100, Math.round((count / limit) * 100));
}

function amount(count: number, limit: number | null) {
  if (limit == null) return `${count.toLocaleString("en-IN")} of unlimited`;
  return `${count.toLocaleString("en-IN")} of ${limit.toLocaleString("en-IN")}`;
}

function UsageCard({
  label,
  detail,
  percent,
}: {
  label: string;
  detail: string;
  percent: number | null;
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-gray-900">{detail}</p>
      {percent == null ? (
        <p className="mt-4 text-sm text-gray-500">No cap on this window.</p>
      ) : (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
        </div>
      )}
    </div>
  );
}

function UsageView({ usage }: { usage: AccountUsage }) {
  return (
    <article>
      <p className="text-sm font-semibold text-blue-600">Usage</p>
      <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Requests</h1>
      <p className="mt-3 text-gray-600">Counts for {usage.date}, in UTC.</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <UsageCard
          label="Today"
          detail={amount(usage.daily_request_count, usage.daily_request_limit)}
          percent={meter(usage.daily_request_count, usage.daily_request_limit)}
        />
        <UsageCard
          label="This month"
          detail={amount(usage.monthly_request_count, usage.monthly_request_limit)}
          percent={meter(usage.monthly_request_count, usage.monthly_request_limit)}
        />
        <UsageCard
          label="Per minute"
          detail={usage.requests_per_minute == null ? "Unlimited" : `${usage.requests_per_minute.toLocaleString("en-IN")} requests`}
          percent={null}
        />
      </section>
    </article>
  );
}

export default async function UsagePage() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!access) {
    redirect(refresh ? "/api/developers/continue?next=/developers/usage" : "/developers/login");
  }

  try {
    const usage = await getUsage(access);
    return (
      <DocsFrame>
        <UsageView usage={usage} />
      </DocsFrame>
    );
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 401) {
      redirect(refresh ? "/api/developers/continue?next=/developers/usage" : "/developers/login");
    }
    throw error;
  }
}

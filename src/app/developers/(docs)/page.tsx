import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GetApiKeyLink from "@/components/developers/GetApiKeyLink";
import { DEVELOPER_PLAN } from "@/lib/developers/catalog";
import { ACCESS_COOKIE, PublicApiError, REFRESH_COOKIE, getAccount } from "@/lib/developers/public-api";

export const metadata = {
  title: "Train API",
  description: "Start on the free Train Dekho plan. The Developer plan is ₹499.",
} satisfies Metadata;

const metrics = [DEVELOPER_PLAN.daily, DEVELOPER_PLAN.monthly, DEVELOPER_PLAN.perMinute].map((limit) => {
  const [value, unit] = limit.split(" requests");
  return { value, unit: `requests${unit}` };
});

export default async function DevelopersPage() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!access && refresh) {
    redirect("/api/developers/continue?next=/developers");
  }

  let planCode: string | null = null;
  if (access) {
    try {
      planCode = (await getAccount(access)).plan.code;
    } catch (error) {
      if (error instanceof PublicApiError && error.status === 401 && refresh) {
        redirect("/api/developers/continue?next=/developers");
      }
      if (!(error instanceof PublicApiError && error.status === 401)) throw error;
    }
  }

  const signedIn = planCode !== null;
  const onFree = planCode === "free";
  const onDeveloper = planCode === "developer";

  return (
    <article>
      <p className="text-sm font-semibold tracking-wide text-blue-600">{signedIn ? "Account" : "Get started"}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">Plans</h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">
        {onDeveloper
          ? "You are on the Developer plan."
          : onFree
            ? "You are on the Free plan. The Developer plan is ₹499, and checkout stays off until payments are connected."
            : "Start on the Free plan. The Developer plan is ₹499, and checkout stays off until payments are connected."}
      </p>

      <section className="mt-8 grid items-stretch gap-4 md:grid-cols-2">
        <div className={`flex flex-col rounded-[28px] border bg-white/45 p-6 ${onFree ? "border-blue-600 ring-2 ring-blue-600" : "border-white/80"}`}>
          <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ${onFree ? "bg-blue-600" : "bg-gray-900"}`}>
            {onFree ? "Current" : "Free"}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Free Plan</h2>
          <p className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900">₹0</p>
          <ul className="mt-6 flex-1 space-y-2 text-sm text-gray-600">
            <li>Read the API reference</li>
            <li>Create an account</li>
          </ul>
          {signedIn ? (
            onFree ? <p className="mt-6 text-sm font-semibold text-blue-700">Current plan</p> : null
          ) : (
            <div className="mt-6">
              <GetApiKeyLink className="rounded-xl bg-gray-900 px-5 hover:bg-gray-700" />
            </div>
          )}
        </div>

        <div className={`glass relative flex flex-col overflow-hidden rounded-[28px] p-6 ${onDeveloper ? "ring-2 ring-blue-600" : ""}`}>
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-blue-500/20 blur-2xl" />
          <span className="relative w-fit rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            {onDeveloper ? "Current" : "₹499"}
          </span>
          <h2 className="relative mt-4 text-3xl font-bold tracking-tight text-gray-900">{DEVELOPER_PLAN.name}</h2>
          <p className="relative mt-3 text-4xl font-extrabold tracking-tight text-gray-900">
            ₹499
          </p>
          <dl className="relative mt-6 grid flex-1 grid-cols-1 gap-3">
            {metrics.map((metric) => (
              <div key={metric.unit} className="flex items-baseline justify-between gap-3 rounded-2xl bg-white/75 px-3 py-3 ring-1 ring-white">
                <dt className="text-lg font-bold tracking-tight text-gray-900">{metric.value}</dt>
                <dd className="text-xs text-gray-500">{metric.unit}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            disabled
            className={`relative mt-6 inline-flex cursor-not-allowed items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${
              onDeveloper ? "bg-blue-50 text-blue-700" : "bg-gray-200 text-gray-500"
            }`}
          >
            {onDeveloper ? "Current plan" : "Upgrade"}
          </button>
        </div>
      </section>
    </article>
  );
}

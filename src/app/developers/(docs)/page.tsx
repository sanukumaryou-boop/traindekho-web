import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GetApiKeyLink from "@/components/developers/GetApiKeyLink";
import { API_PLANS, planIncluded } from "@/lib/developers/catalog";
import { ACCESS_COOKIE, PublicApiError, REFRESH_COOKIE, getAccount } from "@/lib/developers/public-api";

export const metadata = {
  title: "Train API",
  description: "Free, Basic, Startup, and Enterprise plans for the Train Dekho API.",
} satisfies Metadata;

export default async function DevelopersPage() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!access && refresh) {
    redirect("/api/developers/continue?next=/developers");
  }

  let planCode: string | null = null;
  let planName: string | null = null;
  if (access) {
    try {
      const account = await getAccount(access);
      planCode = account.plan.code;
      planName = account.plan.name;
    } catch (error) {
      if (error instanceof PublicApiError && error.status === 401 && refresh) {
        redirect("/api/developers/continue?next=/developers");
      }
      if (!(error instanceof PublicApiError && error.status === 401)) throw error;
    }
  }

  const signedIn = planCode !== null;
  const paidPlan = planCode === "basic" || planCode === "startup" || planCode === "growth";
  const selectedCode = signedIn ? (paidPlan ? planCode : "free") : null;
  const selectedName = API_PLANS.find((plan) => plan.code === selectedCode)?.name ?? planName;
  const visiblePlans = API_PLANS.filter((plan) => plan.code !== "growth");

  return (
    <article>
      <p className="text-sm font-semibold tracking-wide text-blue-600">{signedIn ? "Account" : "Get started"}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">Plans</h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">
        {signedIn ? `You are on the ${selectedName} plan.` : "New accounts start on the Free plan."}
      </p>

      <section className="mt-8 grid grid-cols-4 items-stretch gap-4">
        {visiblePlans.map((plan) => {
          const current = plan.code === selectedCode;
          const included = planIncluded(plan);
          return (
            <article
              key={plan.code}
              className={`relative flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border bg-white p-5 shadow-[0_18px_40px_rgba(0,46,97,0.08)] ${
                current ? "border-blue-600 ring-2 ring-blue-600/30" : "border-blue-100"
              }`}
            >
              <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full bg-blue-500/15 blur-2xl" />
              <div className="relative flex items-center justify-between gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{plan.name}</h2>
                {current ? (
                  <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="relative mt-3 text-[2rem] font-extrabold leading-none tracking-tight text-gray-950">
                {plan.price ?? "Let’s talk"}
              </p>
              <ul className="relative mt-5 flex flex-1 flex-col gap-2.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-gray-700">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                        <path d="M2.2 6.2 4.8 8.8 9.8 3.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {plan.contact && item === "Limits set for your traffic" ? (
                      <span>
                        Limits set for your traffic.{" "}
                        <a href={`mailto:${plan.contact}`} className="font-semibold text-blue-700 hover:underline">
                          {plan.contact}
                        </a>
                      </span>
                    ) : (
                      <span className={item.includes("requests /") ? "font-bold text-gray-950" : undefined}>{item}</span>
                    )}
                  </li>
                ))}
              </ul>
              {current ? (
                <p className="relative mt-4 flex h-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  Current plan
                </p>
              ) : plan.contact ? (
                <a
                  href={`mailto:${plan.contact}`}
                  className="relative mt-4 flex h-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Contact
                </a>
              ) : plan.code === "free" && !signedIn ? (
                <div className="relative mt-4">
                  <GetApiKeyLink className="h-10 w-full !rounded-full" />
                </div>
              ) : plan.code === "free" ? (
                <p className="relative mt-4 flex h-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                  Included
                </p>
              ) : (
                <button
                  type="button"
                  disabled
                  className="relative mt-4 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-400"
                >
                  Upgrade
                </button>
              )}
            </article>
          );
        })}
      </section>
    </article>
  );
}

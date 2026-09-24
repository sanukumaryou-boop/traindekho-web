import type { Metadata } from "next";
import DocsFrame from "@/components/developers/DocsFrame";
import GetApiKeyLink from "@/components/developers/GetApiKeyLink";
import { DEVELOPER_PLAN } from "@/lib/developers/catalog";

export const metadata: Metadata = {
  title: "Train API",
  description: "Start on the Train Dekho Developer plan. Upgrades open after payments are connected.",
};

const limits = [DEVELOPER_PLAN.daily, DEVELOPER_PLAN.monthly, DEVELOPER_PLAN.perMinute];

export default function DevelopersPage() {
  return (
    <DocsFrame>
      <article>
        <p className="text-sm font-semibold text-blue-600">Get started</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Plans</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-gray-600">
          New accounts start on the Developer plan. Higher limits will be available to purchase once payments are connected.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="glass flex flex-col rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Included</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">{DEVELOPER_PLAN.name}</h2>
            <ul className="mt-5 space-y-2 text-sm text-gray-700">
              {limits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
            <div className="mt-6">
              <GetApiKeyLink />
            </div>
          </div>

          <div className="glass flex flex-col rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Later</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Upgrade</h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              Higher daily, monthly, and per-minute limits. This stays off until payment is integrated.
            </p>
            <div className="mt-6">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500"
              >
                Upgrade
              </button>
            </div>
          </div>
        </section>
      </article>
    </DocsFrame>
  );
}

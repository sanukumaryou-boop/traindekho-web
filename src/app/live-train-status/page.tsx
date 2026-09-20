import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainSearch from "@/components/TrainSearch";
import TrainScheduleFAQ from "@/components/train-schedule/TrainScheduleFAQ";
import { LIVE_TRAIN_STATUS_INDEX_FAQ } from "@/lib/live-status-faq";
import { buildFaqPageJsonLd } from "@/lib/train-schedule-faq";

export const metadata: Metadata = {
  title: "Live Train Status",
  description:
    "Track live running status for any Indian Railways train — current location, delays, and station-wise actual times.",
  alternates: {
    canonical: "https://traindekho.live/live-train-status",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [buildFaqPageJsonLd(LIVE_TRAIN_STATUS_INDEX_FAQ)],
};

export default function LiveTrainStatusPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 font-medium">Live Train Status</li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-5">
            Live Train Status
          </h1>

          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6">
            <TrainSearch
              variant="page"
              hrefKind="live"
              submitLabel="Track Live"
              inputId="live-status-search"
            />
          </section>

          <section className="mt-8">
            <TrainScheduleFAQ items={LIVE_TRAIN_STATUS_INDEX_FAQ} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

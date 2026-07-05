import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainSearch from "@/components/TrainSearch";
import TrainScheduleActions from "@/components/train-schedule/TrainScheduleActions";
import TrainScheduleFAQ from "@/components/train-schedule/TrainScheduleFAQ";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";
import {
  buildFaqPageJsonLd,
  TRAIN_SCHEDULE_INDEX_FAQ,
} from "@/lib/train-schedule-faq";

export const metadata: Metadata = {
  title: "Train Schedule",
  description:
    "Look up the full station-wise schedule for any Indian Railways train by entering its train number.",
  alternates: {
    canonical: "https://traindekho.live/train-schedule",
  },
};

const POPULAR_TRAINS = [
  { no: "12951", name: "Rajdhani Express", route: "NDLS → MMCT" },
  { no: "12002", name: "Shatabdi Express", route: "NDLS → KOTA" },
  { no: "12301", name: "Rajdhani Express", route: "NDLS → HWH" },
  { no: "22439", name: "Vande Bharat", route: "NDLS → SHM" },
  { no: "12627", name: "Karnataka Express", route: "NDLS → SBC" },
  { no: "12952", name: "Rajdhani Express", route: "MMCT → NDLS" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [buildFaqPageJsonLd(TRAIN_SCHEDULE_INDEX_FAQ)],
};

export default function TrainScheduleSearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 font-medium">Train Schedule</li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-5">
            Train Schedule
          </h1>

          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <TrainSearch variant="page" />
            </div>

            <div className="border-t border-gray-100 bg-gray-50/60 px-5 sm:px-6 py-4 sm:py-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Popular trains
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {POPULAR_TRAINS.map((train) => (
                  <li key={train.no}>
                    <Link
                      href={getTrainScheduleHref(train.no)}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-blue-600 shrink-0">
                          {train.no}
                        </span>
                        <span className="text-sm text-gray-700 truncate group-hover:text-gray-900">
                          {train.name}
                        </span>
                      </div>
                      <ChevronIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-8">
            <TrainScheduleFAQ items={TRAIN_SCHEDULE_INDEX_FAQ} />
          </section>

          <div className="mt-6">
            <TrainScheduleActions showSearch={false} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

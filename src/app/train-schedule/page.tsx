import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainSearch from "@/components/TrainSearch";

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

export default function TrainScheduleSearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 font-medium">Train Schedule</li>
            </ol>
          </nav>

          <header className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-5">
              <ScheduleIcon className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Train Schedule
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mx-auto">
              Enter a train number to see its full route, station timings, running
              days, and distance.
            </p>
          </header>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
            <TrainSearch variant="page" />

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-1">Popular trains</h2>
              <p className="text-sm text-gray-500 mb-4">
                Tap a train to view its schedule instantly.
              </p>
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {POPULAR_TRAINS.map((train) => (
                  <li key={train.no}>
                    <Link
                      href={`/train-schedule/${train.no}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 bg-white hover:bg-blue-50/60 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-base font-bold text-blue-600 group-hover:text-blue-700">
                          {train.no}
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {train.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-sm text-gray-500">
                        <span className="hidden sm:inline">{train.route}</span>
                        <ChevronIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Enter train number",
                text: "Type the 4–5 digit number from your ticket or enquiry.",
              },
              {
                step: "2",
                title: "View full route",
                text: "See every halt with arrival, departure, and platform info.",
              },
              {
                step: "3",
                title: "Plan your journey",
                text: "Check running days, distance, and total travel time.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:text-left"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold mb-3">
                  {item.step}
                </span>
                <h2 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
        fill="currentColor"
      />
    </svg>
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

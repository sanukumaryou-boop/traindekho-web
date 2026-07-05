import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveStatusSearchForm from "@/components/live-status/LiveStatusSearchForm";
import TrainScheduleActions from "@/components/train-schedule/TrainScheduleActions";
import { findTrainByNumber } from "@/lib/search-trains";
import {
  formatLiveStatusApiDate,
  isValidApiDate,
} from "@/lib/live-status-date";
import { getLiveTrainStatusHrefWithDate } from "@/lib/train-schedule-href";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Train Status",
  description:
    "Track live running status for any Indian Railways train — current location, delays, and station-wise actual times.",
  alternates: {
    canonical: "https://traindekho.live/live-train-status",
  },
};

interface PageProps {
  searchParams: Promise<{
    no?: string;
    train?: string;
    date?: string;
  }>;
}

export default async function LiveTrainStatusPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const trainNo = (params.no ?? params.train ?? "").replace(/\D/g, "");
  const journeyDate =
    params.date && isValidApiDate(params.date)
      ? params.date
      : formatLiveStatusApiDate();

  if (trainNo) {
    const train = findTrainByNumber(trainNo);
    permanentRedirect(
      train
        ? getLiveTrainStatusHrefWithDate(train, journeyDate)
        : getLiveTrainStatusHrefWithDate(trainNo, journeyDate),
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24 bg-gray-50/50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 font-medium">Live Train Status</li>
            </ol>
          </nav>

          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Live Train Status
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter a train number and journey date to see real-time running
              status.
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
            <LiveStatusSearchForm initialDate={journeyDate} />
          </section>

          <section className="mb-8 rounded-2xl border border-dashed border-gray-200 bg-white/70 p-8 text-center">
            <p className="text-sm text-gray-500">
              Search for a train above to see its live running status.
            </p>
          </section>

          <TrainScheduleActions showSearch={false} />
        </div>
      </main>
      <Footer />
    </>
  );
}

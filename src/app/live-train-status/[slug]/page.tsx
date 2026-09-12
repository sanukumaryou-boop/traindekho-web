import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveStatusResults from "@/components/live-status/LiveStatusResults";
import TrainSearch from "@/components/TrainSearch";
import { fetchTrainLiveStatus } from "@/lib/api/live-status";
import { titleCase } from "@/lib/format";
import {
  formatLiveStatusApiDate,
  isValidApiDate,
} from "@/lib/live-status-date";
import { findTrainByNumber } from "@/lib/search-trains";
import { parseTrainNumberFromSlug } from "@/lib/train-slug";
import {
  getLiveTrainStatusHref,
  getLiveTrainStatusHrefWithDate,
} from "@/lib/train-schedule-href";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}

function resolveJourneyDate(dateParam?: string) {
  if (dateParam && isValidApiDate(dateParam)) return dateParam;
  return formatLiveStatusApiDate();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trainNo = parseTrainNumberFromSlug(slug);
  const local = findTrainByNumber(trainNo);
  const name = local?.train_name ? titleCase(local.train_name) : "";
  const title = name
    ? `${trainNo} ${name} Live Status`
    : `${trainNo} Live Train Status`;
  const description = name
    ? `Track live running status of ${trainNo} ${name} — current location, delay, and station-wise actual times.`
    : `Track live running status of train ${trainNo} — current location, delay, and station-wise actual times.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://traindekho.live${getLiveTrainStatusHref(trainNo)}`,
    },
  };
}

export default async function LiveTrainStatusSlugPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { date: dateParam } = await searchParams;
  const trainNo = parseTrainNumberFromSlug(slug);
  const journeyDate = resolveJourneyDate(dateParam);
  const today = formatLiveStatusApiDate();
  const dateForHref = journeyDate === today ? undefined : journeyDate;

  if (/^\d+$/.test(slug)) {
    const local = findTrainByNumber(slug);
    if (local) {
      permanentRedirect(getLiveTrainStatusHrefWithDate(local, dateForHref));
    }
  }

  const result = await fetchTrainLiveStatus(trainNo, journeyDate);

  return (
    <>
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
              <li>
                <Link
                  href="/live-train-status"
                  className="hover:text-gray-900 transition-colors"
                >
                  Live Train Status
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 font-medium">{trainNo}</li>
            </ol>
          </nav>

          {result.ok ? (
            <LiveStatusResults
              initialData={result.data}
              trainNo={trainNo}
              journeyDate={journeyDate}
            />
          ) : (
            <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-3">
                Live status for {trainNo}
              </h1>
              <p
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {result.message}
              </p>
              <TrainSearch
                variant="page"
                hrefKind="live"
                submitLabel="Track Live"
                inputId="live-status-retry"
              />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

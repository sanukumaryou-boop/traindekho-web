import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveStatusResults from "@/components/live-status/LiveStatusResults";
import LiveStatusSearchForm from "@/components/live-status/LiveStatusSearchForm";
import { fetchTrainLiveStatus } from "@/lib/api/live-status";
import { fetchTrainByNumber } from "@/lib/api/trains";
import { titleCase } from "@/lib/format";
import {
  formatLiveStatusApiDate,
  isValidApiDate,
} from "@/lib/live-status-date";
import { findTrainByNumber } from "@/lib/search-trains";
import { buildTrainSlug, parseTrainNumberFromSlug } from "@/lib/train-slug";
import {
  getLiveTrainStatusHrefWithDate,
} from "@/lib/train-schedule-href";
import type { Train } from "@/lib/types/train";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}

const getTrain = cache(async (slug: string): Promise<Train | null> => {
  const trainNo = parseTrainNumberFromSlug(slug);
  return fetchTrainByNumber(trainNo);
});

function buildMetadata(train: Train, slug: string): Metadata {
  const title = `${train.train_no} ${titleCase(train.train_name)} Live Running Status`;
  const description = `Track ${train.train_no} ${train.train_name} live running status from ${train.source} (${train.source_code}) to ${train.destination} (${train.destination_code}). Current location, delay, and station-wise actual times.`;
  const canonical = `https://traindekho.live/live-train-status/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${train.train_no} live status`,
      `${train.train_name} running status`,
      `${train.train_no} train running status`,
      `${train.source_code} to ${train.destination_code} live train`,
      "Indian Railways live train status",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${title} | Train Dekho`,
      description,
      url: canonical,
      type: "article",
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const train = await getTrain(slug);
  if (!train) {
    return { title: "Live Train Status Not Found" };
  }
  return buildMetadata(train, buildTrainSlug(train));
}

export default async function LiveTrainStatusSlugPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  if (/^\d+$/.test(slug)) {
    const local = findTrainByNumber(slug);
    if (local) {
      const date =
        query.date && isValidApiDate(query.date) ? query.date : undefined;
      permanentRedirect(getLiveTrainStatusHrefWithDate(local, date));
    }
  }

  const train = await getTrain(slug);
  if (!train) notFound();

  const canonicalSlug = buildTrainSlug(train);
  if (slug !== canonicalSlug) {
    const date =
      query.date && isValidApiDate(query.date) ? query.date : undefined;
    permanentRedirect(getLiveTrainStatusHrefWithDate(train, date));
  }

  const trainNo = String(train.train_no);
  const journeyDate =
    query.date && isValidApiDate(query.date)
      ? query.date
      : formatLiveStatusApiDate();

  const result = await fetchTrainLiveStatus(trainNo, journeyDate);

  if (!result.ok) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-24 bg-gray-50/50 min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/live-train-status"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Live Train Status
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-700 font-medium">{train.train_no}</li>
              </ol>
            </nav>

            <section
              className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6"
              role="alert"
            >
              <h1 className="text-base font-bold text-red-900 mb-1">
                Could not load live status
              </h1>
              <p className="text-sm text-red-800">{result.message}</p>
              <div className="mt-4">
                <LiveStatusSearchForm
                  initialTrainNo={trainNo}
                  initialDate={journeyDate}
                />
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://traindekho.live",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Live Train Status",
                item: "https://traindekho.live/live-train-status",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${train.train_no} ${train.train_name}`,
                item: `https://traindekho.live/live-train-status/${canonicalSlug}`,
              },
            ],
          }),
        }}
      />
      <Navbar />
      <main className="pt-20 pb-24 bg-gray-50/50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/live-train-status"
                  className="hover:text-blue-600 transition-colors"
                >
                  Live Train Status
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 font-medium">{train.train_no}</li>
            </ol>
          </nav>

          <LiveStatusResults
            initialData={result.data}
            trainNo={trainNo}
            journeyDate={journeyDate}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

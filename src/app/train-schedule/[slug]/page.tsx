import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScheduleTable, {
  TrainSummary,
} from "@/components/train-schedule/ScheduleTable";
import RouteOverview from "@/components/train-schedule/RouteOverview";
import RunningDays from "@/components/train-schedule/RunningDays";
import TrainSearch from "@/components/TrainSearch";
import { fetchTrainByNumber } from "@/lib/api/trains";
import { discoverTrainSlugsForBuild } from "@/lib/build-trains";
import {
  formatDuration,
  formatRunningDays,
  formatScheduleTime,
  titleCase,
} from "@/lib/format";
import { buildTrainSlug, parseTrainNumberFromSlug } from "@/lib/train-slug";
import type { Train } from "@/lib/types/train";

export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await discoverTrainSlugsForBuild();
  return slugs.map((slug) => ({ slug }));
}

async function getTrain(slug: string): Promise<Train | null> {
  const trainNo = parseTrainNumberFromSlug(slug);
  return fetchTrainByNumber(trainNo);
}

function buildMetadata(train: Train): Metadata {
  const title = `${train.train_no} ${titleCase(train.train_name)} Schedule`;
  const description = `${train.train_no} ${train.train_name} runs from ${train.source} (${train.source_code}) to ${train.destination} (${train.destination_code}). Check full station-wise schedule, arrival & departure times, distance, and running days.`;
  const canonicalSlug = buildTrainSlug(train);

  return {
    title,
    description,
    keywords: [
      `${train.train_no} schedule`,
      `${train.train_name} schedule`,
      `${train.train_no} train time table`,
      `${train.source_code} to ${train.destination_code} train`,
      `${train.train_no} route`,
      "Indian Railways train schedule",
      "train time table India",
    ],
    alternates: {
      canonical: `https://traindekho.live/train-schedule/${canonicalSlug}`,
    },
    openGraph: {
      title: `${title} | Train Dekho`,
      description,
      url: `https://traindekho.live/train-schedule/${canonicalSlug}`,
      type: "article",
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const train = await getTrain(slug);
  if (!train) {
    return { title: "Train Schedule Not Found" };
  }
  return buildMetadata(train);
}

function buildJsonLd(train: Train, slug: string) {
  const firstStop = train.schedule[0];
  const lastStop = train.schedule[train.schedule.length - 1];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            name: "Train Schedule",
            item: "https://traindekho.live/train-schedule",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${train.train_no} ${train.train_name}`,
            item: `https://traindekho.live/train-schedule/${slug}`,
          },
        ],
      },
      {
        "@type": "TrainTrip",
        name: `${train.train_no} ${train.train_name}`,
        trainNumber: String(train.train_no),
        provider: {
          "@type": "Organization",
          name: "Indian Railways",
        },
        departureStation: {
          "@type": "TrainStation",
          name: firstStop?.stationName ?? train.source,
          identifier: train.source_code,
        },
        arrivalStation: {
          "@type": "TrainStation",
          name: lastStop?.stationName ?? train.destination,
          identifier: train.destination_code,
        },
        departureTime: formatScheduleTime(
          firstStop?.scheduledDepartureTime ?? "",
        ),
        arrivalTime: formatScheduleTime(
          lastStop?.scheduledArrivalTime ?? "",
        ),
        itinerary: train.schedule.map((stop) => ({
          "@type": "TrainStation",
          name: stop.stationName,
          identifier: stop.stationCode,
        })),
      },
    ],
  };
}

export default async function TrainSchedulePage({ params }: PageProps) {
  const { slug } = await params;
  const train = await getTrain(slug);

  if (!train) notFound();

  const canonicalSlug = buildTrainSlug(train);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/train-schedule/${canonicalSlug}`);
  }

  const firstStop = train.schedule[0];
  const lastStop = train.schedule[train.schedule.length - 1];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(train, canonicalSlug)),
        }}
      />
      <Navbar />
      <main className="pt-24 pb-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/train-schedule"
                  className="hover:text-blue-600 transition-colors"
                >
                  Train Schedule
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 font-medium">{train.train_no}</li>
            </ol>
          </nav>

          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-blue-600 text-white text-xs font-bold px-3 py-1">
                {train.train_no}
              </span>
              <span className="inline-flex items-center rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1">
                {train.train_type}
              </span>
              <span className="inline-flex items-center rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1">
                {formatRunningDays(train.days_of_run)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              {titleCase(train.train_name)} Schedule
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-500">
                {formatDuration(train.total_duration)} · {train.total_distance} ·{" "}
                {train.total_number_of_stops} stops
              </p>
              <RunningDays days={train.days_of_run} />
            </div>
          </header>

          <section className="mb-8">
            <RouteOverview train={train} />
          </section>

          <section className="mb-8">
            <TrainSummary train={train} />
          </section>

          <section className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Station-wise Schedule
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {firstStop?.stationName} → {lastStop?.stationName} ·{" "}
                  {train.schedule.length} stations
                </p>
              </div>
            </div>
            <ScheduleTable schedule={train.schedule} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Search another train
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Look up a different train number without leaving this page.
              </p>
              <TrainSearch />
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Track {train.train_no} live on Train Dekho
              </h2>
              <p className="text-gray-600 text-sm mb-5">
                Get real-time running status, delay alerts, and platform updates
                for {train.train_name} on the Train Dekho Android app.
              </p>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                Download Train Dekho
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteSearchForm from "@/components/route-search/RouteSearchForm";
import RouteSearchTabs from "@/components/route-search/RouteSearchTabs";
import TrainScheduleActions from "@/components/train-schedule/TrainScheduleActions";
import { fetchTrainsBetween } from "@/lib/api/trains-between";
import { titleCase } from "@/lib/format";
import {
  buildRouteSearchSlug,
  parseRouteSearchSlug,
} from "@/lib/route-search-slug";
import { findStationByCode } from "@/lib/search-stations";

function getStationName(code: string): string {
  const station = findStationByCode(code);
  return station ? titleCase(station.station_name) : code;
}

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = parseRouteSearchSlug(slug);
  if (!route) {
    return { title: "Route Not Found" };
  }

  const { from: fromCode, to: toCode } = route;
  const fromName = getStationName(fromCode);
  const toName = getStationName(toCode);
  const title = `Trains from ${fromName} to ${toName}`;
  const description = `Find direct and connecting trains from ${fromName} to ${toName}. Compare departure times, travel duration, running days, and classes.`;
  const canonicalSlug = buildRouteSearchSlug(fromCode, toCode);

  return {
    title,
    description,
    alternates: {
      canonical: `https://traindekho.live/search-route/${canonicalSlug}`,
    },
    openGraph: {
      title: `${title} | Train Dekho`,
      description,
      url: `https://traindekho.live/search-route/${canonicalSlug}`,
    },
  };
}

export default async function SearchRouteResultsPage({ params }: PageProps) {
  const { slug } = await params;
  const route = parseRouteSearchSlug(slug);
  if (!route) notFound();

  const { from: fromCode, to: toCode } = route;
  const fromName = getStationName(fromCode);
  const toName = getStationName(toCode);
  const results = await fetchTrainsBetween(fromCode, toCode);

  if (!results) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-16 min-h-screen bg-gray-50/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <RoutePageHeader fromName={fromName} toName={toName} />
            <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="p-5 sm:p-6">
                <RouteSearchForm initialFrom={fromCode} initialTo={toCode} />
              </div>
            </section>
            <p
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              Could not load trains for {fromName} → {toName}. Please try again.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalTrains =
    results.direct_trains.length + results.alternative_trains.length;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RoutePageHeader fromName={fromName} toName={toName} />

          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <RouteSearchForm initialFrom={fromCode} initialTo={toCode} />
            </div>
          </section>

          {totalTrains === 0 ? (
            <p className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              No trains found between {fromName} and {toName}.
            </p>
          ) : (
            <>
              <RouteSearchTabs
                directTrains={results.direct_trains}
                alternativeTrains={results.alternative_trains}
              />
              <div className="mt-6">
                <TrainScheduleActions
                  showSearch={false}
                  description={`Search trains from ${fromName} to ${toName} with live tracking, delay alerts & more on Android.`}
                />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function RoutePageHeader({
  fromName,
  toName,
}: {
  fromName: string;
  toName: string;
}) {
  return (
    <>
      <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/search-route" className="hover:text-blue-600 transition-colors">
              Search Route
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700 font-medium">
            {fromName} to {toName}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-5">
        {fromName} → {toName}
      </h1>
    </>
  );
}

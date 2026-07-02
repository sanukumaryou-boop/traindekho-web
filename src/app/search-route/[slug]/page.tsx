import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteSearchForm from "@/components/route-search/RouteSearchForm";
import RouteSearchTabs from "@/components/route-search/RouteSearchTabs";
import { fetchTrainsBetween } from "@/lib/api/trains-between";
import {
  buildRouteSearchSlug,
  parseRouteSearchSlug,
} from "@/lib/route-search-slug";

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

  const { from, to } = route;
  const title = `Trains from ${from} to ${to}`;
  const description = `Find direct and connecting trains from ${from} to ${to}. Compare departure times, travel duration, running days, and classes.`;
  const canonicalSlug = buildRouteSearchSlug(from, to);

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
  const results = await fetchTrainsBetween(fromCode, toCode);

  if (!results) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <RoutePageHeader fromCode={fromCode} toCode={toCode} />
            <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="p-5 sm:p-6">
                <RouteSearchForm initialFrom={fromCode} initialTo={toCode} />
              </div>
            </section>
            <p
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              Could not load trains for {fromCode} → {toCode}. Please try again.
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
      <main className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RoutePageHeader fromCode={fromCode} toCode={toCode} />

          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <RouteSearchForm initialFrom={fromCode} initialTo={toCode} />
            </div>
          </section>

          {totalTrains === 0 ? (
            <p className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              No trains found between {fromCode} and {toCode}.
            </p>
          ) : (
            <RouteSearchTabs
              directTrains={results.direct_trains}
              alternativeTrains={results.alternative_trains}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function RoutePageHeader({
  fromCode,
  toCode,
}: {
  fromCode: string;
  toCode: string;
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
            {fromCode} to {toCode}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-5">
        {fromCode} → {toCode}
      </h1>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteSearchForm from "@/components/route-search/RouteSearchForm";
import TrainScheduleActions from "@/components/train-schedule/TrainScheduleActions";

export const metadata: Metadata = {
  title: "Search Route",
  description:
    "Search trains between any two Indian Railways stations. Find direct trains and alternative routes with boarding stations, timings, and running days.",
  alternates: {
    canonical: "https://traindekho.live/search-route",
  },
};

export default function SearchRoutePage() {
  return (
    <>
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
              <li className="text-gray-700 font-medium">Search Route</li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-5">
            Search Route
          </h1>

          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <RouteSearchForm />
            </div>
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

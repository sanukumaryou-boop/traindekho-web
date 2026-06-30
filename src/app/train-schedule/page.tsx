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

export default function TrainScheduleSearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Train Schedule
            </h1>
            <p className="text-lg text-gray-500">
              Enter a train number to see its full route, arrival and departure
              times, and running days.
            </p>
          </header>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <TrainSearch />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

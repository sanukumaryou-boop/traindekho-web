import Link from "next/link";
import { GOOGLE_PLAY_APP_URL } from "@/lib/google-play-href";

type ComingSoonProps = {
  title: string;
  breadcrumb: string;
};

export default function ComingSoon({ title, breadcrumb }: ComingSoonProps) {
  return (
    <main className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700 font-medium">{breadcrumb}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Coming Soon
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
            {title}
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Available now in the Train Dekho Android app.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <a
              href={GOOGLE_PLAY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Download the App
            </a>
            <Link
              href="/train-schedule"
              className="inline-flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Train Schedule
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

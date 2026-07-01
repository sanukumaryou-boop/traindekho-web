import Link from "next/link";

type ComingSoonProps = {
  title: string;
  description: string;
  breadcrumb: string;
};

export default function ComingSoon({
  title,
  description,
  breadcrumb,
}: ComingSoonProps) {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="text-sm text-gray-500 mb-6 text-left" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">{breadcrumb}</li>
          </ol>
        </nav>

        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Coming Soon
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">{description}</p>

        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 text-left">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            We&apos;re building this feature for the website. For now, you can use
            it in the Train Dekho Android app — or browse train schedules on the
            web.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Get the App
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

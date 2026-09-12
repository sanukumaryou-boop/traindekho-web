import Link from "next/link";
import AppInstallGate from "@/components/AppInstallGate";
import PlayStoreButton from "@/components/PlayStoreButton";

type ComingSoonProps = {
  title: string;
  breadcrumb: string;
  trainNo?: string;
};

export default function ComingSoon({ title, breadcrumb, trainNo }: ComingSoonProps) {
  return (
    <main className="pt-20 pb-16 min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700 font-medium">{breadcrumb}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
          {trainNo ? (
            <AppInstallGate kind="live" trainNo={trainNo} />
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Coming Soon
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                {title}
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Live running status is available now in the Train Dekho Android
                app.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <PlayStoreButton
                  placement="coming_soon"
                  medium="web"
                  variant="primary"
                  label="Download the App"
                  className="!px-5 !py-2.5 !text-sm"
                />
                <Link
                  href="/train-schedule"
                  className="inline-flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  Train Schedule
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

import TrainSearch from "@/components/TrainSearch";

type TrainScheduleActionsProps = {
  showSearch?: boolean;
  trainNo?: number;
};

export default function TrainScheduleActions({
  showSearch = true,
  trainNo,
}: TrainScheduleActionsProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 ${showSearch ? "lg:grid-cols-2" : ""}`}
    >
      {showSearch && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Check other trains
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Search by train number or name.
          </p>
          <TrainSearch />
        </section>
      )}

      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/30 p-5 sm:p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Download the app
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {trainNo
            ? `Live tracking, delay alerts & more for train ${trainNo}.`
            : "Live train tracking, route search & delay alerts on Android."}
        </p>
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
        >
          <PlayStoreIcon className="w-4 h-4" />
          Get it on Google Play
        </a>
      </section>
    </div>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
      <path fill="#4285F4" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" />
      <path fill="#FBBC04" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c17.1-9.8 17.1-35.1-.1-44.9z" />
      <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

import Link from "next/link";
import { titleCase } from "@/lib/format";
import { getRelatedPremiumTrains } from "@/lib/related-trains";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";

type RelatedTrainsProps = {
  trainNo: number;
  trainType: string;
};

export default function RelatedTrains({
  trainNo,
  trainType,
}: RelatedTrainsProps) {
  const result = getRelatedPremiumTrains(trainNo, trainType);
  if (!result || result.trains.length === 0) return null;

  const { category, trains } = result;
  const title =
    category === "Rajdhani"
      ? "Other Rajdhani Express trains"
      : "Other Vande Bharat trains";

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-500 shrink-0">
          {trains.length} trains
        </span>
      </div>
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm p-3 sm:p-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[28rem] overflow-y-auto">
          {trains.map((train) => (
            <li key={train.train_no}>
              <Link
                href={getTrainScheduleHref(train)}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/40 px-3.5 py-2.5 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-blue-600 shrink-0">
                    {train.train_no}
                  </span>
                  <span className="text-sm text-gray-700 truncate group-hover:text-gray-900">
                    {titleCase(train.train_name)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {train.source_code && train.destination_code && (
                    <span className="hidden sm:inline text-xs text-gray-500">
                      {train.source_code} → {train.destination_code}
                    </span>
                  )}
                  <ChevronIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

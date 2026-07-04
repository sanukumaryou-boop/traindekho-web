import Link from "next/link";
import { titleCase } from "@/lib/format";
import { getRouteSearchHref } from "@/lib/route-search-slug";

type OtherTrainsOnRouteProps = {
  sourceCode: string;
  destinationCode: string;
  sourceName: string;
  destinationName: string;
};

export default function OtherTrainsOnRoute({
  sourceCode,
  destinationCode,
  sourceName,
  destinationName,
}: OtherTrainsOnRouteProps) {
  const fromName = titleCase(sourceName);
  const toName = titleCase(destinationName);

  return (
    <section className="mb-8">
      <Link
        href={getRouteSearchHref(sourceCode, destinationCode)}
        className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white shadow-sm px-4 py-4 sm:px-5 hover:border-blue-200 hover:bg-blue-50/40 transition-colors group"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
            Other trains from {fromName} to {toName}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            View all direct trains on this route
          </p>
        </div>
        <ChevronIcon className="w-5 h-5 shrink-0 text-gray-300 group-hover:text-blue-500" />
      </Link>
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

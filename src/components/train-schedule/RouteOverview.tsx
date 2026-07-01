import { formatDuration, formatScheduleTime } from "@/lib/format";
import type { Train } from "@/lib/types/train";

export default function RouteOverview({ train }: { train: Train }) {
  const firstStop = train.schedule[0];
  const lastStop = train.schedule[train.schedule.length - 1];

  const fromName = firstStop?.stationName ?? train.source;
  const toName = lastStop?.stationName ?? train.destination;
  const departure = formatScheduleTime(firstStop?.scheduledDepartureTime ?? "—");
  const arrival = formatScheduleTime(lastStop?.scheduledArrivalTime ?? "—");
  const duration = formatDuration(train.total_duration);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-stretch gap-2 sm:gap-4 lg:gap-6">
          <StationCard
            variant="origin"
            label="From"
            name={fromName}
            code={train.source_code}
            timeLabel="Departure"
            time={departure}
          />

          <RouteConnector
            duration={duration}
            distance={train.total_distance}
            stops={train.total_number_of_stops}
          />

          <StationCard
            variant="destination"
            label="To"
            name={toName}
            code={train.destination_code}
            timeLabel="Arrival"
            time={arrival}
            align="right"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/80 divide-x divide-gray-100 text-center text-xs sm:text-sm">
        <MetaStat label="Duration" value={duration} />
        <MetaStat label="Distance" value={train.total_distance} />
        <MetaStat label="Stops" value={String(train.total_number_of_stops)} />
      </div>
    </div>
  );
}

function StationCard({
  variant,
  label,
  name,
  code,
  timeLabel,
  time,
  align = "left",
}: {
  variant: "origin" | "destination";
  label: string;
  name: string;
  code: string;
  timeLabel: string;
  time: string;
  align?: "left" | "right";
}) {
  const isOrigin = variant === "origin";
  const alignRight = align === "right";

  return (
    <div
      className={`flex-1 min-w-0 rounded-xl border p-3 sm:p-4 lg:p-5 ${
        isOrigin
          ? "bg-green-50/70 border-green-100"
          : "bg-blue-50/70 border-blue-100"
      } ${alignRight ? "text-right" : "text-left"}`}
    >
      <p
        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 ${
          isOrigin ? "text-green-700" : "text-blue-700"
        }`}
      >
        {label}
      </p>

      <p
        className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-snug line-clamp-2"
        title={name}
      >
        {name}
      </p>

      <p
        className={`mt-1 font-mono text-xs sm:text-sm font-bold ${
          isOrigin ? "text-green-600" : "text-blue-600"
        }`}
      >
        {code}
      </p>

      <div
        className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t flex flex-col w-full ${
          isOrigin ? "border-green-100" : "border-blue-100"
        } ${alignRight ? "items-end" : "items-start"}`}
      >
        <span className="text-[10px] sm:text-xs text-gray-500">{timeLabel}</span>
        <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 tabular-nums">
          {time}
        </span>
      </div>
    </div>
  );
}

function RouteConnector({
  duration,
  distance,
  stops,
}: {
  duration: string;
  distance: string;
  stops: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-20 lg:w-28 self-center py-1">
      <div className="hidden lg:flex items-center w-full gap-1 mb-3">
        <div className="flex-1 border-t-2 border-dashed border-blue-200" />
        <div className="rounded-full bg-blue-600 p-2 text-white shadow-sm">
          <TrainIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 border-t-2 border-dashed border-blue-200" />
      </div>

      <div className="flex lg:hidden items-center gap-0.5 sm:gap-1 w-full mb-1">
        <div className="flex-1 border-t-2 border-dashed border-blue-200 min-w-2" />
        <div className="rounded-full bg-blue-600 p-1.5 sm:p-2 text-white shadow-sm shrink-0">
          <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="flex-1 border-t-2 border-dashed border-blue-200 min-w-2" />
      </div>

      <p className="mt-2 lg:mt-0 text-[10px] sm:text-xs lg:text-sm font-bold text-blue-600 text-center whitespace-nowrap">
        {duration}
      </p>

      <p className="hidden sm:block lg:hidden mt-1 text-[10px] text-gray-500 text-center leading-tight">
        {distance}
      </p>

      <p className="hidden lg:block mt-2 text-xs text-gray-500 text-center leading-snug">
        {distance}
        <br />
        {stops} stops
      </p>
    </div>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-3 sm:py-3.5">
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-0.5 font-bold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}

function TrainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 16.5V19h1v2h2v-1h10v1h2v-2h1v-2.5l-1.5-4.5h-13L4 16.5zm2.5-7c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5 5.67 9 6.5 9zm11 0c.83 0 1.5-.67 1.5-1.5S18.33 6 17.5 6 16 6.67 16 7.5 16.67 9 17.5 9zM9 11h6V9H9v2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

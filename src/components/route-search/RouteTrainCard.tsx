import Link from "next/link";
import RouteTrainCardActions from "@/components/route-search/RouteTrainCardActions";
import { formatRunningDays, titleCase } from "@/lib/format";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";
import type {
  AlternativeRouteTrain,
  DirectRouteTrain,
  RouteStationInfo,
} from "@/lib/types/route-search";
import {
  getAlightStation,
  getBoardStation,
  getRouteDisplayNames,
  usesAlternativeBoarding,
  usesAlternativeDestination,
} from "@/lib/types/route-search";

type RouteTrainCardProps = {
  train: DirectRouteTrain | AlternativeRouteTrain;
  variant: "direct" | "alternative";
};

export default function RouteTrainCard({ train, variant }: RouteTrainCardProps) {
  const boardStation = getBoardStation(train, variant);
  const alightStation = getAlightStation(train, variant);
  const routeDisplay = getRouteDisplayNames(train, boardStation, alightStation);
  const isAlternative = variant === "alternative";
  const altTrain = isAlternative ? (train as AlternativeRouteTrain) : null;

  const boardLabel =
    isAlternative && altTrain && usesAlternativeBoarding(altTrain)
      ? "Board at"
      : "Departs";
  const alightLabel =
    isAlternative && altTrain && usesAlternativeDestination(altTrain)
      ? "Alight at"
      : "Arrives";

  const boardApproxDistance =
    isAlternative && altTrain && usesAlternativeBoarding(altTrain)
      ? altTrain.alternative_from_station?.approx_distance
      : undefined;
  const alightApproxDistance =
    isAlternative && altTrain && usesAlternativeDestination(altTrain)
      ? altTrain.alternative_to_station?.approx_distance
      : undefined;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 hover:border-blue-200 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={getTrainScheduleHref(train.train_no)}
              className="font-mono text-base font-bold text-blue-600 hover:text-blue-700"
            >
              {train.train_no}
            </Link>
            <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600 border border-gray-200">
              {train.train_type}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
            <Link
              href={getTrainScheduleHref(train.train_no)}
              className="hover:text-blue-700"
            >
              {titleCase(train.train_name)}
            </Link>
          </h3>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-gray-900 leading-tight">
            {train.scheduled_travel_time}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 whitespace-nowrap">
            {Math.round(train.distance_between_stations)} km · {train.stops_between_stations}{" "}
            {train.stops_between_stations === 1 ? "stop" : "stops"}
          </p>
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3 text-xs">
        <p className="min-w-0 text-gray-500">
          {titleCase(routeDisplay.from)} to {titleCase(routeDisplay.to)}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0 sm:justify-end">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700 border border-blue-100">
            {formatRunningDays(train.days_of_run)}
          </span>
          {train.classes.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 font-medium text-amber-800 border border-amber-100">
              {train.classes.join(", ")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 sm:hidden rounded-lg border border-gray-100 px-3.5 py-3">
        <div className="grid grid-cols-2 gap-3">
          <StationTiming
            compact
            label={boardLabel}
            station={boardStation}
            time={boardStation.scheduled_departure_time}
            timeLabel="Departure"
            approxDistance={boardApproxDistance}
          />
          <StationTiming
            compact
            label={alightLabel}
            station={alightStation}
            time={alightStation.scheduled_arrival_time}
            timeLabel="Arrival"
            approxDistance={alightApproxDistance}
            className="border-l border-gray-100 pl-3"
          />
        </div>
      </div>

      <div className="mt-4 hidden sm:grid sm:grid-cols-2 gap-3">
        <StationTiming
          label={boardLabel}
          station={boardStation}
          time={boardStation.scheduled_departure_time}
          timeLabel="Departure"
          approxDistance={boardApproxDistance}
        />
        <StationTiming
          label={alightLabel}
          station={alightStation}
          time={alightStation.scheduled_arrival_time}
          timeLabel="Arrival"
          approxDistance={alightApproxDistance}
        />
      </div>

      <RouteTrainCardActions trainNo={train.train_no} />
    </article>
  );
}

function StationTiming({
  label,
  station,
  time,
  timeLabel,
  approxDistance,
  compact = false,
  className = "",
}: {
  label: string;
  station: RouteStationInfo;
  time?: string;
  timeLabel: string;
  approxDistance?: number;
  compact?: boolean;
  className?: string;
}) {
  const showApproxDistance =
    approxDistance !== undefined && approxDistance > 0;

  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
        {label}
      </p>
      <p className={`text-sm font-semibold text-gray-900 ${compact ? "truncate" : ""}`}>
        {titleCase(station.station_name)}{" "}
        <span className="font-mono text-blue-600">({station.station_code})</span>
      </p>
      {showApproxDistance && (
        <p className="mt-0.5 text-xs text-amber-700">
          ~{Math.round(approxDistance)} km away
        </p>
      )}
      <p className="mt-1 text-sm text-gray-700">
        {timeLabel}: <span className="font-semibold">{time ?? "—"}</span>
      </p>
    </>
  );

  if (compact) {
    return <div className={`min-w-0 ${className}`}>{content}</div>;
  }

  return (
    <div className={`rounded-lg bg-white border border-gray-100 px-3.5 py-3 ${className}`}>
      {content}
    </div>
  );
}

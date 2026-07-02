import Link from "next/link";
import RouteTrainCardActions from "@/components/route-search/RouteTrainCardActions";
import { formatRunningDays, titleCase } from "@/lib/format";
import { getGoogleMapsRouteHref } from "@/lib/google-maps-href";
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
  resolveSearchStationInTrain,
  usesAlternativeBoarding,
  usesAlternativeDestination,
} from "@/lib/types/route-search";

type RouteTrainCardProps = {
  train: DirectRouteTrain | AlternativeRouteTrain;
  variant: "direct" | "alternative";
  searchFromName: string;
  searchToName: string;
  searchFromCode: string;
  searchToCode: string;
};

export default function RouteTrainCard({
  train,
  variant,
  searchFromName,
  searchToName,
  searchFromCode,
  searchToCode,
}: RouteTrainCardProps) {
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

  const searchOriginStation = resolveSearchStationInTrain(
    searchFromCode,
    searchFromName,
    train,
  );
  const searchDestinationStation = resolveSearchStationInTrain(
    searchToCode,
    searchToName,
    train,
  );
  const boardMapsHref =
    boardApproxDistance && boardApproxDistance > 0
      ? getGoogleMapsRouteHref(searchOriginStation, boardStation)
      : null;
  const alightMapsHref =
    alightApproxDistance && alightApproxDistance > 0
      ? getGoogleMapsRouteHref(searchDestinationStation, alightStation)
      : null;

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

      <div className="mt-4 rounded-lg border border-gray-100 px-3.5 py-3 sm:px-4 sm:py-3.5">
        <JourneyTimeline
          boardLabel={boardLabel}
          boardStation={boardStation}
          boardTime={boardStation.scheduled_departure_time}
          boardApproxDistance={boardApproxDistance}
          boardApproxDistanceFrom={searchFromName}
          boardMapsHref={boardMapsHref}
          alightLabel={alightLabel}
          alightStation={alightStation}
          alightTime={alightStation.scheduled_arrival_time}
          alightApproxDistance={alightApproxDistance}
          alightApproxDistanceFrom={searchToName}
          alightMapsHref={alightMapsHref}
        />
      </div>

      <RouteTrainCardActions trainNo={train.train_no} />
    </article>
  );
}

function JourneyTimeline({
  boardLabel,
  boardStation,
  boardTime,
  boardApproxDistance,
  boardApproxDistanceFrom,
  boardMapsHref,
  alightLabel,
  alightStation,
  alightTime,
  alightApproxDistance,
  alightApproxDistanceFrom,
  alightMapsHref,
}: {
  boardLabel: string;
  boardStation: RouteStationInfo;
  boardTime?: string;
  boardApproxDistance?: number;
  boardApproxDistanceFrom?: string;
  boardMapsHref?: string | null;
  alightLabel: string;
  alightStation: RouteStationInfo;
  alightTime?: string;
  alightApproxDistance?: number;
  alightApproxDistanceFrom?: string;
  alightMapsHref?: string | null;
}) {
  const boardLeg = (
    <JourneyLeg
      label={boardLabel}
      station={boardStation}
      time={boardTime}
      approxDistance={boardApproxDistance}
      approxDistanceFrom={boardApproxDistanceFrom}
      mapsHref={boardMapsHref}
    />
  );
  const alightLeg = (
    <JourneyLeg
      label={alightLabel}
      station={alightStation}
      time={alightTime}
      approxDistance={alightApproxDistance}
      approxDistanceFrom={alightApproxDistanceFrom}
      mapsHref={alightMapsHref}
    />
  );

  return (
    <>
      <div className="flex gap-3 sm:hidden">
        <JourneyRail orientation="vertical" />
        <div className="min-w-0 flex-1 space-y-5">
          {boardLeg}
          {alightLeg}
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-x-6">
        {boardLeg}
        <div className="flex w-28 items-center self-center md:w-36 lg:w-44">
          <JourneyRail orientation="horizontal" />
        </div>
        {alightLeg}
      </div>
    </>
  );
}

function JourneyRail({ orientation }: { orientation: "vertical" | "horizontal" }) {
  const originDot = (
    <div
      className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-blue-500 bg-white"
      aria-hidden="true"
    />
  );
  const destinationDot = (
    <div
      className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"
      aria-hidden="true"
    />
  );

  if (orientation === "horizontal") {
    return (
      <div className="flex w-full items-center" aria-hidden="true">
        {originDot}
        <div className="mx-1 h-px min-w-0 flex-1 bg-gray-200" />
        {destinationDot}
      </div>
    );
  }

  return (
    <div className="flex w-3 shrink-0 flex-col items-center pt-1.5" aria-hidden="true">
      {originDot}
      <div className="my-1 w-px flex-1 bg-gray-200" />
      {destinationDot}
    </div>
  );
}

function JourneyLeg({
  label,
  station,
  time,
  approxDistance,
  approxDistanceFrom,
  mapsHref = null,
}: {
  label: string;
  station: RouteStationInfo;
  time?: string;
  approxDistance?: number;
  approxDistanceFrom?: string;
  mapsHref?: string | null;
}) {
  const showApproxDistance =
    approxDistance !== undefined && approxDistance > 0 && approxDistanceFrom;

  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="shrink-0 text-base sm:text-lg font-bold tabular-nums text-gray-900">
          {time ?? "—"}
        </p>
      </div>
      <p className="text-sm sm:text-base font-semibold leading-snug text-gray-900">
        {titleCase(station.station_name)}{" "}
        <span className="font-mono text-blue-600">({station.station_code})</span>
      </p>
      {showApproxDistance && (
        <p className="mt-1 text-xs leading-snug">
          <span className="text-amber-700">
            ~{Math.round(approxDistance)} km away from {approxDistanceFrom}
          </span>
          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              {" · See in Map"}
            </a>
          )}
        </p>
      )}
    </div>
  );
}

import Link from "next/link";
import RunningDays from "@/components/train-schedule/RunningDays";
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

  return (
    <article className="rounded-xl border border-gray-100 bg-gray-50/40 p-4 sm:p-5 hover:border-blue-200 hover:bg-blue-50/40 transition-colors">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
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
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            <Link
              href={getTrainScheduleHref(train.train_no)}
              className="hover:text-blue-700"
            >
              {titleCase(train.train_name)}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {train.source_code} → {train.destination_code} · {titleCase(train.source)} to{" "}
            {titleCase(train.destination)}
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="text-lg font-bold text-gray-900">{train.scheduled_travel_time}</p>
          <p className="text-xs text-gray-500">
            {Math.round(train.distance_between_stations)} km · {train.stops_between_stations}{" "}
            {train.stops_between_stations === 1 ? "stop" : "stops"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StationTiming
          label={boardLabel}
          station={boardStation}
          time={boardStation.scheduled_departure_time}
          timeLabel="Departure"
        />
        <StationTiming
          label={alightLabel}
          station={alightStation}
          time={alightStation.scheduled_arrival_time}
          timeLabel="Arrival"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <RunningDays days={train.days_of_run} />
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>{formatRunningDays(train.days_of_run)}</span>
          {train.classes.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>{train.classes.join(", ")}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function StationTiming({
  label,
  station,
  time,
  timeLabel,
}: {
  label: string;
  station: RouteStationInfo;
  time?: string;
  timeLabel: string;
}) {
  return (
    <div className="rounded-lg bg-white border border-gray-100 px-3.5 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">
        {titleCase(station.station_name)}{" "}
        <span className="font-mono text-blue-600">({station.station_code})</span>
      </p>
      <p className="mt-1 text-sm text-gray-700">
        {timeLabel}: <span className="font-semibold">{time ?? "—"}</span>
      </p>
    </div>
  );
}


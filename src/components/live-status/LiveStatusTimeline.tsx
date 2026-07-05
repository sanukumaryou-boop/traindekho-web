"use client";

import { useState } from "react";
import { formatScheduleTime } from "@/lib/format";
import {
  buildStationOrder,
  buildTimelineSegments,
  formatPlatform,
  formatStopDistance,
  getActualTimeColor,
  getIntermediateConnectorBlueFraction,
  getStationPhase,
  isConnectorBelowPassed,
  type StationPhase,
} from "@/lib/live-status-helpers";
import type { IntermediateStation } from "@/lib/types/train";
import type { LiveStatusScheduleStop } from "@/lib/types/live-status";

type LiveStatusTimelineProps = {
  schedule: LiveStatusScheduleStop[];
  currentStationCode?: string | null;
};

export default function LiveStatusTimeline({
  schedule,
  currentStationCode,
}: LiveStatusTimelineProps) {
  const stationOrder = buildStationOrder(schedule);
  const segments = buildTimelineSegments(schedule);
  const lastHaltIndex = schedule.length - 1;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50/70">
        <div className="grid grid-cols-[3.5rem_2rem_1fr] sm:grid-cols-[4rem_2.5rem_1fr] gap-x-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span />
          <span />
          <div className="grid grid-cols-[1fr_auto] gap-3 pr-1">
            <span>Station</span>
            <div className="grid grid-cols-2 gap-4 min-w-[8.5rem] text-right">
              <span>Arrival</span>
              <span>Departure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-2">
        {segments.map((segment, index) => {
          if (segment.kind === "halt") {
            const isLast = segment.haltIndex === lastHaltIndex;
            const phase = getStationPhase(
              segment.stop.stationCode,
              currentStationCode,
              stationOrder,
            );

            return (
              <HaltRow
                key={`halt-${segment.stop.stationCode}-${segment.haltIndex}`}
                stop={segment.stop}
                phase={phase}
                stationOrder={stationOrder}
                currentStationCode={currentStationCode}
                isOrigin={segment.haltIndex === 0}
                isDestination={isLast}
                isLast={isLast}
              />
            );
          }

          return (
            <IntermediateGroup
              key={`inter-${segment.afterHaltIndex}-${segment.stops[0]?.stationCode ?? index}`}
              stops={segment.stops}
              currentStationCode={currentStationCode}
              stationOrder={stationOrder}
            />
          );
        })}
      </div>
    </div>
  );
}

function HaltRow({
  stop,
  phase,
  stationOrder,
  currentStationCode,
  isOrigin,
  isDestination,
  isLast,
}: {
  stop: LiveStatusScheduleStop;
  phase: StationPhase;
  stationOrder: string[];
  currentStationCode?: string | null;
  isOrigin: boolean;
  isDestination: boolean;
  isLast: boolean;
}) {
  const platform = formatPlatform(stop.platform);
  const delay = Math.max(stop.delayArr ?? 0, stop.delayDep ?? 0);
  const isCurrent = phase === "current";
  const isPassed = phase === "passed";
  const connectorBelowBlue = isConnectorBelowPassed(
    stop.stationCode,
    currentStationCode,
    stationOrder,
  );

  const scheduledArrival = isOrigin
    ? null
    : formatScheduleTime(stop.scheduledArrivalTime);
  const scheduledDeparture = isDestination
    ? null
    : formatScheduleTime(stop.scheduledDepartureTime);

  const actualArrival = isOrigin
    ? null
    : resolveActualTime(
        stop.arrivalTime,
        stop.scheduledArrivalTime,
        isPassed,
        delay,
      );
  const actualDeparture = isDestination
    ? null
    : resolveActualTime(
        stop.departureTime,
        stop.scheduledDepartureTime,
        isPassed,
        delay,
      );

  return (
    <div className="grid grid-cols-[3.5rem_2rem_1fr] sm:grid-cols-[4rem_2.5rem_1fr] gap-x-2">
      <div className="pt-4 text-[11px] sm:text-xs font-medium text-gray-400 tabular-nums text-right pr-1">
        {formatStopDistance(stop)}
      </div>

      <div className="relative flex flex-col items-center">
        <TimelineDot phase={phase} />
        {!isLast && (
          <TimelineConnector
            blueFraction={connectorBelowBlue ? 1 : 0}
            minHeight="3.5rem"
          />
        )}
      </div>

      <div
        className={`py-3 border-b border-gray-100 last:border-b-0 ${
          isCurrent
            ? "rounded-xl bg-blue-50/60 -mx-1 px-2 sm:px-3"
            : isPassed
              ? "rounded-xl bg-blue-50/30 -mx-1 px-2 sm:px-3"
              : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p
            className={`font-bold leading-snug min-w-0 ${
              isCurrent
                ? "text-blue-700 text-base sm:text-lg"
                : phase === "passed"
                  ? "text-blue-800"
                  : "text-gray-900"
            }`}
          >
            {stop.stationName}
          </p>
          {platform && (
            <p className="text-xs font-semibold text-blue-600 whitespace-nowrap shrink-0">
              {platform}
            </p>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-6 sm:gap-10">
          <TimeColumn
            label="Arrival"
            scheduled={scheduledArrival}
            actual={actualArrival}
            delayed={!isOrigin && delay > 0}
            isPassed={isPassed}
          />
          <TimeColumn
            label="Departure"
            scheduled={scheduledDeparture}
            actual={actualDeparture}
            delayed={!isDestination && delay > 0}
            isPassed={isPassed}
          />
        </div>
      </div>
    </div>
  );
}

function IntermediateGroup({
  stops,
  currentStationCode,
  stationOrder,
}: {
  stops: IntermediateStation[];
  currentStationCode?: string | null;
  stationOrder: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const phases = stops.map((stop) =>
    getStationPhase(stop.stationCode, currentStationCode, stationOrder),
  );
  const hasPassed = phases.some((phase) => phase === "passed");
  const hasCurrent = phases.includes("current");
  const useBlueTheme = hasPassed || hasCurrent;
  const connectorBlueFraction = getIntermediateConnectorBlueFraction(phases);

  return (
    <div className="grid grid-cols-[3.5rem_2rem_1fr] sm:grid-cols-[4rem_2.5rem_1fr] gap-x-2">
      <div />
      <div className="relative flex flex-col items-center">
        <TimelineConnector
          blueFraction={connectorBlueFraction}
          minHeight="2rem"
        />
      </div>

      <div className="py-1">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
            useBlueTheme
              ? hasCurrent
                ? "bg-blue-50 hover:bg-blue-100/80 border-blue-200"
                : "bg-blue-50/60 hover:bg-blue-100/70 border-blue-100"
              : "bg-gray-50 hover:bg-gray-100 border-gray-100"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              useBlueTheme
                ? hasCurrent
                  ? "text-blue-700"
                  : "text-blue-800"
                : "text-gray-500"
            }`}
          >
            {stops.length} {stops.length === 1 ? "Station" : "Stations"}
          </span>
          <ChevronIcon expanded={expanded} />
        </button>

        {expanded && (
          <div
            className={`mt-1 rounded-lg border divide-y ${
              useBlueTheme
                ? "bg-blue-50/50 border-blue-100 divide-blue-100"
                : "bg-gray-50/80 border-gray-100 divide-gray-100"
            }`}
          >
            {stops.map((stop, index) => {
              const phase = phases[index];
              const isCurrent = phase === "current";
              const isPassed = phase === "passed";
              const scheduled = formatScheduleTime(stop.scheduledTime);

              return (
                <div
                  key={stop.stationCode}
                  className={`px-3 py-2.5 ${
                    isCurrent
                      ? "bg-blue-50/80"
                      : isPassed
                        ? "bg-blue-50/40"
                        : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent
                            ? "text-blue-700"
                            : isPassed
                              ? "text-blue-800"
                              : "text-gray-700"
                        }`}
                      >
                        {stop.stationName}
                      </p>
                      <p
                        className={`text-[11px] tabular-nums ${
                          isPassed ? "text-blue-600/80" : "text-gray-400"
                        }`}
                      >
                        {formatStopDistance(stop)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs tabular-nums text-gray-600">
                        {scheduled}
                      </p>
                      {isPassed && scheduled !== "—" && (
                        <p
                          className={`text-xs tabular-nums font-semibold ${getActualTimeColor(
                            scheduled,
                            scheduled,
                            false,
                            true,
                          )}`}
                        >
                          {scheduled}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function resolveActualTime(
  actualRaw: string | null | undefined,
  scheduledRaw: string,
  isPassed: boolean,
  delay: number,
): string | null {
  if (actualRaw) {
    return formatScheduleTime(actualRaw);
  }

  const scheduled = formatScheduleTime(scheduledRaw);
  if (scheduled === "—") return null;

  if (isPassed && delay === 0) {
    return scheduled;
  }

  return null;
}

function TimeColumn({
  label,
  scheduled,
  actual,
  delayed,
  isPassed = false,
}: {
  label: string;
  scheduled: string | null;
  actual: string | null;
  delayed: boolean;
  isPassed?: boolean;
}) {
  const hasActual = Boolean(actual && actual !== "—");
  const showActual = hasActual && scheduled != null;

  return (
    <div className="text-right min-w-[4rem]">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">
        {label}
      </p>
      {scheduled ? (
        <p className="text-xs sm:text-sm tabular-nums text-gray-800">
          {scheduled}
        </p>
      ) : (
        <p className="text-xs sm:text-sm text-gray-300">—</p>
      )}
      {showActual && (
        <p
          className={`text-xs sm:text-sm tabular-nums font-semibold ${getActualTimeColor(
            scheduled,
            actual,
            delayed,
            isPassed,
          )}`}
        >
          {actual}
        </p>
      )}
    </div>
  );
}

function TimelineConnector({
  blueFraction,
  minHeight,
}: {
  blueFraction: number;
  minHeight: string;
}) {
  const clamped = Math.min(1, Math.max(0, blueFraction));

  if (clamped <= 0) {
    return (
      <div
        className="w-0.5 flex-1 bg-gray-200"
        style={{ minHeight }}
      />
    );
  }

  if (clamped >= 1) {
    return (
      <div
        className="w-0.5 flex-1 bg-blue-300"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div
      className="flex w-0.5 flex-1 flex-col"
      style={{ minHeight }}
    >
      <div
        className="bg-blue-300"
        style={{ flex: clamped }}
      />
      <div
        className="bg-gray-200"
        style={{ flex: 1 - clamped }}
      />
    </div>
  );
}

function TimelineDot({ phase }: { phase: StationPhase }) {
  if (phase === "passed") {
    return (
      <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
        <CheckIcon className="h-3 w-3" />
      </div>
    );
  }

  if (phase === "current") {
    return (
      <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0">
        <span className="h-2 w-2 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <div className="z-10 h-4 w-4 rounded-full border-2 border-gray-300 bg-white shrink-0" />
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 text-gray-400 transition-transform ${
        expanded ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { formatScheduleTime } from "@/lib/format";
import {
  buildStationOrder,
  buildTimelineSegments,
  formatPlatform,
  formatStopDistance,
  getActualTimeColor,
  getStationPhase,
  type StationPhase,
} from "@/lib/live-status-helpers";
import type { IntermediateStation } from "@/lib/types/train";
import type { LiveStatusScheduleStop } from "@/lib/types/live-status";

const CURRENT_STATION_ELEMENT_ID = "live-status-current-station";
const LIVE_PROGRESS_GREEN = "#049320";

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

  useEffect(() => {
    if (!currentStationCode) return;

    window.history.scrollRestoration = "manual";

    function scrollToCurrentStation() {
      const el = document.getElementById(CURRENT_STATION_ELEMENT_ID);
      if (!el) return;

      const scroller = el.closest("[data-live-status-route]");
      if (scroller instanceof HTMLElement) {
        const scrollerRect = scroller.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        scroller.scrollTop +=
          elRect.top -
          scrollerRect.top -
          scroller.clientHeight / 2 +
          elRect.height / 2;
        return;
      }

      el.scrollIntoView({ block: "center", behavior: "auto" });
    }

    const frame = requestAnimationFrame(scrollToCurrentStation);
    const timeout = window.setTimeout(scrollToCurrentStation, 150);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [currentStationCode, schedule]);

  return (
    <div>
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
  );
}

function HaltRow({
  stop,
  phase,
  isOrigin,
  isDestination,
  isLast,
}: {
  stop: LiveStatusScheduleStop;
  phase: StationPhase;
  isOrigin: boolean;
  isDestination: boolean;
  isLast: boolean;
}) {
  const platform = formatPlatform(stop.platform);
  const delay = Math.max(stop.delayArr ?? 0, stop.delayDep ?? 0);
  const isCurrent = phase === "current";
  const isPassed = phase === "passed";

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
      <div className="flex h-4 items-center justify-end pr-1 text-[11px] sm:text-xs font-medium text-gray-400 tabular-nums">
        {formatStopDistance(stop)}
      </div>

      <div className="relative flex flex-col items-center">
        <TimelineDot phase={phase} />
        {!isLast && (
          <TimelineConnector
            filledFraction={phase === "passed" ? 1 : 0}
            minHeight="3.5rem"
          />
        )}
      </div>

      <div
        id={isCurrent ? CURRENT_STATION_ELEMENT_ID : undefined}
        className="min-w-0 pb-3 scroll-mt-28"
      >
        <div className="flex h-4 items-center justify-between gap-2">
          <p
            className={`truncate text-sm font-bold leading-none min-w-0 ${
              isCurrent
                ? "text-blue-700"
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

        <div className="mt-1 flex items-start justify-between gap-3">
          <TimeColumn
            label="Arrival"
            scheduled={scheduledArrival}
            actual={actualArrival}
            delayed={!isOrigin && delay > 0}
            isPassed={isPassed}
            align="left"
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
  const phases = stops.map((stop) =>
    getStationPhase(stop.stationCode, currentStationCode, stationOrder),
  );
  const hasCurrent = phases.includes("current");
  const hasPassed = phases.some((phase) => phase === "passed");
  const [expanded, setExpanded] = useState(hasCurrent);
  const wasCurrent = useRef(hasCurrent);
  const groupLineFilled = hasPassed || hasCurrent;

  useEffect(() => {
    if (hasCurrent && !wasCurrent.current) {
      setExpanded(true);
    }
    wasCurrent.current = hasCurrent;
  }, [hasCurrent]);

  return (
    <>
      <div
        id={!expanded && hasCurrent ? CURRENT_STATION_ELEMENT_ID : undefined}
        className="grid grid-cols-[3.5rem_2rem_1fr] sm:grid-cols-[4rem_2.5rem_1fr] gap-x-2"
      >
        <div />
        <div className="relative z-20 flex min-h-8 flex-col items-center justify-center overflow-visible">
          <TimelineConnector
            filledFraction={groupLineFilled ? 1 : 0}
            minHeight="2rem"
          />
          {!expanded && hasCurrent ? (
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <TimelineDot phase="current" />
            </div>
          ) : null}
        </div>

      <div className="py-1">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-1 py-1.5 text-blue-700"
        >
          <span className="text-xs font-semibold">
            {stops.length} {stops.length === 1 ? "Station" : "Stations"}
          </span>
          <ChevronIcon expanded={expanded} />
        </button>
      </div>
    </div>

    {expanded && (
      <div className="rounded-xl bg-gray-100 overflow-visible">
        {stops.map((stop, index) => {
          const phase = phases[index]!;
          const isCurrent = phase === "current";
          const isPassed = phase === "passed";
          const scheduled = formatScheduleTime(stop.scheduledTime);
          const isLastIntermediate = index === stops.length - 1;

          return (
            <div
              key={stop.stationCode}
              role="button"
              tabIndex={0}
              onClick={() => setExpanded(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExpanded(false);
                }
              }}
              className="grid cursor-pointer grid-cols-[3.5rem_2rem_1fr] sm:grid-cols-[4rem_2.5rem_1fr] gap-x-2"
            >
              <div className="flex h-4 items-center justify-end pr-1 text-[11px] sm:text-xs font-medium text-gray-400 tabular-nums">
                {formatStopDistance(stop)}
              </div>

              <div className="relative flex flex-col items-center">
                <TimelineDot phase={phase} />
                <TimelineConnector
                  filledFraction={phase === "passed" ? 1 : 0}
                  minHeight={isLastIntermediate ? "2rem" : "3.5rem"}
                />
              </div>

              <div
                id={isCurrent ? CURRENT_STATION_ELEMENT_ID : undefined}
                className="min-w-0 pb-3 pr-3 scroll-mt-28"
              >
                <div className="flex h-4 items-center">
                  <p
                    className={`truncate text-sm font-bold leading-none min-w-0 ${
                      isCurrent
                        ? "text-blue-700"
                        : isPassed
                          ? "text-blue-800"
                          : "text-gray-900"
                    }`}
                  >
                    {stop.stationName}
                  </p>
                </div>

                <div className="mt-1 flex items-start justify-between gap-3">
                  <TimeColumn
                    label="Arrival"
                    scheduled={scheduled}
                    actual={null}
                    delayed={false}
                    align="left"
                  />
                  <TimeColumn
                    label="Departure"
                    scheduled={scheduled}
                    actual={null}
                    delayed={false}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
    </>
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
  align = "right",
}: {
  label: string;
  scheduled: string | null;
  actual: string | null;
  delayed: boolean;
  isPassed?: boolean;
  align?: "left" | "right";
}) {
  const hasActual = Boolean(actual && actual !== "—");
  const showActual = hasActual && scheduled != null;

  return (
    <div className={`min-w-[4rem] ${align === "left" ? "text-left" : "text-right"}`}>
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
  filledFraction,
  minHeight,
}: {
  filledFraction: number;
  minHeight: string;
}) {
  const clamped = Math.min(1, Math.max(0, filledFraction));

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
        className="w-0.5 flex-1"
        style={{ minHeight, backgroundColor: LIVE_PROGRESS_GREEN }}
      />
    );
  }

  return (
    <div
      className="flex w-0.5 flex-1 flex-col"
      style={{ minHeight }}
    >
      <div
        className="flex-1"
        style={{ backgroundColor: LIVE_PROGRESS_GREEN, flex: clamped }}
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
      <div
        className="z-10 flex h-4 w-4 items-center justify-center rounded-full text-white shrink-0"
        style={{ backgroundColor: LIVE_PROGRESS_GREEN }}
      >
        <CheckIcon className="h-2.5 w-2.5" />
      </div>
    );
  }

  if (phase === "current") {
    return (
      <span className="relative z-20 flex h-5 w-5 shrink-0 items-center justify-center overflow-visible">
        <span
          className="absolute h-5 w-5 rounded-full opacity-70 animate-ping"
          style={{ backgroundColor: LIVE_PROGRESS_GREEN }}
        />
        <span
          className="relative h-3.5 w-3.5 rounded-full ring-2 ring-white"
          style={{ backgroundColor: LIVE_PROGRESS_GREEN }}
        />
      </span>
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

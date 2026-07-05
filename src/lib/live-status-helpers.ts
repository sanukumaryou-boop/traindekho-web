import type { IntermediateStation, ScheduleStop } from "@/lib/types/train";
import type {
  LiveStatusScheduleStop,
  TrainLiveStatusResponse,
} from "@/lib/types/live-status";
import { titleCase } from "@/lib/format";

export type StationPhase = "passed" | "current" | "upcoming";

/** Parse delay minutes from API values (number, numeric string, etc.). */
export function parseDelayMinutes(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/-?\d+/);
    if (match) {
      const parsed = Number(match[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }
  return null;
}

export function formatTrainDelayMessage(delayMinutes: number): string {
  if (delayMinutes > 0) {
    return `Train is delayed by ${delayMinutes} ${
      delayMinutes === 1 ? "min" : "mins"
    }`;
  }
  if (delayMinutes < 0) {
    const early = Math.abs(delayMinutes);
    return `Train is running ${early} ${early === 1 ? "min" : "mins"} early`;
  }
  return "Train is running on time";
}

export function getTrainDelayMinutes(
  data: Pick<TrainLiveStatusResponse, "live_train_status" | "schedule">,
): number | null {
  const fromStatus = parseDelayMinutes(data.live_train_status.delay);
  if (fromStatus != null) return fromStatus;

  const currentCode = data.live_train_status.currentStation
    ?.trim()
    .toUpperCase();
  if (!currentCode) return null;

  for (const stop of data.schedule) {
    const code = String(
      stop.stationCode ?? (stop as { station_code?: string }).station_code ?? "",
    )
      .trim()
      .toUpperCase();
    if (code !== currentCode) continue;

    const delayArr = parseDelayMinutes(stop.delayArr);
    const delayDep = parseDelayMinutes(stop.delayDep);
    if (delayArr != null || delayDep != null) {
      return Math.max(delayArr ?? 0, delayDep ?? 0);
    }
  }

  return null;
}

export function formatRelativeJourneyDate(apiDate: string): string {
  const [day, month, year] = apiDate.split("-").map(Number);
  if (!day || !month || !year) return apiDate;

  const journey = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  journey.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (journey.getTime() - today.getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === -2) return "Day before yesterday";
  if (diffDays === 1) return "Tomorrow";
  return apiDate;
}

export function formatStopDistance(stop: {
  originDst?: number;
  distance?: number;
  distanceFromOrigin?: string;
}): string {
  if (stop.originDst != null && stop.originDst > 0) {
    return `${Math.round(stop.originDst)} km`;
  }
  if (typeof stop.distance === "number" && stop.distance > 0) {
    return `${Math.round(stop.distance)} km`;
  }
  if (stop.distanceFromOrigin) {
    const digits = stop.distanceFromOrigin.replace(/[^\d.]/g, "");
    if (digits) return `${Math.round(Number(digits))} km`;
  }
  return "";
}

export function formatPlatform(platform?: string | null): string | null {
  if (!platform) return null;
  const cleaned = platform.replace(/^PLATFORM\s*/i, "").trim();
  if (!cleaned || cleaned.toUpperCase() === "NA") return null;
  return `Platform ${cleaned}`;
}

function readStopCode(stop: Record<string, unknown>): string {
  return String(stop.stationCode ?? stop.station_code ?? "")
    .trim()
    .toUpperCase();
}

function readStopName(stop: Record<string, unknown>): string {
  return String(stop.stationName ?? stop.station_name ?? "").trim();
}

export function findStationNameByCode(
  schedule: ScheduleStop[],
  code: string | null | undefined,
): string | undefined {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase();

  for (const stop of schedule) {
    const record = stop as unknown as Record<string, unknown>;
    if (readStopCode(record) === normalized) {
      const name = readStopName(record);
      if (name) return name;
    }

    for (const inter of stop.intermediateStations ?? []) {
      const interRecord = inter as unknown as Record<string, unknown>;
      if (readStopCode(interRecord) === normalized) {
        const name = readStopName(interRecord);
        if (name) return name;
      }
    }
  }

  return undefined;
}

function parseScheduleTimeToMinutes(time: string): number | null {
  const trimmed = time.trim();
  const match24 = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (match24) {
    return Number(match24[1]) * 60 + Number(match24[2]);
  }

  const match12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed);
  if (match12) {
    let hours = Number(match12[1]) % 12;
    if (match12[3].toUpperCase() === "PM") hours += 12;
    return hours * 60 + Number(match12[2]);
  }

  return null;
}

/** True when actual is the same as or earlier than scheduled. */
export function isOnTimeOrEarly(
  scheduled: string,
  actual: string,
): boolean {
  if (actual === scheduled) return true;

  const scheduledMinutes = parseScheduleTimeToMinutes(scheduled);
  const actualMinutes = parseScheduleTimeToMinutes(actual);
  if (scheduledMinutes == null || actualMinutes == null) {
    return actual === scheduled;
  }

  return actualMinutes <= scheduledMinutes;
}

export function getActualTimeColor(
  scheduled: string | null,
  actual: string | null,
  delayed: boolean,
  isPassed: boolean,
): string {
  if (!actual || !scheduled) return "text-gray-900";

  if (isPassed) {
    return isOnTimeOrEarly(scheduled, actual)
      ? "text-green-600"
      : "text-red-600";
  }

  if (actual === scheduled) return "text-green-600";
  if (delayed || actual !== scheduled) return "text-red-600";
  return "text-gray-900";
}

export function buildStatusBanner(
  runningStatus: string,
  stationName?: string | null,
): string {
  const name = stationName ? titleCase(stationName) : null;

  switch (runningStatus) {
    case "at-station":
      return name ? `Arrived At ${name}` : "Arrived At Station";
    case "departed":
      return name ? `Departed From ${name}` : "Departed";
    case "halted":
      return name ? `Halted At ${name}` : "Halted";
    case "scheduled":
      return "Scheduled";
    case "not-scheduled-today":
      return "Not Running Today";
    default:
      return name ? `Near ${name}` : "Live Status";
  }
}

export function buildStationOrder(
  schedule: LiveStatusScheduleStop[],
): string[] {
  const codes: string[] = [];
  for (const stop of schedule) {
    codes.push(stop.stationCode.trim().toUpperCase());
    for (const inter of stop.intermediateStations ?? []) {
      codes.push(inter.stationCode.trim().toUpperCase());
    }
  }
  return codes;
}

export function getStationPhase(
  stationCode: string,
  currentStationCode: string | null | undefined,
  stationOrder: string[],
): StationPhase {
  const code = stationCode.trim().toUpperCase();
  const current = currentStationCode?.trim().toUpperCase();
  if (!current) return "upcoming";

  const currentIndex = stationOrder.indexOf(current);
  const stationIndex = stationOrder.indexOf(code);

  if (currentIndex === -1 || stationIndex === -1) {
    return code === current ? "current" : "upcoming";
  }
  if (stationIndex < currentIndex) return "passed";
  if (stationIndex === currentIndex) return "current";
  return "upcoming";
}

/** True when the segment below this station should be blue (both ends passed). */
export function isConnectorBelowPassed(
  stationCode: string,
  currentStationCode: string | null | undefined,
  stationOrder: string[],
): boolean {
  const phase = getStationPhase(stationCode, currentStationCode, stationOrder);
  if (phase !== "passed") return false;

  const index = stationOrder.indexOf(stationCode.trim().toUpperCase());
  if (index === -1 || index >= stationOrder.length - 1) return false;

  const nextPhase = getStationPhase(
    stationOrder[index + 1]!,
    currentStationCode,
    stationOrder,
  );
  return nextPhase === "passed";
}

/** Share of an intermediate block connector that should be blue (0–1). */
export function getIntermediateConnectorBlueFraction(
  phases: StationPhase[],
): number {
  const lastPassedIndex = phases.reduce(
    (last, phase, index) => (phase === "passed" ? index : last),
    -1,
  );
  if (lastPassedIndex === -1) return 0;
  return (lastPassedIndex + 1) / phases.length;
}

export type TimelineSegment =
  | { kind: "halt"; stop: LiveStatusScheduleStop; haltIndex: number }
  | {
      kind: "intermediate";
      stops: IntermediateStation[];
      afterHaltIndex: number;
    };

export function buildTimelineSegments(
  schedule: LiveStatusScheduleStop[],
): TimelineSegment[] {
  const segments: TimelineSegment[] = [];

  schedule.forEach((stop, haltIndex) => {
    segments.push({ kind: "halt", stop, haltIndex });

    const intermediate = stop.intermediateStations ?? [];
    if (intermediate.length > 0 && haltIndex < schedule.length - 1) {
      segments.push({
        kind: "intermediate",
        stops: intermediate,
        afterHaltIndex: haltIndex,
      });
    }
  });

  return segments;
}

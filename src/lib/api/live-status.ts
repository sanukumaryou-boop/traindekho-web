import { apiDateToHtmlDate, formatLiveStatusApiDate, isValidApiDate } from "@/lib/live-status-date";
import { parseDelayMinutes } from "@/lib/live-status-helpers";
import { publicDataHeaders, publicDataUrl, publicErrorMessage } from "@/lib/public-data-api";
import { findTrainByNumber } from "@/lib/search-trains";
import { trainApiTimeout } from "@/lib/train-api-url";
import type { DaysOfRun, IntermediateStation } from "@/lib/types/train";
import type {
  LiveStatusFetchResult,
  LiveStatusScheduleStop,
  LiveTrainStatusInfo,
  TrainLiveStatusResponse,
} from "@/lib/types/live-status";

const EMPTY_DAYS: DaysOfRun = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
};

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function text(value: unknown): string {
  return value == null ? "" : String(value);
}

function stationCodeOf(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object" && "code" in value) {
    const code = text((value as { code?: unknown }).code).trim();
    return code || null;
  }
  return null;
}

function stationNameOf(value: unknown): string {
  if (value && typeof value === "object" && "name" in value) {
    return text((value as { name?: unknown }).name);
  }
  return "";
}

function mapRunningStatus(value: unknown): string {
  const raw = text(value).trim();
  if (raw === "at_station") return "at-station";
  if (raw === "not_scheduled") return "not-scheduled-today";
  return raw.replaceAll("_", "-");
}

function mapIntermediate(value: unknown): IntermediateStation | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const station = raw.station;
  const code = stationCodeOf(station) ?? text(raw.stationCode || raw.station_code);
  const name = stationNameOf(station) || text(raw.stationName || raw.station_name);
  if (!code) return null;
  const distance = Number(raw.distance_km ?? raw.originDst ?? raw.distanceFromOrigin ?? 0);
  return {
    stationCode: code,
    stationName: name,
    scheduledTime: text(
      raw.scheduled_arrival_time ?? raw.scheduled_departure_time ?? raw.scheduledTime,
    ),
    distanceFromOrigin: text(raw.distance_km ?? raw.distanceFromOrigin ?? ""),
    originDst: Number.isFinite(distance) ? distance : 0,
  };
}

function mapLiveStop(value: unknown): LiveStatusScheduleStop | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const station = raw.station;
  const code = stationCodeOf(station) ?? text(raw.stationCode || raw.station_code);
  if (!code) return null;
  const delay = parseDelayMinutes(raw.delay_minutes ?? raw.delayArr ?? raw.delayDep);
  const distance = Number(raw.distance_km ?? raw.distance ?? raw.originDst ?? 0);
  const intermediates = Array.isArray(raw.intermediate_stations)
    ? raw.intermediate_stations
    : Array.isArray(raw.intermediateStations)
      ? raw.intermediateStations
      : [];

  return {
    stationCode: code,
    stationName: stationNameOf(station) || text(raw.stationName || raw.station_name),
    scheduledArrivalTime: text(raw.scheduled_arrival_time ?? raw.scheduledArrivalTime),
    scheduledDepartureTime: text(raw.scheduled_departure_time ?? raw.scheduledDepartureTime),
    arrivalTime: (raw.actual_arrival_time ?? raw.arrivalTime ?? null) as string | null,
    departureTime: (raw.actual_departure_time ?? raw.departureTime ?? null) as string | null,
    delayArr: delay,
    delayDep: parseDelayMinutes(raw.delayDep) ?? delay,
    distance: Number.isFinite(distance) ? distance : 0,
    distanceFromOrigin: text(raw.distance_km ?? raw.distanceFromOrigin ?? ""),
    originDst: Number.isFinite(distance) ? distance : 0,
    dayCount: Number(raw.day_offset ?? raw.dayCount ?? 0),
    platform: raw.platform == null ? undefined : text(raw.platform),
    intermediateStations: intermediates
      .map(mapIntermediate)
      .filter((stop): stop is IntermediateStation => stop !== null),
  };
}

function parseLiveStatusResponse(raw: Record<string, unknown>): TrainLiveStatusResponse {
  const nested = (raw.live_train_status ?? {}) as Record<string, unknown>;
  const usesPublicShape = raw.current_station != null || raw.stops != null || raw.data_source != null;
  const liveStatus = usesPublicShape ? raw : nested;
  const scheduleSource = usesPublicShape ? raw.stops : raw.schedule;
  const local = findTrainByNumber(text(raw.train_no));
  const origin = raw.origin as { code?: unknown; name?: unknown } | undefined;
  const destination = raw.destination as { code?: unknown; name?: unknown } | undefined;
  const stops = (Array.isArray(scheduleSource) ? scheduleSource : parseJsonField<unknown[]>(scheduleSource, []))
    .map(mapLiveStop)
    .filter((stop): stop is LiveStatusScheduleStop => stop !== null);

  return {
    train_no: (raw.train_no as number | string) ?? local?.train_no ?? "",
    train_name: text(raw.train_name || raw.name || local?.train_name),
    train_type: text(raw.train_type || raw.type || local?.train_type),
    source: text(raw.source || origin?.name || local?.source),
    destination: text(
      typeof raw.destination === "string" ? raw.destination : destination?.name || local?.destination,
    ),
    source_code: text(raw.source_code || origin?.code || local?.source_code),
    destination_code: text(raw.destination_code || destination?.code || local?.destination_code),
    days_of_run: parseJsonField<DaysOfRun>(raw.days_of_run, EMPTY_DAYS),
    classes: parseJsonField<string[]>(raw.classes, []),
    schedule: stops,
    total_duration: Number(raw.total_duration ?? raw.duration_minutes ?? 0),
    total_distance: text(raw.total_distance || raw.distance_km),
    total_number_of_stops: Number(raw.total_number_of_stops ?? raw.stop_count ?? stops.length),
    live_train_status: {
      currentStation: stationCodeOf(liveStatus.current_station ?? liveStatus.currentStation),
      upcomingStation: stationCodeOf(liveStatus.next_station ?? liveStatus.upcomingStation),
      upcomingStationInKms: nextStationDistance(liveStatus),
      running_status: mapRunningStatus(liveStatus.running_status),
      delay: parseDelayMinutes(liveStatus.delay_minutes ?? liveStatus.delay),
      main_source: liveStatus.main_source as string | undefined,
      running_status_overridden: Boolean(liveStatus.running_status_overridden),
      whereismytrain_running_status: liveStatus.whereismytrain_running_status as string | undefined,
      provider_running_status: liveStatus.provider_running_status as string | undefined,
    } satisfies LiveTrainStatusInfo,
    live_status_source: text(raw.data_source || raw.live_status_source) || undefined,
  };
}

function nextStationDistance(liveStatus: Record<string, unknown>): number | null {
  const next = liveStatus.next_station;
  if (next && typeof next === "object" && "distance_km" in next) {
    const distance = Number((next as { distance_km?: unknown }).distance_km);
    return Number.isFinite(distance) ? distance : null;
  }
  if (liveStatus.upcomingStationInKms != null) {
    const distance = Number(liveStatus.upcomingStationInKms);
    return Number.isFinite(distance) ? distance : null;
  }
  return null;
}

function journeyDateQuery(date?: string): string {
  const value = date?.trim();
  if (value && isValidApiDate(value)) return apiDateToHtmlDate(value);
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return apiDateToHtmlDate(formatLiveStatusApiDate());
}

export async function fetchTrainLiveStatus(
  trainNo: string,
  date?: string,
): Promise<LiveStatusFetchResult> {
  const digits = trainNo.replace(/\D/g, "");
  if (!digits) {
    return { ok: false, status: 400, message: "Enter a valid train number." };
  }

  const params = new URLSearchParams({ date: journeyDateQuery(date) });
  const url = publicDataUrl(`/trains/${encodeURIComponent(digits)}/live-status?${params.toString()}`);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: publicDataHeaders(),
      signal: trainApiTimeout(25000),
    });
    const text = await response.text();
    let body: Record<string, unknown> = {};
    if (text.trim()) {
      try {
        body = JSON.parse(text) as Record<string, unknown>;
      } catch {
        return {
          ok: false,
          status: 502,
          message: "Live status service returned an unexpected response.",
        };
      }
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: publicErrorMessage(body, `Failed to fetch live status (${response.status}).`),
      };
    }

    return { ok: true, data: parseLiveStatusResponse(body) };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        error.message.toLowerCase().includes("abort"));
    return {
      ok: false,
      status: 502,
      message: timedOut
        ? "Live status took too long. Please try again."
        : "Could not reach the live status service. Please try again.",
    };
  }
}

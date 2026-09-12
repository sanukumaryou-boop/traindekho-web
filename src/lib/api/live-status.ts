import { getTrainApiUrl, trainApiTimeout } from "@/lib/train-api-url";
import type {
  DaysOfRun,
} from "@/lib/types/train";
import { parseDelayMinutes } from "@/lib/live-status-helpers";
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

function parseLiveStatusResponse(raw: Record<string, unknown>): TrainLiveStatusResponse {
  const liveStatus = (raw.live_train_status ?? {}) as Record<string, unknown>;

  return {
    train_no: raw.train_no as number | string,
    train_name: String(raw.train_name ?? ""),
    train_type: String(raw.train_type ?? ""),
    source: String(raw.source ?? raw.source_station ?? ""),
    destination: String(raw.destination ?? ""),
    source_code: String(raw.source_code ?? ""),
    destination_code: String(raw.destination_code ?? ""),
    days_of_run: parseJsonField<DaysOfRun>(raw.days_of_run, EMPTY_DAYS),
    classes: parseJsonField<string[]>(raw.classes, []),
    schedule: parseJsonField<LiveStatusScheduleStop[]>(
      raw.schedule,
      [],
    ) as LiveStatusScheduleStop[],
    total_duration: Number(raw.total_duration ?? 0),
    total_distance: String(raw.total_distance ?? ""),
    total_number_of_stops: Number(raw.total_number_of_stops ?? 0),
    live_train_status: {
      currentStation: (liveStatus.currentStation as string | null) ?? null,
      upcomingStation: (liveStatus.upcomingStation as string | null) ?? null,
      upcomingStationInKms:
        liveStatus.upcomingStationInKms != null
          ? Number(liveStatus.upcomingStationInKms)
          : null,
      running_status: String(liveStatus.running_status ?? ""),
      delay: parseDelayMinutes(liveStatus.delay),
      main_source: liveStatus.main_source as string | undefined,
      running_status_overridden: Boolean(liveStatus.running_status_overridden),
      whereismytrain_running_status: liveStatus.whereismytrain_running_status as
        | string
        | undefined,
      provider_running_status: liveStatus.provider_running_status as
        | string
        | undefined,
    } satisfies LiveTrainStatusInfo,
    live_status_source: raw.live_status_source as string | undefined,
  };
}

export async function fetchTrainLiveStatus(
  trainNo: string,
  date?: string,
): Promise<LiveStatusFetchResult> {
  const digits = trainNo.replace(/\D/g, "");
  if (!digits) {
    return { ok: false, status: 400, message: "Enter a valid train number." };
  }

  const params = new URLSearchParams({ train: digits });
  if (date?.trim()) {
    params.set("date", date.trim());
  }

  const url = `${getTrainApiUrl()}/trains/live-status?${params.toString()}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
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
      const detail = body.detail;
      const message =
        typeof detail === "string"
          ? detail
          : `Failed to fetch live status (${response.status}).`;
      return { ok: false, status: response.status, message };
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

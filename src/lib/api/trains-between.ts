import { getTrainApiUrl } from "@/lib/api/trains";
import type {
  AlternativeRouteTrain,
  DirectRouteTrain,
  RouteTrainApiRecord,
  TrainsBetweenApiResponse,
  TrainsBetweenResult,
} from "@/lib/types/route-search";
import type { DaysOfRun } from "@/lib/types/train";

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const DEFAULT_MAX_RETRIES = 4;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelayMs(attempt: number): number {
  const base = Number(process.env.TRAIN_API_RETRY_DELAY_MS ?? "500");
  return base * 2 ** attempt;
}

function getMaxRetries(): number {
  const n = Number(process.env.TRAIN_API_MAX_RETRIES ?? String(DEFAULT_MAX_RETRIES));
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_MAX_RETRIES;
}

function parseDaysOfRun(value: string): DaysOfRun {
  try {
    return JSON.parse(value) as DaysOfRun;
  } catch {
    return {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    };
  }
}

function parseClasses(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseRouteTrainBase(record: RouteTrainApiRecord) {
  return {
    train_no: record.train_no,
    train_number_string: record.train_number_string,
    train_name: record.train_name,
    train_type: record.train_type,
    source: record.source,
    destination: record.destination,
    source_code: record.source_code,
    destination_code: record.destination_code,
    days_of_run: parseDaysOfRun(record.days_of_run),
    classes: parseClasses(record.classes),
    total_duration: record.total_duration,
    total_distance: record.total_distance,
    total_number_of_stops: record.total_number_of_stops,
    stops_between_stations: record.stops_between_stations,
    distance_between_stations: record.distance_between_stations,
    scheduled_travel_time: record.scheduled_travel_time,
  };
}

function parseDirectTrain(record: RouteTrainApiRecord): DirectRouteTrain | null {
  if (!record.from_station || !record.to_station) return null;
  return {
    ...parseRouteTrainBase(record),
    from_station: record.from_station,
    to_station: record.to_station,
  };
}

function parseAlternativeTrain(
  record: RouteTrainApiRecord,
): AlternativeRouteTrain | null {
  const board = record.alternative_from_station ?? record.from_station;
  const alight = record.to_station ?? record.alternative_to_station;
  if (!board || !alight) return null;

  return {
    ...parseRouteTrainBase(record),
    ...(record.from_station ? { from_station: record.from_station } : {}),
    ...(record.alternative_from_station
      ? { alternative_from_station: record.alternative_from_station }
      : {}),
    ...(record.to_station ? { to_station: record.to_station } : {}),
    ...(record.alternative_to_station
      ? { alternative_to_station: record.alternative_to_station }
      : {}),
  };
}

async function fetchTrainsBetweenOnce(
  from: string,
  to: string,
): Promise<TrainsBetweenResult | null | "retry"> {
  const url = `${getTrainApiUrl()}/trains/between/v2?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (RETRYABLE_STATUS.has(response.status)) {
      return "retry";
    }

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TrainsBetweenApiResponse;
    if (!data || !Array.isArray(data.direct_trains) || !Array.isArray(data.alternative_trains)) {
      return null;
    }

    const direct_trains = data.direct_trains
      .map((record) => parseDirectTrain(record))
      .filter((train): train is DirectRouteTrain => train !== null);

    const alternative_trains = data.alternative_trains
      .map((record) => parseAlternativeTrain(record))
      .filter((train): train is AlternativeRouteTrain => train !== null);

    return { direct_trains, alternative_trains };
  } catch {
    return "retry";
  }
}

export async function fetchTrainsBetween(
  from: string,
  to: string,
): Promise<TrainsBetweenResult | null> {
  const fromCode = from.trim().toUpperCase();
  const toCode = to.trim().toUpperCase();

  if (!fromCode || !toCode || fromCode === toCode) {
    return null;
  }

  const maxRetries = getMaxRetries();
  let result: TrainsBetweenResult | null | "retry" = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    result = await fetchTrainsBetweenOnce(fromCode, toCode);

    if (result !== "retry") {
      return result;
    }

    if (attempt < maxRetries) {
      const delay = getRetryDelayMs(attempt);
      console.warn(
        `[train-api] between ${fromCode}-${toCode} rate-limited or server error, retrying in ${delay}ms (${attempt + 1}/${maxRetries})`,
      );
      await sleep(delay);
    }
  }

  console.error(
    `[train-api] between ${fromCode}-${toCode} failed after ${maxRetries} retries`,
  );
  return null;
}

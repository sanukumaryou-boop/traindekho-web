import fs from "fs";
import path from "path";
import type {
  DaysOfRun,
  ScheduleStop,
  Train,
  TrainApiRecord,
  TrainOriginDestination,
} from "@/lib/types/train";

const DEFAULT_API_URL = "https://rails-core.vercel.app";
const DEFAULT_MAX_RETRIES = 4;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const TRAIN_DISK_CACHE_PATH = path.join(
  process.cwd(),
  ".next/cache/trains-data.json",
);

const EMPTY_DAYS: DaysOfRun = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
};

const trainCache = new Map<string, Train | null>();
let diskCacheLoaded = false;

export function getTrainApiUrl(): string {
  return process.env.TRAIN_API_URL ?? DEFAULT_API_URL;
}

/** Load trains written during batch discovery so SSG pages skip per-page API calls. */
function ensureDiskCacheLoaded(): void {
  if (diskCacheLoaded) return;
  diskCacheLoaded = true;

  try {
    if (!fs.existsSync(TRAIN_DISK_CACHE_PATH)) return;
    const data = JSON.parse(
      fs.readFileSync(TRAIN_DISK_CACHE_PATH, "utf-8"),
    ) as Record<string, Train>;

    for (const [key, train] of Object.entries(data)) {
      if (!trainCache.has(key)) {
        trainCache.set(key, train);
      }
    }
  } catch {
    // cache miss
  }
}

/** Persist in-memory train cache for the static generation phase. */
export function persistTrainCacheToDisk(): void {
  const data: Record<string, Train> = {};
  for (const [key, train] of trainCache) {
    if (train) data[key] = train;
  }

  if (Object.keys(data).length === 0) return;

  fs.mkdirSync(path.dirname(TRAIN_DISK_CACHE_PATH), { recursive: true });
  fs.writeFileSync(TRAIN_DISK_CACHE_PATH, JSON.stringify(data));
  diskCacheLoaded = true;
}

/** Origin/destination pairs from trains already loaded during schedule discovery. */
export function getCachedTrainOriginDestinations(): TrainOriginDestination[] {
  ensureDiskCacheLoaded();

  const seen = new Set<string>();
  const results: TrainOriginDestination[] = [];

  for (const train of trainCache.values()) {
    if (!train) continue;
    const trainNo = String(train.train_no);
    if (seen.has(trainNo)) continue;
    seen.add(trainNo);

    const sourceCode = (train.source_code ?? "").trim().toUpperCase();
    const destinationCode = (train.destination_code ?? "").trim().toUpperCase();
    if (!sourceCode || !destinationCode) continue;

    results.push({
      train_no: trainNo,
      source_code: sourceCode,
      destination_code: destinationCode,
      source: train.source,
      destination: train.destination,
    });
  }

  return results;
}

/** Batch API returns objects; single-train search may return JSON strings. */
function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseTrainRecord(record: TrainApiRecord): Train {
  return {
    ...record,
    days_of_run: parseJsonField<DaysOfRun>(record.days_of_run, EMPTY_DAYS),
    classes: parseJsonField<string[]>(record.classes, []),
    schedule: parseJsonField<ScheduleStop[]>(record.schedule, []),
  };
}

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

async function fetchTrainFromApi(trainNo: string): Promise<Train | null | "retry"> {
  const url = `${getTrainApiUrl()}/trains?q=${encodeURIComponent(trainNo)}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (RETRYABLE_STATUS.has(response.status)) {
      return "retry";
    }

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TrainApiRecord[];
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const exact = data.find(
      (t) =>
        String(t.train_no) === trainNo ||
        t.train_number_string === trainNo,
    );

    return parseTrainRecord(exact ?? data[0]);
  } catch {
    return "retry";
  }
}

function cacheTrain(train: Train): void {
  trainCache.set(String(train.train_no), train);
  if (train.train_number_string) {
    trainCache.set(train.train_number_string, train);
  }
}

function parseBatchResponse(data: unknown): TrainApiRecord[] {
  if (Array.isArray(data)) return data as TrainApiRecord[];
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { trains?: unknown }).trains)
  ) {
    return (data as { trains: TrainApiRecord[] }).trains;
  }
  return [];
}

async function fetchTrainsBatchFromApi(
  trainNos: string[],
): Promise<TrainApiRecord[] | "retry"> {
  const url = `${getTrainApiUrl()}/trains/batch`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ train_nos: trainNos }),
      cache: "no-store",
    });

    if (RETRYABLE_STATUS.has(response.status)) {
      return "retry";
    }

    if (!response.ok) {
      return [];
    }

    return parseBatchResponse(await response.json());
  } catch {
    return "retry";
  }
}

/** Fetch many trains in one POST /trains/batch call. Populates the in-memory cache. */
export async function fetchTrainsByNumbers(
  trainNos: string[],
): Promise<Train[]> {
  if (trainNos.length === 0) return [];

  const uncached = trainNos.filter((no) => !trainCache.has(no));
  if (uncached.length === 0) {
    return trainNos
      .map((no) => trainCache.get(no) ?? null)
      .filter((t): t is Train => t !== null);
  }

  const maxRetries = getMaxRetries();
  let records: TrainApiRecord[] | "retry" = "retry";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    records = await fetchTrainsBatchFromApi(uncached);

    if (records !== "retry") break;

    if (attempt < maxRetries) {
      const delay = getRetryDelayMs(attempt);
      console.warn(
        `[train-api] batch of ${uncached.length} rate-limited or server error, retrying in ${delay}ms (${attempt + 1}/${maxRetries})`,
      );
      await sleep(delay);
    }
  }

  if (records === "retry") {
    console.error(
      `[train-api] batch of ${uncached.length} failed after ${maxRetries} retries`,
    );
    return trainNos
      .map((no) => trainCache.get(no) ?? null)
      .filter((t): t is Train => t !== null);
  }

  const foundKeys = new Set<string>();
  for (const record of records) {
    const train = parseTrainRecord(record);
    cacheTrain(train);
    foundKeys.add(String(train.train_no));
    if (train.train_number_string) foundKeys.add(train.train_number_string);
  }

  for (const no of uncached) {
    if (!foundKeys.has(no)) {
      trainCache.set(no, null);
    }
  }

  return trainNos
    .map((no) => trainCache.get(no) ?? null)
    .filter((t): t is Train => t !== null);
}

export async function fetchTrainByNumber(
  trainNo: string,
): Promise<Train | null> {
  ensureDiskCacheLoaded();

  if (trainCache.has(trainNo)) {
    return trainCache.get(trainNo) ?? null;
  }

  const maxRetries = getMaxRetries();
  let result: Train | null | "retry" = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    result = await fetchTrainFromApi(trainNo);

    if (result !== "retry") {
      if (result) {
        cacheTrain(result);
      } else {
        trainCache.set(trainNo, null);
      }
      return result;
    }

    if (attempt < maxRetries) {
      const delay = getRetryDelayMs(attempt);
      console.warn(
        `[train-api] ${trainNo} rate-limited or server error, retrying in ${delay}ms (${attempt + 1}/${maxRetries})`,
      );
      await sleep(delay);
    }
  }

  console.error(`[train-api] ${trainNo} failed after ${maxRetries} retries`);
  return null;
}

export async function fetchAllTrainNumbers(): Promise<string[]> {
  const url = `${getTrainApiUrl()}/trains/all`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];

    const data = (await response.json()) as
      | { train_no: number | string }[]
      | { trains: { train_no: number | string }[] };

    const records = Array.isArray(data) ? data : data.trains;
    if (!Array.isArray(records)) return [];

    return records.map((t) => String(t.train_no));
  } catch {
    return [];
  }
}

function asRecordArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["trains", "results", "data", "items"]) {
      if (Array.isArray(obj[key])) {
        return obj[key] as Record<string, unknown>[];
      }
    }
  }
  return [];
}

function pickString(
  record: Record<string, unknown>,
  keys: string[],
): string {
  for (const key of keys) {
    const value = record[key];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
}

function parseOriginDestinationRecord(
  record: Record<string, unknown>,
): TrainOriginDestination | null {
  const trainNo = pickString(record, [
    "train_no",
    "train_number_string",
    "train_number",
  ]);
  const sourceCode = pickString(record, [
    "source_code",
    "origin_code",
    "from_code",
    "from",
  ]).toUpperCase();
  const destinationCode = pickString(record, [
    "destination_code",
    "to_code",
    "to",
  ]).toUpperCase();

  if (!trainNo || !sourceCode || !destinationCode) return null;

  const source = pickString(record, ["source", "origin", "source_name"]);
  const destination = pickString(record, [
    "destination",
    "destination_name",
  ]);

  return {
    train_no: trainNo,
    source_code: sourceCode,
    destination_code: destinationCode,
    ...(source ? { source } : {}),
    ...(destination ? { destination } : {}),
  };
}

async function fetchOriginDestinationBatchFromApi(
  trainNos: string[],
): Promise<TrainOriginDestination[] | "retry"> {
  const url = `${getTrainApiUrl()}/trains/origin-destination/batch`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ train_nos: trainNos }),
      cache: "no-store",
      // Cold starts on rails-core can exceed the default undici timeout.
      signal: AbortSignal.timeout(60_000),
    });

    if (RETRYABLE_STATUS.has(response.status)) {
      console.warn(
        `[train-api] origin-destination batch status ${response.status} for ${trainNos.length} trains`,
      );
      return "retry";
    }

    if (!response.ok) {
      console.warn(
        `[train-api] origin-destination batch failed with status ${response.status}`,
      );
      return [];
    }

    const records = asRecordArray(await response.json());
    return records
      .map(parseOriginDestinationRecord)
      .filter((r): r is TrainOriginDestination => r !== null);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[train-api] origin-destination batch network error for ${trainNos.length} trains: ${message}`,
    );
    return "retry";
  }
}

async function fetchOriginDestinationBatchWithRetry(
  trainNos: string[],
): Promise<TrainOriginDestination[]> {
  const maxRetries = getMaxRetries();
  let records: TrainOriginDestination[] | "retry" = "retry";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    records = await fetchOriginDestinationBatchFromApi(trainNos);

    if (records !== "retry") return records;

    if (attempt < maxRetries) {
      // Longer backoff — serverless cold starts often need a few seconds.
      const delay = Math.max(getRetryDelayMs(attempt), 1500 * (attempt + 1));
      console.warn(
        `[train-api] origin-destination batch of ${trainNos.length} retrying in ${delay}ms (${attempt + 1}/${maxRetries})`,
      );
      await sleep(delay);
    }
  }

  // Split large failing batches so one slow request doesn't drop everything.
  if (trainNos.length > 10) {
    const mid = Math.ceil(trainNos.length / 2);
    console.warn(
      `[train-api] origin-destination batch of ${trainNos.length} failed; splitting into ${mid} + ${trainNos.length - mid}`,
    );
    const left = await fetchOriginDestinationBatchWithRetry(
      trainNos.slice(0, mid),
    );
    const right = await fetchOriginDestinationBatchWithRetry(
      trainNos.slice(mid),
    );
    return [...left, ...right];
  }

  console.error(
    `[train-api] origin-destination batch of ${trainNos.length} failed after ${maxRetries} retries`,
  );
  return [];
}

/** Fetch origin/destination only via POST /trains/origin-destination/batch. */
export async function fetchTrainOriginDestinations(
  trainNos: string[],
): Promise<TrainOriginDestination[]> {
  if (trainNos.length === 0) return [];
  return fetchOriginDestinationBatchWithRetry(trainNos);
}

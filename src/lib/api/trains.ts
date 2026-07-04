import type {
  DaysOfRun,
  ScheduleStop,
  Train,
  TrainApiRecord,
} from "@/lib/types/train";

const DEFAULT_API_URL = "http://127.0.0.1:8000";
const DEFAULT_MAX_RETRIES = 4;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

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

export function getTrainApiUrl(): string {
  return process.env.TRAIN_API_URL ?? DEFAULT_API_URL;
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

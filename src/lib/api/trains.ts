import type { Train, TrainApiRecord } from "@/lib/types/train";

const DEFAULT_API_URL = "http://127.0.0.1:8000";
const DEFAULT_MAX_RETRIES = 4;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const trainCache = new Map<string, Train | null>();

export function getTrainApiUrl(): string {
  return process.env.TRAIN_API_URL ?? DEFAULT_API_URL;
}

function parseTrainRecord(record: TrainApiRecord): Train {
  return {
    ...record,
    days_of_run: JSON.parse(record.days_of_run),
    classes: JSON.parse(record.classes),
    schedule: JSON.parse(record.schedule),
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
      trainCache.set(trainNo, result);
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

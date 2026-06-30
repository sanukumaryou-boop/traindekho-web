import fs from "fs";
import path from "path";
import { fetchTrainByNumber } from "@/lib/api/trains";
import { buildTrainSlug } from "@/lib/train-slug";
import trainRajdhaniNumbers from "@/lib/train_rajdhani.json";
import trainVandeBharatExpressNumbers from "@/lib/train_vandebharat.json";

const SLUG_CACHE_PATH = path.join(
  process.cwd(),
  ".next/cache/train-slugs.json",
);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTrainNumbersFromFile(): string[] {
  const numbers = 
  [
    ...trainRajdhaniNumbers.map((t) => String(t.train_no)),
    ...trainVandeBharatExpressNumbers.map((t) => String(t.train_no)),
  ];
  const limit = process.env.TRAIN_BUILD_LIMIT;
  if (limit) {
    const n = Number(limit);
    if (Number.isFinite(n) && n > 0) return numbers.slice(0, n);
  }
  return numbers;
}

function readSlugCache(): string[] | null {
  try {
    if (fs.existsSync(SLUG_CACHE_PATH)) {
      const data = JSON.parse(
        fs.readFileSync(SLUG_CACHE_PATH, "utf-8"),
      ) as string[];
      if (data.length > 0) return data;
    }
  } catch {
    // cache miss
  }
  return null;
}

function writeSlugCache(slugs: string[]): void {
  fs.mkdirSync(path.dirname(SLUG_CACHE_PATH), { recursive: true });
  fs.writeFileSync(SLUG_CACHE_PATH, JSON.stringify(slugs));
}

async function fetchSlugsInBatches(
  numbers: string[],
  concurrency: number,
  batchDelayMs: number,
): Promise<string[]> {
  const slugs: string[] = [];
  let found = 0;

  for (let i = 0; i < numbers.length; i += concurrency) {
    const batch = numbers.slice(i, i + concurrency);

    for (const trainNo of batch) {
      const train = await fetchTrainByNumber(trainNo);
      if (train) {
        slugs.push(buildTrainSlug(train));
        found++;
      }
    }

    const processed = Math.min(i + concurrency, numbers.length);
    if (processed % 500 === 0 || processed === numbers.length) {
      console.log(
        `[train-schedule] Fetched ${processed}/${numbers.length}, found ${found} trains`,
      );
    }

    if (processed < numbers.length && batchDelayMs > 0) {
      await sleep(batchDelayMs);
    }
  }

  return slugs;
}

export async function discoverTrainSlugsForBuild(): Promise<string[]> {
  const cached = readSlugCache();
  if (cached) {
    console.log(`[train-schedule] Using cached ${cached.length} slugs`);
    return cached;
  }

  const numbers = getTrainNumbersFromFile();
  const concurrency = Number(process.env.TRAIN_BUILD_CONCURRENCY ?? "20");
  const batchDelayMs = Number(process.env.TRAIN_BUILD_DELAY_MS ?? "100");

  console.log(
    `[train-schedule] Discovering slugs for ${numbers.length} trains (concurrency: ${concurrency}, delay: ${batchDelayMs}ms)...`,
  );

  const slugs = await fetchSlugsInBatches(numbers, concurrency, batchDelayMs);
  writeSlugCache(slugs);

  console.log(
    `[train-schedule] Pre-rendering ${slugs.length} train schedule pages`,
  );
  return slugs;
}

export async function discoverTrainSlugsForSitemap(): Promise<string[]> {
  const cached = readSlugCache();
  if (cached) return cached;
  return discoverTrainSlugsForBuild();
}

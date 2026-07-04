import fs from "fs";
import path from "path";
import {
  fetchTrainsByNumbers,
  getCachedTrainOriginDestinations,
  persistTrainCacheToDisk,
} from "@/lib/api/trains";
import { buildRouteSearchSlug } from "@/lib/route-search-slug";
import { buildTrainSlug } from "@/lib/train-slug";
import trainRajdhaniNumbers from "@/lib/train_rajdhani.json";
import trainVandeBharatExpressNumbers from "@/lib/train_vandebharat.json";
import trainShatabdiNumbers from "@/lib/train_shatabdi.json";
import trainDurontoNumbers from "@/lib/train_duronto.json";
import trainMailExpressNumbers from "@/lib/train_mailexpress.json";
import trainTejasExpressNumbers from "@/lib/train_tejas.json";
import trainGareebrathNumbers from "@/lib/train_gareebrath.json";

const SLUG_CACHE_PATH = path.join(
  process.cwd(),
  ".next/cache/train-slugs.json",
);

const ROUTE_SLUG_CACHE_PATH = path.join(
  process.cwd(),
  ".next/cache/route-slugs.json",
);

const STATION_CODE_PATTERN = /^[A-Z0-9]{2,6}$/;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTrainNumbersFromFile(): string[] {
  const numbers = 
  [
    ...trainRajdhaniNumbers.map((t) => String(t.train_no)),
    ...trainVandeBharatExpressNumbers.map((t) => String(t.train_no)),
    ...trainShatabdiNumbers.map((t) => String(t.train_no)),
    ...trainDurontoNumbers.map((t) => String(t.train_no)),
    ...trainMailExpressNumbers.map((t) => String(t.train_no)),
    ...trainTejasExpressNumbers.map((t) => String(t.train_no)),
    ...trainGareebrathNumbers.map((t) => String(t.train_no)),
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
  batchSize: number,
  batchDelayMs: number,
): Promise<string[]> {
  const slugs: string[] = [];
  let found = 0;

  for (let i = 0; i < numbers.length; i += batchSize) {
    const batch = numbers.slice(i, i + batchSize);
    const trains = await fetchTrainsByNumbers(batch);

    for (const train of trains) {
      slugs.push(buildTrainSlug(train));
      found++;
    }

    const processed = Math.min(i + batchSize, numbers.length);
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
  // if (cached) {
  //   console.log(`[train-schedule] Using cached ${cached.length} slugs`);
  //   return cached;
  // }

  const numbers = getTrainNumbersFromFile();
  const batchSize = Number(process.env.TRAIN_BUILD_CONCURRENCY ?? "100");
  const batchDelayMs = Number(process.env.TRAIN_BUILD_DELAY_MS ?? "0");

  console.log(
    `[train-schedule] Discovering slugs for ${numbers.length} trains (batch size: ${batchSize}, delay: ${batchDelayMs}ms)...`,
  );

  const slugs = await fetchSlugsInBatches(numbers, batchSize, batchDelayMs);
  writeSlugCache(slugs);
  persistTrainCacheToDisk();
  writeRouteSlugCacheFromTrains();

  console.log(
    `[train-schedule] Pre-rendering ${slugs.length} train schedule pages`,
  );
  return slugs;
}

/** Derive route-search slugs from trains we already fetched (no OD API). */
function writeRouteSlugCacheFromTrains(): void {
  const routes = getCachedTrainOriginDestinations();
  const routeKeys = new Set<string>();

  for (const route of routes) {
    const from = route.source_code.trim().toUpperCase();
    const to = route.destination_code.trim().toUpperCase();
    if (!from || !to || from === to) continue;
    if (!STATION_CODE_PATTERN.test(from) || !STATION_CODE_PATTERN.test(to)) {
      continue;
    }
    routeKeys.add(buildRouteSearchSlug(from, to));
  }

  const routeSlugs = Array.from(routeKeys).sort();
  fs.mkdirSync(path.dirname(ROUTE_SLUG_CACHE_PATH), { recursive: true });
  fs.writeFileSync(ROUTE_SLUG_CACHE_PATH, JSON.stringify(routeSlugs));
  console.log(
    `[search-route] Cached ${routeSlugs.length} origin→destination routes from train data`,
  );
}

export async function discoverTrainSlugsForSitemap(): Promise<string[]> {
  const cached = readSlugCache();
  if (cached) return cached;
  return discoverTrainSlugsForBuild();
}

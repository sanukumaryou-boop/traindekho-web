import fs from "fs";
import {
  fetchTrainsByNumbers,
  getCachedTrainOriginDestinations,
  hasTrainCacheEntry,
  persistTrainCacheToDisk,
} from "@/lib/api/trains";
import { buildRouteSearchSlug } from "@/lib/route-search-slug";
import {
  ensureTrainBuildCacheDir,
  resolveCacheFile,
  ROUTE_SLUG_CACHE_PATH,
  shouldRefreshTrainCache,
  TRAIN_SLUG_CACHE_PATH,
} from "@/lib/train-build-cache";
import { buildTrainSlug } from "@/lib/train-slug";
import trainRajdhaniNumbers from "@/lib/train_rajdhani.json";
import trainVandeBharatExpressNumbers from "@/lib/train_vandebharat.json";
import trainShatabdiNumbers from "@/lib/train_shatabdi.json";
import trainDurontoNumbers from "@/lib/train_duronto.json";
import trainMailExpressNumbers from "@/lib/train_mailexpress.json";
import trainTejasExpressNumbers from "@/lib/train_tejas.json";
import trainGareebrathNumbers from "@/lib/train_gareebrath.json";
import { listTrains } from "@/lib/search-trains";

const STATION_CODE_PATTERN = /^[A-Z0-9]{2,6}$/;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTrainNumbersFromFile(): string[] {
  const numbers = [
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
    const cachePath = resolveCacheFile("train-slugs.json");
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, "utf-8")) as string[];
      if (data.length > 0) return data;
    }
  } catch {
    // cache miss
  }
  return null;
}

function writeSlugCache(slugs: string[]): void {
  ensureTrainBuildCacheDir();
  fs.writeFileSync(TRAIN_SLUG_CACHE_PATH, JSON.stringify(slugs));
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

/**
 * Discover train schedule slugs for SSG.
 * Reuses `.cache/train-build/` when present so rebuilds skip the train API.
 * Force a refresh with TRAIN_CACHE_REFRESH=1.
 */
export async function discoverTrainSlugsForBuild(): Promise<string[]> {
  const numbers = getTrainNumbersFromFile();
  const forceRefresh = shouldRefreshTrainCache();

  if (!forceRefresh) {
    const cached = readSlugCache();
    const missing = numbers.filter((no) => !hasTrainCacheEntry(no));

    if (cached && missing.length === 0) {
      console.log(
        `[train-schedule] Using disk cache (${cached.length} slugs, 0 API calls)`,
      );
      writeRouteSlugCacheFromTrains();
      return cached;
    }

    if (missing.length > 0 && missing.length < numbers.length) {
      console.log(
        `[train-schedule] Disk cache partial — fetching ${missing.length}/${numbers.length} missing trains`,
      );
      const batchSize = Number(process.env.TRAIN_BUILD_CONCURRENCY ?? "100");
      const batchDelayMs = Number(process.env.TRAIN_BUILD_DELAY_MS ?? "0");
      await fetchSlugsInBatches(missing, batchSize, batchDelayMs);

      // Rebuild full slug list from cache (no further API calls).
      const slugs = await fetchSlugsInBatches(numbers, numbers.length, 0);
      writeSlugCache(slugs);
      persistTrainCacheToDisk();
      writeRouteSlugCacheFromTrains();
      console.log(
        `[train-schedule] Pre-rendering ${slugs.length} train schedule pages`,
      );
      return slugs;
    }
  } else {
    console.log(
      "[train-schedule] TRAIN_CACHE_REFRESH set — ignoring disk cache",
    );
  }

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
  ensureTrainBuildCacheDir();
  fs.writeFileSync(ROUTE_SLUG_CACHE_PATH, JSON.stringify(routeSlugs));
  console.log(
    `[search-route] Cached ${routeSlugs.length} origin→destination routes from train data`,
  );
}

/** Sitemap slugs from bundled trains.json — never hits the train API at build. */
export function discoverTrainSlugsForSitemap(): string[] {
  const cached = readSlugCache();
  if (cached && cached.length > 0) return cached;

  const slugs: string[] = [];
  for (const train of listTrains()) {
    const name = train.train_name?.trim();
    const sourceCode = train.source_code?.trim();
    const destCode = train.destination_code?.trim();
    if (!name || !sourceCode || !destCode) continue;
    slugs.push(
      buildTrainSlug({
        train_no: train.train_no,
        train_name: name,
        source_code: sourceCode,
        destination_code: destCode,
        source: train.source ?? "",
        destination: train.destination ?? "",
      }),
    );
  }
  return slugs;
}

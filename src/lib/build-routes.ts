import fs from "fs";
import {
  fetchTrainOriginDestinations,
  getCachedTrainOriginDestinations,
} from "@/lib/api/trains";
import { getTrainNumbersFromFile } from "@/lib/build-trains";
import { buildRouteSearchSlug } from "@/lib/route-search-slug";
import {
  ensureTrainBuildCacheDir,
  resolveCacheFile,
  ROUTE_SLUG_CACHE_PATH,
  shouldRefreshTrainCache,
} from "@/lib/train-build-cache";
import type { TrainOriginDestination } from "@/lib/types/train";

const STATION_CODE_PATTERN = /^[A-Z0-9]{2,6}$/;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidStationCode(code: string): boolean {
  return STATION_CODE_PATTERN.test(code);
}

function readRouteSlugCache(): string[] | null {
  try {
    const cachePath = resolveCacheFile("route-slugs.json");
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, "utf-8")) as string[];
      if (data.length > 0) return data;
    }
  } catch {
    // cache miss
  }
  return null;
}

function writeRouteSlugCache(slugs: string[]): void {
  ensureTrainBuildCacheDir();
  fs.writeFileSync(ROUTE_SLUG_CACHE_PATH, JSON.stringify(slugs));
}

function routeSlugsFromOriginDestinations(
  routes: TrainOriginDestination[],
): string[] {
  const routeKeys = new Set<string>();

  for (const route of routes) {
    const from = route.source_code.trim().toUpperCase();
    const to = route.destination_code.trim().toUpperCase();
    if (!from || !to || from === to) continue;
    if (!isValidStationCode(from) || !isValidStationCode(to)) continue;
    routeKeys.add(buildRouteSearchSlug(from, to));
  }

  return Array.from(routeKeys).sort();
}

async function fetchRouteSlugsFromApi(
  numbers: string[],
  batchSize: number,
  batchDelayMs: number,
): Promise<string[]> {
  const routeKeys = new Set<string>();
  let found = 0;

  for (let i = 0; i < numbers.length; i += batchSize) {
    const batch = numbers.slice(i, i + batchSize);
    const routes = await fetchTrainOriginDestinations(batch);

    for (const route of routes) {
      const from = route.source_code.trim().toUpperCase();
      const to = route.destination_code.trim().toUpperCase();
      if (!from || !to || from === to) continue;
      if (!isValidStationCode(from) || !isValidStationCode(to)) continue;

      routeKeys.add(buildRouteSearchSlug(from, to));
      found++;
    }

    const processed = Math.min(i + batchSize, numbers.length);
    if (processed % 500 === 0 || processed === numbers.length) {
      console.log(
        `[search-route] Fetched ${processed}/${numbers.length}, found ${found} trains, ${routeKeys.size} unique routes`,
      );
    }

    if (processed < numbers.length && batchDelayMs > 0) {
      await sleep(batchDelayMs);
    }
  }

  return Array.from(routeKeys).sort();
}

export async function discoverRouteSlugsForBuild(): Promise<string[]> {
  if (!shouldRefreshTrainCache()) {
    const cached = readRouteSlugCache();
    if (cached) {
      console.log(
        `[search-route] Using disk cache (${cached.length} routes, 0 API calls)`,
      );
      return cached;
    }
  }

  // Prefer trains already fetched for schedule pages — avoids a second API pass.
  const cachedRoutes = getCachedTrainOriginDestinations();
  if (cachedRoutes.length > 0) {
    const slugs = routeSlugsFromOriginDestinations(cachedRoutes);
    writeRouteSlugCache(slugs);
    console.log(
      `[search-route] Built ${slugs.length} routes from ${cachedRoutes.length} cached trains`,
    );
    return slugs;
  }

  const numbers = getTrainNumbersFromFile();
  // Smaller batches + delay: rails-core cold starts fail large concurrent POSTs.
  const batchSize = Number(process.env.TRAIN_BUILD_CONCURRENCY ?? "25");
  const batchDelayMs = Number(process.env.TRAIN_BUILD_DELAY_MS ?? "200");

  console.log(
    `[search-route] Discovering origin→destination routes for ${numbers.length} trains (batch size: ${batchSize}, delay: ${batchDelayMs}ms)...`,
  );

  const slugs = await fetchRouteSlugsFromApi(numbers, batchSize, batchDelayMs);
  writeRouteSlugCache(slugs);

  console.log(`[search-route] Found ${slugs.length} unique route search pages`);
  return slugs;
}

export async function discoverRouteSlugsForSitemap(): Promise<string[]> {
  const cached = readRouteSlugCache();
  if (cached && !shouldRefreshTrainCache()) return cached;

  // Train schedule discovery may still be writing caches in parallel.
  for (let attempt = 0; attempt < 180; attempt++) {
    await sleep(1000);

    const fromDisk = readRouteSlugCache();
    if (fromDisk) return fromDisk;

    const fromTrains = getCachedTrainOriginDestinations();
    if (fromTrains.length > 0) {
      const slugs = routeSlugsFromOriginDestinations(fromTrains);
      writeRouteSlugCache(slugs);
      console.log(
        `[search-route] Built ${slugs.length} routes from train cache for sitemap`,
      );
      return slugs;
    }
  }

  // Last resort only — avoids hammering OD API during the train batch phase.
  return discoverRouteSlugsForBuild();
}

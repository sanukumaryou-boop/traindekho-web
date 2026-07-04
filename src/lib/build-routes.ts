import fs from "fs";
import path from "path";
import { fetchTrainsByNumbers } from "@/lib/api/trains";
import { getTrainNumbersFromFile } from "@/lib/build-trains";
import { buildRouteSearchSlug } from "@/lib/route-search-slug";

const ROUTE_SLUG_CACHE_PATH = path.join(
  process.cwd(),
  ".next/cache/route-slugs.json",
);

const STATION_CODE_PATTERN = /^[A-Z0-9]{2,6}$/;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidStationCode(code: string): boolean {
  return STATION_CODE_PATTERN.test(code);
}

function readRouteSlugCache(): string[] | null {
  try {
    if (fs.existsSync(ROUTE_SLUG_CACHE_PATH)) {
      const data = JSON.parse(
        fs.readFileSync(ROUTE_SLUG_CACHE_PATH, "utf-8"),
      ) as string[];
      if (data.length > 0) return data;
    }
  } catch {
    // cache miss
  }
  return null;
}

function writeRouteSlugCache(slugs: string[]): void {
  fs.mkdirSync(path.dirname(ROUTE_SLUG_CACHE_PATH), { recursive: true });
  fs.writeFileSync(ROUTE_SLUG_CACHE_PATH, JSON.stringify(slugs));
}

async function fetchRouteSlugsInBatches(
  numbers: string[],
  batchSize: number,
  batchDelayMs: number,
): Promise<string[]> {
  const routeKeys = new Set<string>();
  let found = 0;

  for (let i = 0; i < numbers.length; i += batchSize) {
    const batch = numbers.slice(i, i + batchSize);
    const trains = await fetchTrainsByNumbers(batch);

    for (const train of trains) {
      const from = (train.source_code ?? "").trim().toUpperCase();
      const to = (train.destination_code ?? "").trim().toUpperCase();
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
  const numbers = getTrainNumbersFromFile();
  const batchSize = Number(process.env.TRAIN_BUILD_CONCURRENCY ?? "100");
  const batchDelayMs = Number(process.env.TRAIN_BUILD_DELAY_MS ?? "0");

  console.log(
    `[search-route] Discovering origin→destination routes for ${numbers.length} trains (batch size: ${batchSize}, delay: ${batchDelayMs}ms)...`,
  );

  const slugs = await fetchRouteSlugsInBatches(numbers, batchSize, batchDelayMs);
  writeRouteSlugCache(slugs);

  console.log(`[search-route] Pre-rendering ${slugs.length} route search pages`);
  return slugs;
}

export async function discoverRouteSlugsForSitemap(): Promise<string[]> {
  const cached = readRouteSlugCache();
  if (cached) return cached;
  return discoverRouteSlugsForBuild();
}

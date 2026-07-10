import fs from "fs";
import path from "path";

/** Persists across `next build` / `rm -rf .next` (unlike `.next/cache`). */
export const TRAIN_BUILD_CACHE_DIR = path.join(
  process.cwd(),
  ".cache",
  "train-build",
);

export const TRAIN_DATA_CACHE_PATH = path.join(
  TRAIN_BUILD_CACHE_DIR,
  "trains-data.json",
);

export const TRAIN_SLUG_CACHE_PATH = path.join(
  TRAIN_BUILD_CACHE_DIR,
  "train-slugs.json",
);

export const ROUTE_SLUG_CACHE_PATH = path.join(
  TRAIN_BUILD_CACHE_DIR,
  "route-slugs.json",
);

const LEGACY_CACHE_DIR = path.join(process.cwd(), ".next", "cache");

/** Set TRAIN_CACHE_REFRESH=1 to force re-fetching from the API. */
export function shouldRefreshTrainCache(): boolean {
  const value = process.env.TRAIN_CACHE_REFRESH?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function ensureTrainBuildCacheDir(): void {
  fs.mkdirSync(TRAIN_BUILD_CACHE_DIR, { recursive: true });
}

/**
 * Prefer `.cache/train-build/*`; fall back to legacy `.next/cache/*` once
 * so existing local/CI caches keep working after the path move.
 */
export function resolveCacheFile(fileName: string): string {
  const nextPath = path.join(TRAIN_BUILD_CACHE_DIR, fileName);
  if (fs.existsSync(nextPath)) return nextPath;

  const legacyPath = path.join(LEGACY_CACHE_DIR, fileName);
  if (fs.existsSync(legacyPath)) return legacyPath;

  return nextPath;
}

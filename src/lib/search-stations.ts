import { publicDataHeaders, publicDataUrl } from "@/lib/public-data-api";
import { trainApiTimeout } from "@/lib/train-api-url";
import type { Station } from "@/lib/types/route-search";
import stationsData from "@/lib/stations.json";

type StationListItem = Station & {
  weight?: number;
};

let cachedStations: StationListItem[] | null = null;

function getStations(): StationListItem[] {
  if (!cachedStations) {
    cachedStations = stationsData as StationListItem[];
  }
  return cachedStations;
}

function toStation(station: {
  id?: number;
  station_name?: string;
  station_code?: string;
  name?: string;
  code?: string;
}): Station | null {
  const station_code = String(station.station_code ?? station.code ?? "").trim();
  const station_name = String(station.station_name ?? station.name ?? "").trim();
  if (!station_code || !station_name) return null;

  return {
    id: Number(station.id ?? 0),
    station_name,
    station_code,
  };
}

function searchStationsLocal(query: string, limit: number): Station[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const codeQuery = q.replace(/[^a-z0-9]/g, "").toUpperCase();
  const stations = getStations();
  const exactCode: Station[] = [];
  const codePrefix: Station[] = [];
  const nameStarts: Station[] = [];
  const nameContains: Station[] = [];

  for (const station of stations) {
    const parsed = toStation(station);
    if (!parsed) continue;

    const code = parsed.station_code.toUpperCase();
    const name = parsed.station_name.toLowerCase();

    if (code === codeQuery) {
      exactCode.push(parsed);
      continue;
    }
    if (codeQuery.length >= 2 && code.startsWith(codeQuery)) {
      codePrefix.push(parsed);
      continue;
    }
    if (name.startsWith(q)) {
      nameStarts.push(parsed);
      continue;
    }
    if (name.includes(q)) {
      nameContains.push(parsed);
    }
  }

  return [...exactCode, ...codePrefix, ...nameStarts, ...nameContains].slice(
    0,
    limit,
  );
}

/** Search stations via the train API (`GET /stations?q=`), then local JSON. */
export async function searchStations(
  query: string,
  limit = 8,
): Promise<Station[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const url = publicDataUrl(`/stations?q=${encodeURIComponent(q)}&limit=8`);
    const response = await fetch(url, {
      headers: publicDataHeaders(),
      next: { revalidate: 3600 },
      signal: trainApiTimeout(),
    });
    if (response.ok) {
      const data = (await response.json()) as unknown;
      const records = Array.isArray(data)
        ? data
        : data &&
            typeof data === "object" &&
            Array.isArray((data as { stations?: unknown }).stations)
          ? (data as { stations: unknown[] }).stations
          : [];

      const parsed = records
        .map((record) =>
          toStation(
            record as { id?: number; station_name?: string; station_code?: string },
          ),
        )
        .filter((station): station is Station => station !== null)
        .slice(0, limit);

      if (parsed.length > 0) return parsed;
    }
  } catch {
    // Fall through to the bundled station list.
  }

  return searchStationsLocal(q, limit);
}

export function findStationByCode(code: string): Station | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;

  const station = getStations().find(
    (item) => item.station_code.toUpperCase() === normalized,
  );
  return station
    ? {
        id: station.id,
        station_name: station.station_name,
        station_code: station.station_code,
      }
    : undefined;
}

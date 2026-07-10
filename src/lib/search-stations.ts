import { getTrainApiUrl } from "@/lib/train-api-url";
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
}): Station | null {
  const station_code = String(station.station_code ?? "").trim();
  const station_name = String(station.station_name ?? "").trim();
  if (!station_code || !station_name) return null;

  return {
    id: Number(station.id ?? 0),
    station_name,
    station_code,
  };
}

/** Search stations via the train API (`GET /stations?q=`). */
export async function searchStations(
  query: string,
  limit = 8,
): Promise<Station[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const url = `${getTrainApiUrl()}/stations?q=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as unknown;
    const records = Array.isArray(data)
      ? data
      : data &&
          typeof data === "object" &&
          Array.isArray((data as { stations?: unknown }).stations)
        ? (data as { stations: unknown[] }).stations
        : [];

    return records
      .map((record) =>
        toStation(record as { id?: number; station_name?: string; station_code?: string }),
      )
      .filter((station): station is Station => station !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
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

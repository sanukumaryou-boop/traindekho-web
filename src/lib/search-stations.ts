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

function byWeightDesc(a: StationListItem, b: StationListItem): number {
  return (b.weight ?? 0) - (a.weight ?? 0);
}

function toStation(station: StationListItem): Station {
  return {
    id: station.id,
    station_name: station.station_name,
    station_code: station.station_code,
  };
}

export function searchStations(query: string, limit = 8): Station[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const stations = getStations();
  const codeExact: StationListItem[] = [];
  const codePrefix: StationListItem[] = [];
  const nameStarts: StationListItem[] = [];
  const codeContains: StationListItem[] = [];
  const nameContains: StationListItem[] = [];

  for (const station of stations) {
    if (
      codeExact.length +
        codePrefix.length +
        nameStarts.length +
        codeContains.length +
        nameContains.length >=
      limit * 6
    ) {
      break;
    }

    const code = (station.station_code ?? "").toLowerCase();
    const name = (station.station_name ?? "").toLowerCase();
    if (!code || !name) continue;

    if (code === q) {
      if ((station.weight ?? 0) >= 50) {
        codeExact.push(station);
      } else {
        codeContains.push(station);
      }
      continue;
    }
    if (code.startsWith(q)) {
      codePrefix.push(station);
      continue;
    }
    if (name.startsWith(q)) {
      nameStarts.push(station);
      continue;
    }
    if (code.includes(q)) {
      codeContains.push(station);
      continue;
    }
    if (name.includes(q)) {
      nameContains.push(station);
    }
  }

  return [
    ...codeExact.sort(byWeightDesc),
    ...codePrefix.sort(byWeightDesc),
    ...nameStarts.sort(byWeightDesc),
    ...codeContains.sort(byWeightDesc),
    ...nameContains.sort(byWeightDesc),
  ]
    .slice(0, limit)
    .map(toStation);
}

export function findStationByCode(code: string): Station | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;

  const station = getStations().find(
    (item) => item.station_code.toUpperCase() === normalized,
  );
  return station ? toStation(station) : undefined;
}

import { titleCase } from "@/lib/format";
import type { RouteStationInfo } from "@/lib/types/route-search";

function formatMapPoint(station: RouteStationInfo): string | null {
  const { lat, lon } = station;
  if (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon)
  ) {
    return `${lat},${lon}`;
  }

  const name = station.station_name?.trim();
  if (!name) return null;

  const code = station.station_code?.trim();
  return code
    ? `${titleCase(name)} (${code}) railway station, India`
    : `${titleCase(name)} railway station, India`;
}

export function getGoogleMapsRouteHref(
  from: RouteStationInfo,
  to: RouteStationInfo,
  travelmode: "driving" | "transit" = "driving",
): string | null {
  const origin = formatMapPoint(from);
  const destination = formatMapPoint(to);
  if (!origin || !destination) return null;

  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode,
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

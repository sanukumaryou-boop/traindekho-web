import type { DaysOfRun } from "@/lib/types/train";

export interface RouteStationInfo {
  station_code: string;
  station_name: string;
  region?: string;
  scheduled_departure_time?: string;
  scheduled_arrival_time?: string;
  platform?: string;
  distance: number;
  day_count: number;
  approx_distance?: number;
}

export interface RouteTrainShared {
  train_no: number;
  train_number_string: string;
  train_name: string;
  train_type: string;
  source: string;
  destination: string;
  source_code: string;
  destination_code: string;
  days_of_run: DaysOfRun;
  classes: string[];
  total_duration: number;
  total_distance: string;
  total_number_of_stops: number | string;
  stops_between_stations: number;
  distance_between_stations: number;
  scheduled_travel_time: string;
}

export interface DirectRouteTrain extends RouteTrainShared {
  from_station: RouteStationInfo;
  to_station: RouteStationInfo;
}

export interface AlternativeRouteTrain extends RouteTrainShared {
  from_station?: RouteStationInfo;
  alternative_from_station?: RouteStationInfo;
  to_station?: RouteStationInfo;
  alternative_to_station?: RouteStationInfo;
}

export interface TrainsBetweenResult {
  direct_trains: DirectRouteTrain[];
  alternative_trains: AlternativeRouteTrain[];
}

export interface RouteTrainApiRecord {
  train_no: number;
  train_number_string: string;
  train_name: string;
  train_type: string;
  source: string;
  destination: string;
  source_code: string;
  destination_code: string;
  days_of_run: string;
  classes: string;
  total_duration: number;
  total_distance: string;
  total_number_of_stops: number | string;
  stops_between_stations: number;
  distance_between_stations: number;
  scheduled_travel_time: string;
  from_station?: RouteStationInfo | null;
  alternative_from_station?: RouteStationInfo | null;
  to_station?: RouteStationInfo | null;
  alternative_to_station?: RouteStationInfo | null;
}

export interface TrainsBetweenApiResponse {
  direct_trains: RouteTrainApiRecord[];
  alternative_trains: RouteTrainApiRecord[];
}

export interface Station {
  id: number;
  station_name: string;
  station_code: string;
}

export interface StationApiRecord {
  id: number;
  station_name: string;
  station_code: string;
  trains?: string;
  weight?: number;
}

export function getBoardStation(
  train: DirectRouteTrain | AlternativeRouteTrain,
  variant: "direct" | "alternative",
): RouteStationInfo {
  if (variant === "direct") {
    return (train as DirectRouteTrain).from_station;
  }
  const alt = train as AlternativeRouteTrain;
  return alt.alternative_from_station ?? alt.from_station!;
}

export function getAlightStation(
  train: DirectRouteTrain | AlternativeRouteTrain,
  variant: "direct" | "alternative",
): RouteStationInfo {
  if (variant === "direct") {
    return (train as DirectRouteTrain).to_station;
  }
  const alt = train as AlternativeRouteTrain;
  return alt.to_station ?? alt.alternative_to_station!;
}

export function usesAlternativeBoarding(train: AlternativeRouteTrain): boolean {
  return Boolean(train.alternative_from_station);
}

export function usesAlternativeDestination(train: AlternativeRouteTrain): boolean {
  return Boolean(train.alternative_to_station);
}

export function getRouteDisplayNames(
  train: DirectRouteTrain | AlternativeRouteTrain,
  boardStation: RouteStationInfo,
  alightStation: RouteStationInfo,
): { from: string; to: string } {
  const boardCode = boardStation.station_code.trim().toUpperCase();
  const sourceCode = train.source_code.trim().toUpperCase();
  const from =
    boardCode && sourceCode && boardCode !== sourceCode
      ? boardStation.station_name
      : train.source;

  const alightCode = alightStation.station_code.trim().toUpperCase();
  const destinationCode = train.destination_code.trim().toUpperCase();
  const to =
    alightCode && destinationCode && alightCode !== destinationCode
      ? alightStation.station_name
      : train.destination;

  return { from, to };
}

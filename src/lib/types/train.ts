export interface IntermediateStation {
  stationCode: string;
  stationName: string;
  scheduledTime: string;
  distanceFromOrigin: string;
  originDst?: number;
  region_code?: string;
}

export interface ScheduleStop {
  stationCode: string;
  stationName: string;
  scheduledArrivalTime: string;
  scheduledDepartureTime: string;
  distance: number;
  distanceFromOrigin: string;
  dayCount: number;
  platform?: string;
  intermediateStations?: IntermediateStation[];
}

export interface DaysOfRun {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface Train {
  id: number;
  train_no: number;
  train_name: string;
  train_type: string;
  source: string;
  destination: string;
  source_code: string;
  destination_code: string;
  days_of_run: DaysOfRun;
  classes: string[];
  schedule: ScheduleStop[];
  total_duration: number;
  total_distance: string;
  total_number_of_stops: number;
}

export interface TrainApiRecord {
  id: number;
  train_no: number;
  train_name: string;
  train_type: string;
  source: string;
  destination: string;
  source_code: string;
  destination_code: string;
  /** JSON string from search API, or already-parsed object from batch API. */
  days_of_run: string | DaysOfRun;
  classes: string | string[];
  schedule: string | ScheduleStop[];
  total_duration: number;
  total_distance: string;
  total_number_of_stops: number;
}

/** Lightweight record from POST /trains/origin-destination/batch */
export interface TrainOriginDestination {
  train_no: string;
  source_code: string;
  destination_code: string;
  source?: string;
  destination?: string;
}

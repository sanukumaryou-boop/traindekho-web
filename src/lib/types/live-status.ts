import type { DaysOfRun, ScheduleStop } from "@/lib/types/train";

export interface LiveTrainStatusInfo {
  currentStation: string | null;
  upcomingStation: string | null;
  upcomingStationInKms: number | null;
  running_status: string;
  delay?: number | null;
  main_source?: string;
  running_status_overridden?: boolean;
  whereismytrain_running_status?: string;
  provider_running_status?: string;
}

export interface LiveStatusScheduleStop extends ScheduleStop {
  arrivalTime?: string | null;
  departureTime?: string | null;
  delayArr?: number | null;
  delayDep?: number | null;
  originDst?: number;
  platform?: string;
}

export interface TrainLiveStatusResponse {
  train_no: number | string;
  train_name: string;
  train_type: string;
  source: string;
  destination: string;
  source_code: string;
  destination_code: string;
  days_of_run: DaysOfRun;
  classes: string[];
  schedule: LiveStatusScheduleStop[];
  total_duration: number;
  total_distance: string;
  total_number_of_stops: number;
  live_train_status: LiveTrainStatusInfo;
  live_status_source?: string;
}

export type LiveStatusFetchResult =
  | { ok: true; data: TrainLiveStatusResponse }
  | { ok: false; status: number; message: string };

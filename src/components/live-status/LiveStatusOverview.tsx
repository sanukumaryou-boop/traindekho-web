import {
  buildStatusBanner,
  findStationNameByCode,
  formatTrainDelayMessage,
  getTrainDelayMinutes,
} from "@/lib/live-status-helpers";
import type { TrainLiveStatusResponse } from "@/lib/types/live-status";

type LiveStatusOverviewProps = {
  data: TrainLiveStatusResponse;
};

export default function LiveStatusOverview({ data }: LiveStatusOverviewProps) {
  const { live_train_status: live } = data;
  const stationName = findStationNameByCode(data.schedule, live.currentStation);
  const banner = buildStatusBanner(live.running_status, stationName);
  const delayMinutes = getTrainDelayMinutes(data);
  const isLate = (delayMinutes ?? 0) > 0;

  return (
    <div
      className={`rounded-2xl px-4 py-4 sm:px-5 sm:py-5 border ${
        isLate
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`min-w-0 flex-1 text-left text-base sm:text-lg font-extrabold tracking-tight leading-snug ${
            isLate ? "text-red-700" : "text-green-700"
          }`}
        >
          {banner}
        </p>
        <p
          className={`shrink-0 text-right text-sm sm:text-base font-bold whitespace-nowrap ${
            isLate ? "text-red-600" : "text-green-800"
          }`}
        >
          {delayMinutes == null
            ? "On Time"
            : formatTrainDelayMessage(delayMinutes)}
        </p>
      </div>
    </div>
  );
}

import {
  buildStatusBanner,
  findStationNameByCode,
  formatRelativeJourneyDate,
  formatTrainDelayMessage,
  getTrainDelayMinutes,
} from "@/lib/live-status-helpers";
import { titleCase } from "@/lib/format";
import type { TrainLiveStatusResponse } from "@/lib/types/live-status";

type LiveStatusOverviewProps = {
  data: TrainLiveStatusResponse;
  journeyDate: string;
};

export default function LiveStatusOverview({
  data,
  journeyDate,
}: LiveStatusOverviewProps) {
  const { live_train_status: live } = data;
  const stationName = findStationNameByCode(data.schedule, live.currentStation);
  const banner = buildStatusBanner(live.running_status, stationName);
  const delayMinutes = getTrainDelayMinutes(data);

  return (
    <div className="space-y-2">
      <div className="rounded-2xl bg-sky-100/80 border border-sky-200/80 px-4 py-4 sm:px-5 sm:py-5 text-center">
        <p className="text-lg sm:text-xl font-extrabold text-blue-700 tracking-tight">
          {banner}
        </p>

        {delayMinutes != null && (
          <p
            className={`mt-2 text-sm font-semibold ${
              delayMinutes > 0
                ? "text-red-600"
                : delayMinutes < 0
                  ? "text-green-700"
                  : "text-gray-600"
            }`}
          >
            {formatTrainDelayMessage(delayMinutes)}
          </p>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        Journey date: {formatRelativeJourneyDate(journeyDate)}
      </p>
    </div>
  );
}

import { formatScheduleTime } from "@/lib/format";
import type { LiveStatusScheduleStop } from "@/lib/types/live-status";

type LiveStatusTableProps = {
  schedule: LiveStatusScheduleStop[];
  currentStationCode?: string | null;
};

function formatDelay(minutes: number | null | undefined): string {
  if (minutes == null || minutes === 0) return "—";
  if (minutes > 0) return `+${minutes}m`;
  return `${minutes}m`;
}

function formatActualTime(
  scheduled: string,
  actual: string | null | undefined,
): string {
  const scheduledLabel = formatScheduleTime(scheduled);
  if (!actual) return scheduledLabel;
  if (actual === scheduledLabel) return actual;
  return actual;
}

export default function LiveStatusTable({
  schedule,
  currentStationCode,
}: LiveStatusTableProps) {
  const lastIndex = schedule.length - 1;
  const currentCode = currentStationCode?.trim().toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto max-h-[36rem] overflow-y-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-200 shadow-sm">
              <th className="px-4 py-3.5">#</th>
              <th className="px-4 py-3.5">Station</th>
              <th className="px-4 py-3.5">Scheduled</th>
              <th className="px-4 py-3.5">Actual</th>
              <th className="px-4 py-3.5">Delay</th>
              <th className="px-4 py-3.5">Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((stop, index) => {
              const isOrigin = index === 0;
              const isDestination = index === lastIndex;
              const isCurrent =
                currentCode != null &&
                stop.stationCode.trim().toUpperCase() === currentCode;

              const delay = Math.max(stop.delayArr ?? 0, stop.delayDep ?? 0);
              const scheduledArrival = formatScheduleTime(
                stop.scheduledArrivalTime,
              );
              const scheduledDeparture = formatScheduleTime(
                stop.scheduledDepartureTime,
              );
              const actualArrival = stop.arrivalTime
                ? formatScheduleTime(stop.arrivalTime)
                : null;
              const actualDeparture = stop.departureTime
                ? formatScheduleTime(stop.departureTime)
                : null;

              return (
                <tr
                  key={`${stop.stationCode}-${index}`}
                  className={`transition-colors ${
                    isCurrent
                      ? "bg-blue-50/80 ring-1 ring-inset ring-blue-200"
                      : isOrigin
                        ? "bg-green-50/50 hover:bg-green-50"
                        : isDestination
                          ? "bg-blue-50/40 hover:bg-blue-50"
                          : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-400 tabular-nums">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-blue-600">
                        {stop.stationCode}
                      </span>
                      <span className="font-medium text-gray-900">
                        {stop.stationName}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Here
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gray-600">
                    <div>{isOrigin ? "—" : scheduledArrival}</div>
                    <div className="font-medium text-gray-900">
                      {isDestination ? "—" : scheduledDeparture}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gray-900">
                    <div>
                      {isOrigin
                        ? "—"
                        : formatActualTime(
                            stop.scheduledArrivalTime,
                            actualArrival,
                          )}
                    </div>
                    <div className="font-semibold">
                      {isDestination
                        ? "—"
                        : formatActualTime(
                            stop.scheduledDepartureTime,
                            actualDeparture,
                          )}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 tabular-nums font-medium ${
                      delay > 0 ? "text-amber-700" : "text-gray-500"
                    }`}
                  >
                    {formatDelay(delay > 0 ? delay : null)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {stop.platform?.replace(/^PLATFORM\s/i, "Pl. ") ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { ScheduleStop, Train } from "@/lib/types/train";
import { formatScheduleTime } from "@/lib/format";

interface ScheduleTableProps {
  schedule: ScheduleStop[];
}

export default function ScheduleTable({ schedule }: ScheduleTableProps) {
  const lastIndex = schedule.length - 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-200 shadow-sm">
              <th className="px-4 py-3.5">#</th>
              <th className="px-4 py-3.5">Station</th>
              <th className="px-4 py-3.5">Arrival</th>
              <th className="px-4 py-3.5">Departure</th>
              <th className="px-4 py-3.5">Distance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((stop, index) => {
              const isOrigin = index === 0;
              const isDestination = index === lastIndex;

              return (
                <tr
                  key={`${stop.stationCode}-${index}`}
                  className={`transition-colors ${
                    isOrigin
                      ? "bg-green-50/70 hover:bg-green-50"
                      : isDestination
                        ? "bg-blue-50/70 hover:bg-blue-50"
                        : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-400 tabular-nums">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-blue-600">
                        {stop.stationCode}
                      </span>
                      <span className="font-medium text-gray-900">{stop.stationName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gray-700">
                    {formatScheduleTime(stop.scheduledArrivalTime)}
                  </td>
                  <td className="px-4 py-3 tabular-nums font-medium text-gray-900">
                    {formatScheduleTime(stop.scheduledDepartureTime)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gray-500">
                    {stop.distanceFromOrigin || `${stop.distance} km`}
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

interface TrainSummaryProps {
  train: Train;
}

export function TrainSummary({ train }: TrainSummaryProps) {
  const firstStop = train.schedule[0];
  const lastStop = train.schedule[train.schedule.length - 1];

  const items = [
    { label: "Train Number", value: String(train.train_no) },
    { label: "Type", value: train.train_type },
    {
      label: "Departure",
      value: formatScheduleTime(firstStop?.scheduledDepartureTime ?? "—"),
    },
    {
      label: "Arrival",
      value: formatScheduleTime(lastStop?.scheduledArrivalTime ?? "—"),
    },
    { label: "Distance", value: train.total_distance },
    { label: "Stops", value: String(train.total_number_of_stops) },
    { label: "Classes", value: train.classes.join(", ") || "—" },
    {
      label: "Route",
      value: `${train.source_code} → ${train.destination_code}`,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
        Quick Facts
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 sm:p-4 border border-gray-100">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 leading-snug">{value}</p>
    </div>
  );
}

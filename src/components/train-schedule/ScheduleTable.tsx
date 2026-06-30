import type { ScheduleStop, Train } from "@/lib/types/train";
import { formatScheduleTime } from "@/lib/format";

interface ScheduleTableProps {
  schedule: ScheduleStop[];
}

export default function ScheduleTable({ schedule }: ScheduleTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Station</th>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Arrival</th>
            <th className="px-4 py-3">Departure</th>
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Distance</th>
            <th className="px-4 py-3">Platform</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {schedule.map((stop, index) => (
            <tr
              key={`${stop.stationCode}-${index}`}
              className="hover:bg-blue-50/40 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400 tabular-nums">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {stop.stationName}
              </td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                {stop.stationCode}
              </td>
              <td className="px-4 py-3 tabular-nums text-gray-700">
                {formatScheduleTime(stop.scheduledArrivalTime)}
              </td>
              <td className="px-4 py-3 tabular-nums text-gray-700">
                {formatScheduleTime(stop.scheduledDepartureTime)}
              </td>
              <td className="px-4 py-3 tabular-nums text-gray-500">
                {stop.dayCount}
              </td>
              <td className="px-4 py-3 tabular-nums text-gray-500">
                {stop.distanceFromOrigin || `${stop.distance} kms`}
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {stop.platform?.replace("PLATFORM ", "P") ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TrainSummaryProps {
  train: Train;
}

export function TrainSummary({ train }: TrainSummaryProps) {
  const firstStop = train.schedule[0];
  const lastStop = train.schedule[train.schedule.length - 1];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <SummaryCard label="Train Number" value={String(train.train_no)} />
      <SummaryCard label="Type" value={train.train_type} />
      <SummaryCard
        label="Departure"
        value={formatScheduleTime(firstStop?.scheduledDepartureTime ?? "—")}
      />
      <SummaryCard
        label="Arrival"
        value={formatScheduleTime(lastStop?.scheduledArrivalTime ?? "—")}
      />
      <SummaryCard label="Total Distance" value={train.total_distance} />
      <SummaryCard label="Total Stops" value={String(train.total_number_of_stops)} />
      <SummaryCard label="Classes" value={train.classes.join(", ")} />
      <SummaryCard
        label="Route"
        value={`${train.source_code} → ${train.destination_code}`}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

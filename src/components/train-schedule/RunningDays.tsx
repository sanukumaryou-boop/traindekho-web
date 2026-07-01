import type { DaysOfRun } from "@/lib/types/train";

const DAYS: { key: keyof DaysOfRun; label: string }[] = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

export default function RunningDays({ days }: { days: DaysOfRun }) {
  return (
    <div className="flex items-center gap-1" aria-label="Running days">
      {DAYS.map((day) => (
        <span
          key={day.key}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
            days[day.key]
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {day.label}
        </span>
      ))}
    </div>
  );
}

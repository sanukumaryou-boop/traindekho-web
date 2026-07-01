import type { DaysOfRun } from "@/lib/types/train";

const DAY_LABELS: { key: keyof DaysOfRun; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatScheduleTime(time: string): string {
  if (time === "SOURCE" || time === "DESTINATION") return "—";
  return time;
}

export function formatRunningDays(days: DaysOfRun): string {
  const active = DAY_LABELS.filter((d) => days[d.key]).map((d) => d.label);
  return active.length === 7 ? "Daily" : active.join(", ");
}

export function titleCase(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

import Link from "next/link";
import { getLiveTrainStatusHref } from "@/lib/train-schedule-href";

type TrainScheduleLiveStatusLinkProps = {
  trainNo: number | string;
  variant?: "primary" | "light";
  className?: string;
};

export default function TrainScheduleLiveStatusLink({
  trainNo,
  variant = "primary",
  className = "",
}: TrainScheduleLiveStatusLinkProps) {
  const styles =
    variant === "light"
      ? "bg-white text-blue-700 hover:bg-blue-50"
      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm";

  return (
    <Link
      href={getLiveTrainStatusHref(trainNo)}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${styles} ${className}`}
    >
      <LiveStatusIcon className="w-4 h-4" />
      Live Status
    </Link>
  );
}

function LiveStatusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
        fill="currentColor"
      />
    </svg>
  );
}

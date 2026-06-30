"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function TrainSearch() {
  const router = useRouter();
  const [trainNo, setTrainNo] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = trainNo.replace(/\D/g, "");

    if (!digits || digits.length < 4 || digits.length > 5) {
      setError("Enter a valid 4–5 digit train number");
      return;
    }

    setError("");
    router.push(`/train-schedule/${digits}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="train-no"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Train number
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="train-no"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          placeholder="e.g. 12951"
          value={trainNo}
          onChange={(e) => {
            setTrainNo(e.target.value.replace(/\D/g, ""));
            if (error) setError("");
          }}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 shadow-sm transition-colors whitespace-nowrap"
        >
          <ScheduleIcon className="w-4 h-4" />
          View Schedule
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
        fill="currentColor"
      />
    </svg>
  );
}

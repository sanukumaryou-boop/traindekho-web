import type { FaqItem } from "@/lib/train-schedule-faq";

type TrainScheduleFAQProps = {
  items: FaqItem[];
  heading?: string;
};

export default function TrainScheduleFAQ({
  items,
  heading = "Frequently Asked Questions",
}: TrainScheduleFAQProps) {
  return (
    <section aria-labelledby={heading ? "train-schedule-faq-heading" : undefined}>
      {heading ? (
        <h2
          id="train-schedule-faq-heading"
          className="text-lg font-bold text-gray-900 mb-4"
        >
          {heading}
        </h2>
      ) : null}

      <div className="rounded-3xl bg-white ring-1 ring-gray-200 divide-y divide-gray-100 overflow-hidden">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 sm:px-6 py-5 text-sm sm:text-[0.95rem] font-medium text-gray-900 hover:bg-gray-50/80 transition-colors [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronIcon className="w-5 h-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 sm:px-6 pb-5 pt-0">
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

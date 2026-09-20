const steps = [
  {
    step: "01",
    title: "Search your train or PNR",
    description:
      "Enter a train number or name, a station-to-station route, or a 10-digit PNR.",
  },
  {
    step: "02",
    title: "Track, book, or pick an alternative",
    description:
      "See live status, book a ticket, or switch to alternative trains if yours is waitlisted, RAC, or has already left.",
  },
  {
    step: "03",
    title: "Turn on alerts and share",
    description:
      "Get live status and PNR alerts, and share live tracking with anyone in one tap.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-20 sm:py-24 bg-blue-50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-blue-500 mb-3">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-display text-3xl sm:text-5xl text-blue-900 tracking-tight"
          >
            From search to alerts in 3 steps
          </h2>
        </div>

        <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[2.15rem] left-[12%] right-[12%] h-px bg-blue-200"
          />
          {steps.map((s) => (
            <li
              key={s.step}
              className="relative rounded-[1.5rem] bg-white ring-1 ring-blue-100 p-7 sm:p-8"
            >
              <span className="relative z-10 mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 font-mono text-xs text-sky-200">
                {s.step}
              </span>
              <h3 className="font-display text-2xl text-blue-900 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

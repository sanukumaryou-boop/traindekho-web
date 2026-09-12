const steps = [
  {
    step: "01",
    title: "Search your train or PNR",
    description:
      "Enter a train number or name, a station-to-station route, or a 10-digit PNR.",
  },
  {
    step: "02",
    title: "Track, check, or book",
    description:
      "See live status and delays, check PNR and berth details, or book tickets with seat availability.",
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
      className="py-20 sm:py-24 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 mb-3">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight"
          >
            From search to alerts in 3 steps
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <li
              key={s.step}
              className="rounded-3xl bg-gray-50 p-7 sm:p-8"
            >
              <span className="block font-mono text-sm font-medium text-gray-400 mb-4">
                {s.step}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

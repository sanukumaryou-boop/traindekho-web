const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Live Train Tracking",
    description:
      "Real-time running status with last crossed station, delay in minutes, and a station-by-station timeline with actual vs. scheduled times.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Route Search for Stations",
    description:
      "Search trains between any origin and destination, or find a train by name or number. Recent searches are saved for quick access.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Alternative Trains",
    description:
      "When no direct train is available, discover connecting routes with boarding/alighting stations, duration, running days, and stop count.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0117.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Multilang Support",
    description:
      "Switch between Hindi and English — station names, status updates, and the full interface in the language you prefer.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 sm:py-28 bg-gray-50"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Features
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Everything a Train Traveller Needs
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Train Dekho packs all the tools you need to travel confidently on
            Indian Railways — no guesswork, no missed trains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

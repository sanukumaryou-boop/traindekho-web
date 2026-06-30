import Image from "next/image";

const screens = [
  {
    src: "/images/screenshot-live-tracking.png",
    alt: "Train Dekho live tracking screen – real-time train location with delay info and station timeline",
    title: "Live Train Tracking",
    description:
      "See exactly where your train is right now — last crossed station, current delay in minutes, and a full station timeline with actual vs. scheduled times.",
  },
  {
    src: "/images/screenshot-route-search.png",
    alt: "Train Dekho home screen – search trains by origin, destination or train number",
    title: "Route Search for Stations",
    description:
      "Search trains between any two stations or look up a train by name or number. Recent searches are saved so repeat lookups take one tap.",
  },
  {
    src: "/images/screenshot-alternative-trains.png",
    alt: "Train Dekho alternative trains screen – connecting routes when no direct train is available",
    title: "Alternative Trains",
    description:
      "No direct train? Browse alternative routes with boarding and alighting stations, journey duration, running days, distance, and stop count.",
  },
  {
    src: "/images/screenshot-multilang.png",
    alt: "Train Dekho live status in Hindi – full multilanguage support for Indian travellers",
    title: "Multilang Support",
    description:
      "Use the app in Hindi or English — station names, status messages, and the entire interface adapt to your preferred language.",
  },
];

export default function Preview() {
  return (
    <section
      id="preview"
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="preview-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            App Preview
          </span>
          <h2
            id="preview-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Clean, Fast & Easy to Use
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Designed for real travellers — information that matters, with zero clutter.
          </p>
        </div>

        <div className="space-y-20">
          {screens.map((screen, i) => (
            <div
              key={screen.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-10 lg:gap-16`}
            >
              <div className="flex-shrink-0">
                <div className="relative w-56 sm:w-64 mx-auto">
                  <div className="rounded-[2.8rem] overflow-hidden border-[6px] border-gray-800 bg-gray-900 shadow-2xl ring-1 ring-gray-700">
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      width={360}
                      height={720}
                      className="w-full h-auto"
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-900 rounded-full" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold text-lg mb-5">
                  {i + 1}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                  {screen.title}
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {screen.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

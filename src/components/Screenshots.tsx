import Image from "next/image";

const screens = [
  {
    src: "/images/screenshot-home.png",
    alt: "Train Dekho home screen – search trains by origin, destination or train number",
    title: "Search Any Train Instantly",
    description:
      "Search by origin–destination pair or enter a train number directly. Recent searches appear below so repeat lookups take one tap.",
  },
  {
    src: "/images/screenshot-train.png",
    alt: "Train Dekho live status screen – real-time train location with delay info and station timeline",
    title: "Live Status & Delay Info",
    description:
      "See the train's last crossed station, next major stop, current delay in minutes, and a full station timeline with actual vs. scheduled times.",
  },
];

export default function Screenshots() {
  return (
    <section
      id="screenshots"
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="screenshots-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Screenshots
          </span>
          <h2
            id="screenshots-heading"
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
              {/* Phone mockup */}
              <div className="flex-shrink-0">
                <div className="relative w-56 sm:w-64 mx-auto">
                  <div className="rounded-[2.8rem] overflow-hidden border-[6px] border-gray-800 bg-gray-900 shadow-2xl ring-1 ring-gray-700">
              <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={360}
                  height={720}
                  className="w-full h-auto"
                  loading="eager"
                />
                  </div>
                  {/* notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-900 rounded-full" />
                </div>
              </div>

              {/* Text */}
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

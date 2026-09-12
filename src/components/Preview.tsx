import Image from "next/image";

const screens = [
  {
    src: "/images/screenshot-live-tracking.png",
    alt: "Train Dekho live tracking screen – real-time train location with delay info and station timeline",
    title: "Live train tracking",
    description:
      "Last crossed station, delay in minutes, and a station timeline with actual vs scheduled times.",
  },
  {
    src: "/images/screenshot-home.png",
    alt: "Train Dekho home screen – search trains by origin, destination or train number",
    title: "Search that gets out of the way",
    description:
      "Look up a train by number, name, or route. Recent searches stay one tap away.",
  },
];

export default function Preview() {
  return (
    <section
      id="preview"
      className="py-20 sm:py-24 bg-white"
      aria-labelledby="preview-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 mb-3">
            App preview
          </p>
          <h2
            id="preview-heading"
            className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight"
          >
            Clean, fast, and easy to use
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            Designed for real travellers — the information that matters, with
            zero clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start max-w-3xl mx-auto">
          {screens.map((screen) => (
            <div key={screen.title} className="flex flex-col items-center text-center">
              <div className="relative w-44 sm:w-52 mb-6">
                <div className="rounded-[2.2rem] overflow-hidden border-[5px] border-gray-200 bg-gray-900 shadow-xl">
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    width={360}
                    height={720}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {screen.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                {screen.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

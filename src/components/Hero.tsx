import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Train Tracking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Know Exactly{" "}
              <span className="text-sky-200">Where</span>{" "}
              Your Train Is
            </h1>

            <p className="text-blue-100 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Real-time running status, live delays, station-by-station tracking
              and full schedules for every Indian Railways train — right in your pocket.
            </p>

            <a
              id="download"
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Train Dekho on Google Play"
              className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <GooglePlayIcon className="w-5 h-5" />
              Get it on Google Play
            </a>
          </div>

          {/* Phone mockups */}
          <div className="flex-shrink-0 flex items-end justify-center gap-4 lg:gap-6">
            <div className="relative w-48 sm:w-56 drop-shadow-2xl rotate-[-4deg] translate-y-4">
              <div className="rounded-[2.5rem] overflow-hidden border-4 border-white/20 bg-gray-900 shadow-2xl">
                <Image
                  src="/images/screenshot-route-search.png"
                  alt="Train Dekho home screen – search trains by route or number"
                  width={360}
                  height={720}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
            <div className="relative w-48 sm:w-56 drop-shadow-2xl rotate-[3deg]">
              <div className="rounded-[2.5rem] overflow-hidden border-4 border-white/20 bg-gray-900 shadow-2xl">
                <Image
                  src="/images/screenshot-live-tracking.png"
                  alt="Train Dekho live status screen – real-time train position and delay info"
                  width={360}
                  height={720}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 border-t border-white/20 pt-10">
          {[
            { value: "14,000+", label: "Trains Tracked" },
            { value: "8,000+", label: "Stations" },
            { value: "Real-time", label: "Live Updates" },
            { value: "Free", label: "Always" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className}>
      <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
      <path fill="#4285F4" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" />
      <path fill="#FBBC04" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c17.1-9.8 17.1-35.1-.1-44.9z" />
      <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

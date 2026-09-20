import PhoneFrame from "@/components/PhoneFrame";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Live status",
    description:
      "See where your train is right now — last station, delay in minutes, and actual vs scheduled times at every stop.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Live status alerts",
    description:
      "Get a push alert when the train is delayed, running late, or approaching your station — so you don’t have to keep checking.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "PNR status",
    description:
      "Enter a 10-digit PNR to see confirmation, coach, berth, and chart status — no login required.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "PNR alerts",
    description:
      "Turn on alerts for a waitlisted or RAC ticket and get notified when the status changes or the chart is prepared.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Ticket booking",
    description:
      "Search trains between stations, check class-wise seat availability, and book tickets from the app.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Share live status",
    description:
      "Send the live running status to family or friends in one tap, so they can follow the same train without the app setup.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="pt-20 pb-16 sm:pt-28 sm:pb-24 bg-blue-50"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-blue-500 mb-3">
            App features
          </p>
          <h2
            id="features-heading"
            className="font-display text-3xl sm:text-5xl text-blue-900 tracking-tight"
          >
            Everything you need for the journey
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Alternative train recommendations when you book, plus live status,
            PNR, alerts, and sharing — all in Train Dekho on Android.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] bg-blue-900 text-white p-6 sm:p-8 lg:p-10 mb-8">
          <div className="hero-rail-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-sky-300/30 bg-sky-400/10 text-sky-200 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 mb-4">
                Most used for booking
              </span>
              <h3 className="font-display text-2xl sm:text-4xl tracking-tight mb-3">
                Alternative train recommendations
              </h3>
              <p className="text-white/65 text-base leading-relaxed mb-5">
                If your train is waitlisted, RAC, or has already left, Train
                Dekho shows other trains on the same route — with seat
                availability and fare — so you can book the next best option.
              </p>
              <ul className="space-y-2.5 text-sm text-white/75">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                  Direct trains and alternative routes between two stations
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                  Suggested trains while checking availability and booking
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                  Class-wise availability (SL, 3A, 2A, 1A) and Book Now
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-3 sm:gap-4">
              <PhoneFrame
                src="/images/screenshot-book-ticket.png"
                alt="Train Dekho booking results with Direct and Alternative trains between New Delhi and Kanpur"
                className="w-[42%] max-w-[180px]"
              />
              <PhoneFrame
                src="/images/screenshot-alternatives.png"
                alt="Suggested alternative trains with seat availability and Book Now"
                className="w-[42%] max-w-[180px]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, index) => (
            <div
              key={f.title}
              className="rounded-[1.5rem] bg-white ring-1 ring-blue-100 p-7 sm:p-8"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-sky-200 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="font-mono text-[11px] text-blue-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

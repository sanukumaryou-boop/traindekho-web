const steps = [
  {
    step: "01",
    title: "Search Your Train",
    description:
      "Enter the origin and destination stations or type the train number or name in the search box.",
  },
  {
    step: "02",
    title: "Pick Your Train",
    description:
      "Choose from the list of trains on that route. See departure times, duration, and available classes.",
  },
  {
    step: "03",
    title: "Track in Real Time",
    description:
      "Open the live status screen to see exactly where the train is, current delay, and upcoming stops.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-blue-700 to-sky-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-sky-200 text-sm font-semibold uppercase tracking-widest mb-3">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track Any Train in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-white/20" />

          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 border-2 border-white/30 text-white font-extrabold text-xl mb-5 backdrop-blur-sm">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-blue-100 text-base leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

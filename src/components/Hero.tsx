import HomepageSearch from "@/components/HomepageSearch";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4?v=3" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/40" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1 className="sr-only">
          Train Dekho – live train status, PNR, alerts, and ticket booking
        </h1>
        <HomepageSearch />
      </div>
    </section>
  );
}

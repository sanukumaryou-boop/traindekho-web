import HomepageSearch from "@/components/HomepageSearch";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-blue-900 text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4?v=3" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-blue-900/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/25 via-transparent to-blue-900/45" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="max-md:sr-only font-display md:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,20,50,0.65)] md:mb-8">
          See your train before you{" "}
          <em className="italic text-white">reach the station</em>
        </h1>
        <HomepageSearch />
      </div>
    </section>
  );
}

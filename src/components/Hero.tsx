import Image from "next/image";
import HomepageSearch from "@/components/HomepageSearch";
import heroBackground from "../../public/images/hero-bg-graphic.png";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Image
        src={heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-zinc-950/50" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1 className="sr-only">
          Train Dekho – live train running status and schedule
        </h1>
        <HomepageSearch />
      </div>
    </section>
  );
}

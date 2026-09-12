import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
// import Preview from "@/components/Preview";
import HowItWorks from "@/components/HowItWorks";
import HomepageFAQ from "@/components/HomepageFAQ";
import DownloadCTA from "@/components/DownloadCTA";
import StickyDownloadBar from "@/components/StickyDownloadBar";
import Footer from "@/components/Footer";

export default function HomeShell() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* <Preview /> */}
        <HowItWorks />
        <HomepageFAQ />
        <DownloadCTA />
      </main>
      <StickyDownloadBar />
      <Footer />
    </>
  );
}

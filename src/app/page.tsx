import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Preview from "@/components/Preview";
import HowItWorks from "@/components/HowItWorks";
import DownloadCTA from "@/components/DownloadCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Train Dekho – Live Train Running Status & Schedule",
  description:
    "Track any Indian Railways train in real time. Check live running status, station-by-station schedule, delay alerts, and upcoming stops — free on Android.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://traindekho.live/#website",
      url: "https://traindekho.live",
      name: "Train Dekho",
      description:
        "Live train running status and schedule app for Indian Railways",
      inLanguage: "en-IN",
    },
    {
      "@type": "MobileApplication",
      "@id": "https://traindekho.live/#app",
      name: "Train Dekho",
      description:
        "Track any Indian Railways train in real time. Check live running status, station schedules, PNR status, and delay alerts.",
      applicationCategory: "TravelApplication",
      operatingSystem: "Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        ratingCount: "10000",
      },
      screenshot: [
        "https://traindekho.live/images/screenshot-live-tracking.png",
        "https://traindekho.live/images/screenshot-route-search.png",
        "https://traindekho.live/images/screenshot-alternative-trains.png",
        "https://traindekho.live/images/screenshot-multilang.png",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://traindekho.live/#organization",
      name: "Train Dekho",
      url: "https://traindekho.live",
      logo: "https://traindekho.live/images/logo.png",
      sameAs: [],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Preview />
        <HowItWorks />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}

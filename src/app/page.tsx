import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";
import { HOMEPAGE_FAQ } from "@/lib/homepage-faq";
import { buildFaqPageJsonLd } from "@/lib/train-schedule-faq";

export const metadata: Metadata = {
  title: "Train Dekho – Live Train Status, PNR & Ticket Booking",
  description:
    "Track live train status, get alternative train recommendations when you book, check PNR, and share live running status for Indian Railways — free on Android.",
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
        "Live train status, PNR, alerts, ticket booking, and sharing for Indian Railways",
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://traindekho.live/train-schedule/{search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "MobileApplication",
      "@id": "https://traindekho.live/#app",
      name: "Train Dekho",
      description:
        "Track any Indian Railways train in real time. Live status, alternative train recommendations, PNR, alerts, ticket booking, and share live status.",
      applicationCategory: "TravelApplication",
      operatingSystem: "Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      screenshot: [
        "https://traindekho.live/images/screenshot-search.png",
        "https://traindekho.live/images/screenshot-route-live.png",
        "https://traindekho.live/images/screenshot-live-status.png",
        "https://traindekho.live/images/screenshot-book-ticket.png",
        "https://traindekho.live/images/screenshot-alternatives.png",
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
    buildFaqPageJsonLd(HOMEPAGE_FAQ),
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeShell />
    </>
  );
}

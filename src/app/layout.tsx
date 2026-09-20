import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";

import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://traindekho.live"),
  title: {
    default: "Train Dekho – Live Train Status, PNR & Ticket Booking",
    template: "%s | Train Dekho",
  },
  description:
    "Train Dekho lets you track live train status, get alternative train recommendations when booking, check PNR, and share live running status for Indian Railways — free on Android.",
  keywords: [
    "train running status",
    "live train status",
    "Indian Railways",
    "PNR status",
    "train schedule",
    "pnr alerts",
    "alternative trains",
    "ticket booking",
    "share live status",
    "live status alerts",
    "where is my train",
    "train tracker India",
    "IRCTC train status",
    "train dekho",
  ],
  authors: [{ name: "Train Dekho" }],
  creator: "Train Dekho",
  publisher: "Train Dekho",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://traindekho.live",
    siteName: "Train Dekho",
    title: "Train Dekho – Live Train Status, PNR & Ticket Booking",
    description:
      "Live status, PNR alerts, ticket booking, and share live running status for Indian Railways — all in one app.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Train Dekho – live train status for Indian Railways",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Train Dekho – Live Train Status, PNR & Ticket Booking",
    description:
      "Live status, PNR, alerts, ticket booking, and share live status for Indian Railways.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://traindekho.live",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${plusJakartaSans.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}

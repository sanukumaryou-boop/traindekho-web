import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://traindekho.live"),
  title: {
    default: "Train Dekho – Live Train Running Status & Schedule",
    template: "%s | Train Dekho",
  },
  description:
    "Train Dekho lets you track live train running status, check schedules, find PNR status, and get real-time delay updates for every Indian Railways train — right from your phone.",
  keywords: [
    "train running status",
    "live train status",
    "Indian Railways",
    "PNR status",
    "train schedule",
    "train delay",
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
    title: "Train Dekho – Live Train Running Status & Schedule",
    description:
      "Track any Indian Railways train in real time. Check live running status, departure & arrival times, and delay updates — all in one app.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Train Dekho App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Train Dekho – Live Train Running Status & Schedule",
    description:
      "Track any Indian Railways train in real time. Live status, schedule, and delay updates.",
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
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${plusJakartaSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}

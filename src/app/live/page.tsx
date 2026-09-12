import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";

export const metadata: Metadata = {
  title: "Live Train Status",
  description:
    "Track live running status for any Indian Railways train — current location, delays, and station-wise actual times.",
  alternates: {
    canonical: "https://traindekho.live/live",
  },
};

export default function LiveSearchPage() {
  return <HomeShell />;
}

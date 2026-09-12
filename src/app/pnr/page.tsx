import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";

export const metadata: Metadata = {
  title: "PNR Status",
  description:
    "Check Indian Railways PNR status in the Train Dekho Android app — confirmation, coach, and berth updates.",
  alternates: {
    canonical: "https://traindekho.live/pnr",
  },
};

export default function PnrSearchPage() {
  return <HomeShell />;
}

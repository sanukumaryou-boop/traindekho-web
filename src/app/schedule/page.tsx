import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";

export const metadata: Metadata = {
  title: "Train Schedule",
  description:
    "Look up the full station-wise schedule for any Indian Railways train by number or name.",
  alternates: {
    canonical: "https://traindekho.live/schedule",
  },
};

export default function ScheduleSearchPage() {
  return <HomeShell />;
}

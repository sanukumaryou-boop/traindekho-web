import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Live Train Status",
  description:
    "Track live running status for any Indian Railways train — coming soon on Train Dekho web.",
  alternates: {
    canonical: "https://traindekho.live/live-train-status",
  },
};

export default function LiveTrainStatusPage() {
  return (
    <>
      <Navbar />
      <ComingSoon title="Live Train Status" breadcrumb="Live Train Status" />
      <Footer />
    </>
  );
}

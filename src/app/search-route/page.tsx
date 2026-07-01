import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Search Route",
  description:
    "Search trains between any two stations — coming soon on Train Dekho web.",
  alternates: {
    canonical: "https://traindekho.live/search-route",
  },
};

export default function SearchRoutePage() {
  return (
    <>
      <Navbar />
      <ComingSoon
        title="Search Route"
        breadcrumb="Search Route"
        description="Find trains between any origin and destination, with direct and alternative route options."
      />
      <Footer />
    </>
  );
}

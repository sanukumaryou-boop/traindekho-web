import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for the Train Dekho app.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Use</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: June 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            By downloading or using the Train Dekho app, you agree to these Terms of Use. Please read them
            carefully.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-6">Use of Service</h2>
          <p>
            Train Dekho provides train tracking information sourced from Indian Railways / NTES for
            informational purposes only. We do not guarantee the accuracy, completeness, or timeliness of
            the data.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-6">Limitation of Liability</h2>
          <p>
            Train Dekho shall not be held liable for any loss or inconvenience arising from inaccurate or
            delayed train data. Always verify critical travel information with official Indian Railways
            sources.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-6">Contact</h2>
          <p>
            For questions about these terms, contact{" "}
            <a href="mailto:legal@traindekho.app" className="text-blue-600 hover:underline">
              legal@traindekho.app
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

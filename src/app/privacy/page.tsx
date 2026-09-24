import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Train Dekho app.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: June 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            Train Dekho (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and safeguard your information when you use our
            mobile application and website.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-6">Information We Collect</h2>
          <p>
            We collect only the minimum data required to provide our service, including train search queries
            which are stored locally on your device and never sent to our servers. We do not require account
            registration.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-6">How We Use Information</h2>
          <p>
            Search history is stored locally on your device to provide the &quot;Recent Searches&quot; feature.
            We may collect anonymised usage analytics to improve the app experience.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-6">Contact</h2>
          <p>
            For any privacy concerns, please contact us at{" "}
            <a href="mailto:ankit@traindekho.live" className="text-blue-600 hover:underline">
              ankit@traindekho.live
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

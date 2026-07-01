import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Train Dekho team.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Contact Us</h1>
        <div className="space-y-4 text-gray-700">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">General</p>
            <a href="mailto:hello@traindekho.app" className="text-blue-600 hover:underline font-medium">
              hello@traindekho.app
            </a>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Support</p>
            <a href="mailto:support@traindekho.app" className="text-blue-600 hover:underline font-medium">
              support@traindekho.app
            </a>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Privacy</p>
            <a href="mailto:privacy@traindekho.app" className="text-blue-600 hover:underline font-medium">
              privacy@traindekho.app
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

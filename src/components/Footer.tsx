import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <Image
                src="/images/logo.png"
                alt="Train Dekho"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-white font-bold text-lg">Train Dekho</span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Real-time Indian Railways train tracking, live running status, and
              schedules — free on Android.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer navigation">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#screenshots" className="hover:text-white transition-colors">Screenshots</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Train Dekho. All rights reserved.</p>
          <p>
            Data sourced from{" "}
            <span className="text-gray-300">Indian Railways / NTES</span>.
            For informational use only.
          </p>
        </div>
      </div>
    </footer>
  );
}

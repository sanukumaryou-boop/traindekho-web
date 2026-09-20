import Image from "next/image";
import Link from "next/link";
import { playStoreUrl } from "@/lib/google-play-href";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white/55">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <Image
                src="/images/logo.png"
                alt="Train Dekho"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="font-display text-white text-xl">Train Dekho</span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Real-time Indian Railways tracking — live status, alternative
              trains, PNR, alerts, ticket booking, and sharing. Free on Android.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer navigation">
            <Link href="/train-schedule" className="hover:text-white transition-colors">Train Schedule</Link>
            <Link href="/live-train-status" className="hover:text-white transition-colors">Live Train Status</Link>
            <Link href="/search-route" className="hover:text-white transition-colors">Search Route</Link>
            <Link href="/#download" className="hover:text-white transition-colors">Download</Link>
            <a
              href={playStoreUrl({ campaign: "footer", medium: "web" })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Google Play
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Train Dekho. All rights reserved.</p>
          <p>
            Data sourced from{" "}
            <span className="text-white/80">Indian Railways / NTES</span>.
            For informational use only.
          </p>
        </div>
      </div>
    </footer>
  );
}

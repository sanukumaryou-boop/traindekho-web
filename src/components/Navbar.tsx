import Image from "next/image";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { mainNavLinks } from "@/components/nav-links";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1 min-w-0">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <Image
                src="/images/logo.png"
                alt="Train Dekho Logo"
                width={40}
                height={40}
                className="rounded-lg shrink-0"
                priority
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight truncate">
                Train Dekho
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-gray-600">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-full transition-colors shadow-sm shrink-0"
          >
            <span className="hidden sm:inline">Get the App</span>
            <span className="sm:hidden">App</span>
          </a>
        </div>
      </div>
    </header>
  );
}

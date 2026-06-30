import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Train Dekho Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Train Dekho
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/#preview" className="hover:text-blue-600 transition-colors">Preview</Link>
            <Link href="/train-schedule" className="hover:text-blue-600 transition-colors">Train Schedule</Link>
          </nav>
          <a
              href="https://play.google.com/store"
              target="_blank"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            Get the App
          </a>
        </div>
      </div>
    </header>
  );
}

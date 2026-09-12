"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import PlayStoreButton from "@/components/PlayStoreButton";
import { mainNavLinks } from "@/components/nav-links";
import { useKeyboardOpen } from "@/hooks/useKeyboardOpen";

export default function Navbar() {
  const pathname = usePathname();
  const isHome =
    pathname === "/" ||
    pathname === "/live" ||
    pathname === "/pnr" ||
    pathname === "/schedule";
  const [scrolled, setScrolled] = useState(false);
  const keyboardOpen = useKeyboardOpen();

  useEffect(() => {
    if (!isHome) return;

    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  if (keyboardOpen) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solid ? "bg-white/95 border-b border-gray-100 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 min-w-0">
            <MobileNav tone={solid ? "dark" : "light"} />
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <Image
                src="/images/logo.png"
                alt="Train Dekho logo"
                width={32}
                height={32}
                className="rounded-lg shrink-0"
                priority
              />
              <span
                className={`text-base font-semibold tracking-tight truncate ${
                  solid ? "text-gray-900" : "text-white"
                }`}
              >
                Train Dekho
              </span>
            </Link>

            <span
              aria-hidden="true"
              className={`hidden md:block h-4 w-px mx-1 ${
                solid ? "bg-gray-200" : "bg-white/25"
              }`}
            />

            <nav
              className={`hidden md:flex items-center gap-5 text-[13px] ${
                solid ? "text-gray-500" : "text-white/75"
              }`}
            >
              {mainNavLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap transition-colors ${
                      active
                        ? solid
                          ? "text-gray-900"
                          : "text-white"
                        : solid
                          ? "hover:text-gray-900"
                          : "hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <PlayStoreButton
            placement="nav"
            medium="web"
            variant={solid ? "ghostDark" : "ghost"}
            label="Get the app"
          />
        </div>
      </div>
    </header>
  );
}

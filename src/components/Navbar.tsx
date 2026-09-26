"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import { mainNavLinks } from "@/components/nav-links";
import { useKeyboardOpen } from "@/hooks/useKeyboardOpen";
import { logEvent } from "@/lib/analytics";
import { playStoreUrl } from "@/lib/google-play-href";

export default function Navbar({
  className,
  containerClassName = "max-w-6xl",
}: {
  className?: string;
  containerClassName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const isHome =
    pathname === "/" ||
    pathname === "/live" ||
    pathname === "/pnr" ||
    pathname === "/schedule";
  const [scrolled, setScrolled] = useState(false);
  const keyboardOpen = useKeyboardOpen();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/developers/session")
      .then((response) => {
        if (!cancelled) setSignedIn(response.ok);
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function logout() {
    await fetch("/api/developers/logout", { method: "POST" });
    setSignedIn(false);
    router.push("/developers");
    router.refresh();
  }

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
  const onDevelopers = pathname === "/developers" || pathname.startsWith("/developers/");

  if (keyboardOpen) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solid ? "bg-white/95 border-b border-gray-100 backdrop-blur-xl" : "bg-transparent"
      } ${className ?? ""}`}
    >
      <div className={`${containerClassName} mx-auto px-4 sm:px-6 lg:px-8`}>
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
                } font-display`}
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

          {signedIn && onDevelopers ? (
            <button
              type="button"
              onClick={logout}
              className={`inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                solid
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-white text-gray-900 hover:bg-white/90"
              }`}
            >
              Log out
            </button>
          ) : (
            <>
              <a
                href={playStoreUrl({ campaign: "nav", medium: "web" })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logEvent("app_cta_click", { placement: "nav" })}
                className={`md:hidden inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  solid
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-white/90"
                }`}
              >
                Get the app
              </a>
              {signedIn === null ? (
                <span className="hidden h-9 w-36 shrink-0 md:inline-flex" aria-hidden="true" />
              ) : (
                <Link
                  href={signedIn ? "/developers" : "/developers/login"}
                  className={`hidden shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors md:inline-flex ${
                    solid
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-white/90"
                  }`}
                >
                  Login for API
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

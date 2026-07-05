"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mainNavLinks } from "@/components/nav-links";
import { GOOGLE_PLAY_APP_URL } from "@/lib/google-play-href";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  const drawer = open && mounted
    ? createPortal(
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-[100] bg-black/50 md:hidden"
            onClick={close}
          />

          <aside
            id="mobile-nav-drawer"
            className="fixed top-0 left-0 z-[110] h-dvh w-72 max-w-[85vw] bg-white shadow-2xl border-r border-gray-200 flex flex-col md:hidden"
            aria-hidden={false}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
              <span className="text-lg font-bold text-gray-900">Menu</span>
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close navigation menu"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {mainNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-100 shrink-0">
              <a
                href={GOOGLE_PLAY_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors shadow-sm"
              >
                Download the App
              </a>
            </div>
          </aside>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
      {drawer}
    </>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

"use client";

import { playStoreUrl } from "@/lib/google-play-href";
import PlayStoreButton from "@/components/PlayStoreButton";
import QrCode from "@/components/QrCode";

export default function DownloadCTA() {
  const qrUrl = playStoreUrl({ campaign: "homepage_qr" });

  return (
    <section
      id="download"
      className="relative overflow-hidden py-20 sm:py-24 bg-blue-800 scroll-mt-16"
      aria-labelledby="download-heading"
    >
      <div className="hero-rail-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-10">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-300/80 mb-4">
              Android app
            </p>
            <h2
              id="download-heading"
              className="font-display text-3xl sm:text-5xl text-white tracking-tight mb-4"
            >
              Download Train Dekho — it&apos;s free
            </h2>
            <p className="text-white/65 text-lg mb-8 max-w-xl leading-relaxed">
              Live status, alternative train recommendations, PNR, alerts, and
              ticket booking for Indian Railways. No sign-up required.
            </p>
            <PlayStoreButton
              placement="download"
              variant="primary"
              label="Download on Google Play"
            />
          </div>

          <div className="lg:col-span-5 hidden sm:flex justify-center lg:justify-end">
            <div className="rounded-[1.5rem] bg-white px-6 py-5 text-center shadow-2xl">
              <QrCode
                value={qrUrl}
                size={132}
                alt="QR code to download Train Dekho on Google Play"
              />
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-blue-500">
                Scan to install
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

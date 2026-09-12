"use client";

import { playStoreUrl } from "@/lib/google-play-href";
import PlayStoreButton from "@/components/PlayStoreButton";
import QrCode from "@/components/QrCode";

export default function DownloadCTA() {
  const qrUrl = playStoreUrl({ campaign: "homepage_qr" });

  return (
    <section
      id="download"
      className="relative overflow-hidden py-20 sm:py-24 bg-zinc-900 scroll-mt-16"
      aria-labelledby="download-heading"
    >
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-4">
          Android app
        </p>
        <h2
          id="download-heading"
          className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4"
        >
          Download Train Dekho — it&apos;s free
        </h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Live running status, PNR, alerts, ticket booking, and sharing for
          Indian Railways. No sign-up required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <PlayStoreButton
            placement="download"
            variant="primary"
            label="Download on Google Play"
          />
          <div className="hidden sm:flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-white p-2">
              <QrCode
                value={qrUrl}
                size={120}
                alt="QR code to download Train Dekho on Google Play"
              />
            </div>
            <p className="text-xs text-zinc-500">Scan to install</p>
          </div>
        </div>
      </div>
    </section>
  );
}

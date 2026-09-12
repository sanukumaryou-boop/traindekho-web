"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logEvent } from "@/lib/analytics";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";
import {
  getOpenLiveUrl,
  getOpenPnrUrl,
  isAndroidUserAgent,
} from "@/lib/open-app-href";
import PlayStoreButton from "@/components/PlayStoreButton";
import QrCode from "@/components/QrCode";
import { playStoreUrl } from "@/lib/google-play-href";

export type AppInstallGateProps = {
  kind: "live" | "pnr";
  trainNo?: string;
  trainName?: string;
  pnr?: string;
  onBack?: () => void;
};

export default function AppInstallGate({
  kind,
  trainNo,
  trainName,
  pnr,
  onBack,
}: AppInstallGateProps) {
  const openUrl =
    kind === "pnr" && pnr
      ? getOpenPnrUrl(pnr)
      : trainNo
        ? getOpenLiveUrl(trainNo)
        : playStoreUrl({ campaign: "gate" });
  const hasDeepLink = Boolean(
    (kind === "pnr" && pnr) || (kind === "live" && trainNo),
  );

  useEffect(() => {
    logEvent("app_gate_view", { kind });
    if (
      hasDeepLink &&
      typeof navigator !== "undefined" &&
      isAndroidUserAgent(navigator.userAgent)
    ) {
      window.location.assign(openUrl);
    }
  }, [kind, openUrl, hasDeepLink]);

  const title =
    kind === "pnr"
      ? `Check PNR ${pnr} in the Train Dekho app`
      : trainNo
        ? `Track train ${trainNo}${trainName ? ` ${trainName}` : ""} live in the app`
        : "Live train tracking is in the Train Dekho app";

  const description =
    kind === "pnr"
      ? "PNR status and PNR alerts are available on Android."
      : "See live status, turn on live status alerts, and share tracking with anyone on Android.";

  return (
    <div className="text-left">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-3"
        >
          ← Search again
        </button>
      )}

      <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
        App only
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{description}</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex flex-col items-start gap-3 w-full sm:w-auto">
          <a
            href={openUrl}
            onClick={() => logEvent("app_cta_click", { placement: "gate" })}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 transition-colors text-sm"
          >
            Open in Train Dekho
          </a>
          <PlayStoreButton
            placement="gate"
            variant="outline"
            label="Get it on Google Play"
            className="w-full sm:w-auto"
          />
          {kind === "live" && trainNo && (
            <Link
              href={getTrainScheduleHref(trainNo)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              See schedule on the web
            </Link>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-center gap-2 border-l border-gray-100 pl-5">
          <QrCode
            value={openUrl}
            size={120}
            alt="QR code to open this train in the Train Dekho app"
          />
          <p className="text-[11px] text-gray-400 text-center leading-snug max-w-[8rem]">
            Scan on your phone
          </p>
        </div>
      </div>
    </div>
  );
}

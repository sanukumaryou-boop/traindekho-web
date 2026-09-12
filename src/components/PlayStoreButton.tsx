"use client";

import { logEvent } from "@/lib/analytics";
import {
  playStoreUrl,
  type PlayStorePlacement,
} from "@/lib/google-play-href";
import { PlayStoreIcon } from "@/components/PlayStoreIcon";

type PlayStoreButtonProps = {
  placement: PlayStorePlacement;
  medium?: string;
  variant?:
    | "light"
    | "primary"
    | "nav"
    | "navLight"
    | "navOutline"
    | "outline"
    | "ghost"
    | "ghostDark";
  label?: string;
  className?: string;
};

const variantClass: Record<NonNullable<PlayStoreButtonProps["variant"]>, string> =
  {
    light:
      "inline-flex items-center gap-3 bg-white text-zinc-900 font-medium px-6 py-3.5 rounded-full hover:bg-zinc-100 transition-colors",
    primary:
      "inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-full transition-colors",
    nav: "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-colors shrink-0",
    navLight:
      "inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors shrink-0",
    navOutline:
      "inline-flex items-center gap-2 border border-white/50 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-full hover:bg-white hover:text-zinc-900 transition-colors shrink-0",
    outline:
      "inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 font-medium px-6 py-3 text-sm transition-colors",
    ghost:
      "inline-flex items-center gap-1.5 text-white hover:text-white/80 transition-colors font-medium text-sm shrink-0",
    ghostDark:
      "inline-flex items-center gap-1.5 text-gray-900 hover:text-gray-600 transition-colors font-medium text-sm shrink-0",
  };

export default function PlayStoreButton({
  placement,
  medium = "homepage",
  variant = "primary",
  label,
  className = "",
}: PlayStoreButtonProps) {
  const href = playStoreUrl({ campaign: placement, medium });
  const resolvedLabel =
    label ?? (variant === "nav" ? undefined : "Get it on Google Play");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Train Dekho on Google Play"
      onClick={() => logEvent("app_cta_click", { placement })}
      className={`${variantClass[variant]} ${className}`}
    >
      {variant === "nav" || variant === "navLight" || variant === "navOutline" ? (
        <>
          <span className="hidden sm:inline">{resolvedLabel ?? "Download the App"}</span>
          <span className="sm:hidden">Download</span>
        </>
      ) : variant === "ghost" || variant === "ghostDark" ? (
        <>
          {resolvedLabel}
          <span aria-hidden="true">→</span>
        </>
      ) : (
        <>
          <PlayStoreIcon className="w-5 h-5 flex-shrink-0" />
          {resolvedLabel}
        </>
      )}
    </a>
  );
}

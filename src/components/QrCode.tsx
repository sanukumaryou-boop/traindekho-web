"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type QrCodeProps = {
  value: string;
  size?: number;
  alt: string;
  className?: string;
};

export default function QrCode({
  value,
  size = 160,
  alt,
  className = "",
}: QrCodeProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: { dark: "#18181b", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!src) {
    return (
      <div
        className={`bg-gray-100 animate-pulse rounded-lg ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-lg bg-white ${className}`}
    />
  );
}

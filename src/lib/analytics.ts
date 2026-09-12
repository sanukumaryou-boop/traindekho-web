"use client";

type EventParams = Record<string, string | number | boolean>;

export function logEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  void import("../../firebase.js")
    .then(async (mod) => {
      const { logEvent: firebaseLogEvent } = await import("firebase/analytics");
      firebaseLogEvent(mod.analytics, name, params);
    })
    .catch(() => {
      // Analytics is optional; never block UI.
    });
}

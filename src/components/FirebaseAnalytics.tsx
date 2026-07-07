"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

import { getFirebaseApp } from "@/lib/firebase/client";

let analytics: Analytics | null = null;

export function FirebaseAnalytics() {
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(getFirebaseApp());
      }
    });
  }, []);

  return null;
}

export function getFirebaseAnalytics() {
  return analytics;
}

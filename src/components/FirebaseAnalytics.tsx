"use client";

import { useEffect } from "react";

export function FirebaseAnalytics() {
  useEffect(() => {
    import("../../firebase.js");
  }, []);

  return null;
}

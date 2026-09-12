"use client";

import { useEffect, useState } from "react";

const KEYBOARD_HEIGHT_PX = 150;

function isEditable(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function useKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    let closedHeight = viewportHeight();

    const fromViewport = () => {
      const height = viewportHeight();
      if (height > closedHeight) closedHeight = height;
      return closedHeight - height > KEYBOARD_HEIGHT_PX;
    };

    const syncFromViewport = () => {
      setKeyboardOpen(fromViewport());
    };

    const onFocusIn = () => {
      if (isMobileViewport() && isEditable(document.activeElement)) {
        setKeyboardOpen(true);
        return;
      }
      syncFromViewport();
    };

    const onFocusOut = () => {
      window.setTimeout(syncFromViewport, 200);
    };

    syncFromViewport();
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", syncFromViewport);
    window.visualViewport?.addEventListener("resize", syncFromViewport);
    window.visualViewport?.addEventListener("scroll", syncFromViewport);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", syncFromViewport);
      window.visualViewport?.removeEventListener("resize", syncFromViewport);
      window.visualViewport?.removeEventListener("scroll", syncFromViewport);
    };
  }, []);

  return keyboardOpen;
}

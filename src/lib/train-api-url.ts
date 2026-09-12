const DEFAULT_API_URL = "https://api.traindekho.live/go";
const DEFAULT_TIMEOUT_MS = 8000;

function isUsableApiUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getTrainApiUrl(): string {
  const raw = process.env.TRAIN_API_URL?.trim() ?? "";
  const url = isUsableApiUrl(raw) ? raw : DEFAULT_API_URL;
  return url.replace(/\/+$/, "");
}

/** AbortSignal that works on Node, Edge, and older runtimes. */
export function trainApiTimeout(ms = DEFAULT_TIMEOUT_MS): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    try {
      return AbortSignal.timeout(ms);
    } catch {
      // Fall through to AbortController.
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  if (typeof timer === "object" && timer && "unref" in timer) {
    (timer as NodeJS.Timeout).unref();
  }
  return controller.signal;
}

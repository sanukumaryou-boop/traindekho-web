import { publicApiUrl } from "@/lib/developers/public-api";

export function publicDataHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  const key = process.env.PUBLIC_API_KEY?.trim();
  if (key) headers.set("X-API-Key", key);
  return headers;
}

export function publicDataUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${publicApiUrl()}${suffix}`;
}

export function publicErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const error = (body as { error?: { message?: unknown } }).error;
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  return fallback;
}

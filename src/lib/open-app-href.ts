const OPEN_APP_BASE = "https://api.traindekho.live/go/open";

export function getOpenLiveUrl(trainNo: string | number): string {
  const digits = String(trainNo).replace(/\D/g, "");
  return `${OPEN_APP_BASE}/live/${digits}`;
}

export function getOpenPnrUrl(pnr: string): string {
  const digits = String(pnr).replace(/\D/g, "");
  return `${OPEN_APP_BASE}/pnr/${digits}`;
}

export function isAndroidUserAgent(userAgent: string): boolean {
  return /Android/i.test(userAgent);
}

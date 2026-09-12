export const PLAY_STORE_PACKAGE_ID = "com.hundredapps.traindekho";

export const GOOGLE_PLAY_APP_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_ID}`;

export type PlayStorePlacement =
  | "nav"
  | "hero"
  | "gate"
  | "sticky"
  | "footer"
  | "download"
  | "homepage_qr"
  | "coming_soon"
  | "schedule";

export function playStoreUrl(options: {
  campaign: PlayStorePlacement | string;
  medium?: string;
  source?: string;
}): string {
  const source = options.source ?? "website";
  const medium = options.medium ?? "homepage";
  const campaign = options.campaign;
  const params = new URLSearchParams({
    id: PLAY_STORE_PACKAGE_ID,
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });
  params.set(
    "referrer",
    new URLSearchParams({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
    }).toString(),
  );
  return `https://play.google.com/store/apps/details?${params.toString()}`;
}

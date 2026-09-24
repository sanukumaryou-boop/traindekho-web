const SLUG_SEPARATOR = "-to-";

export function buildRouteSearchSlug(from: string, to: string): string {
  const fromCode = from.trim().toUpperCase();
  const toCode = to.trim().toUpperCase();
  return `${fromCode}${SLUG_SEPARATOR}${toCode}`;
}

export function parseRouteSearchSlug(
  slug: string,
): { from: string; to: string } | null {
  const normalized = slug.trim();
  const separator = SLUG_SEPARATOR.toUpperCase();
  const separatorIndex = normalized.toUpperCase().indexOf(separator);
  if (separatorIndex === -1) return null;

  const from = normalized.slice(0, separatorIndex).trim().toUpperCase();
  const to = normalized
    .slice(separatorIndex + separator.length)
    .trim()
    .toUpperCase();

  if (!from || !to || from === to) return null;
  // IR codes can be 1 char (e.g. R = Raipur). Reject only empty/too-long.
  if (!/^[A-Z0-9]{1,6}$/.test(from) || !/^[A-Z0-9]{1,6}$/.test(to)) {
    return null;
  }

  return { from, to };
}

export function getRouteSearchHref(from: string, to: string): string {
  return `/search-route/${buildRouteSearchSlug(from, to)}`;
}

/** Format a date as DD-MM-YYYY for the live status API. */
export function formatLiveStatusApiDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export type QuickJourneyDateOption = {
  label: string;
  detail: string;
  apiDate: string;
  htmlDate: string;
};

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
});

function parseApiDate(apiDate: string): Date | null {
  const [day, month, year] = apiDate.split("-").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

export function formatShortJourneyDate(date: Date): string {
  return SHORT_DATE_FORMATTER.format(date);
}

export function formatShortJourneyDateFromApi(apiDate: string): string {
  const date = parseApiDate(apiDate);
  if (!date) return apiDate;
  return formatShortJourneyDate(date);
}

function journeyDateFromOffset(base: Date, offset: number): Date {
  const date = new Date(base);
  date.setDate(date.getDate() + offset);
  return date;
}

function toQuickJourneyDateOption(
  date: Date,
  label: string,
  detail: string,
): QuickJourneyDateOption {
  const apiDate = formatLiveStatusApiDate(date);
  return {
    label,
    detail,
    apiDate,
    htmlDate: apiDateToHtmlDate(apiDate),
  };
}

/** Today, yesterday, and the previous 3 calendar dates. */
export function getQuickJourneyDateOptions(
  baseDate: Date = new Date(),
): QuickJourneyDateOption[] {
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);

  return [0, -1, -2, -3, -4].map((offset) => {
    const date = journeyDateFromOffset(base, offset);
    const shortDate = formatShortJourneyDate(date);
    if (offset === 0) return toQuickJourneyDateOption(date, "Today", shortDate);
    if (offset === -1) {
      return toQuickJourneyDateOption(date, "Yesterday", shortDate);
    }
    return toQuickJourneyDateOption(date, shortDate, WEEKDAY_FORMATTER.format(date));
  });
}

export function withSelectedJourneyDateOption(
  options: QuickJourneyDateOption[],
  apiDate?: string,
): QuickJourneyDateOption[] {
  if (!apiDate || !isValidApiDate(apiDate)) return options;
  if (options.some((option) => option.apiDate === apiDate)) return options;

  const date = parseApiDate(apiDate);

  return [
    ...options,
    {
      label: formatShortJourneyDateFromApi(apiDate),
      detail: date ? WEEKDAY_FORMATTER.format(date) : "",
      apiDate,
      htmlDate: apiDateToHtmlDate(apiDate),
    },
  ];
}

/** Convert HTML date input value (YYYY-MM-DD) to DD-MM-YYYY. */
export function htmlDateToApiDate(htmlDate: string): string {
  const [year, month, day] = htmlDate.split("-");
  if (!year || !month || !day) return htmlDate;
  return `${day}-${month}-${year}`;
}

/** Convert DD-MM-YYYY to HTML date input value (YYYY-MM-DD). */
export function apiDateToHtmlDate(apiDate: string): string {
  const [day, month, year] = apiDate.split("-");
  if (!year || !month || !day) return apiDate;
  return `${year}-${month}-${day}`;
}

/** Validate DD-MM-YYYY format. */
export function isValidApiDate(value: string): boolean {
  return /^\d{2}-\d{2}-\d{4}$/.test(value.trim());
}

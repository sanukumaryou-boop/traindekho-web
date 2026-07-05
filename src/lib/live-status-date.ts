/** Format a date as DD-MM-YYYY for the live status API. */
export function formatLiveStatusApiDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export type QuickJourneyDateOption = {
  label: string;
  apiDate: string;
  htmlDate: string;
};

/** Today, yesterday, and the day before yesterday. */
export function getQuickJourneyDateOptions(
  baseDate: Date = new Date(),
): QuickJourneyDateOption[] {
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);

  return [
    { offset: 0, label: "Today" },
    { offset: -1, label: "Yesterday" },
    { offset: -2, label: "Day before yesterday" },
  ].map(({ offset, label }) => {
    const date = new Date(base);
    date.setDate(date.getDate() + offset);
    const apiDate = formatLiveStatusApiDate(date);
    return {
      label,
      apiDate,
      htmlDate: apiDateToHtmlDate(apiDate),
    };
  });
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

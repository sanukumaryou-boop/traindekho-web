export type NavLink = {
  href: string;
  label: string;
};

export const mainNavLinks: NavLink[] = [
  { href: "/search-route", label: "Route Search" },
  { href: "/train-schedule", label: "Train Schedule" },
  { href: "/live-train-status", label: "Live Train Status" },
];

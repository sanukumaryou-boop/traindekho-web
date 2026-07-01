export type NavLink = {
  href: string;
  label: string;
};

export const mainNavLinks: NavLink[] = [
  { href: "/train-schedule", label: "Train Schedule" },
  { href: "/live-train-status", label: "Live Train Status" },
  { href: "/search-route", label: "Search Route" },
];

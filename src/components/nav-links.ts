export type NavLink = {
  href: string;
  label: string;
};

export const mainNavLinks: NavLink[] = [
  { href: "/", label: "Find trains" },
  { href: "/live", label: "Track Live" },
  { href: "/schedule", label: "Schedule" },
];

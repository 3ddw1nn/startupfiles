import { businessTypeConfigs } from "./dashboard";

export type NavItem = {
  href: string;
  label: string;
  description?: string;
  disabled?: boolean;
  badge?: string;
};

export type NavSection = {
  id: string;
  label: string;
  disabled?: boolean;
  badge?: string;
  items: NavItem[];
};

export const publicNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export const dashboardPrimaryNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Workspace overview and next steps." },
  { href: "/dashboard/documents", label: "All documents", description: "Every document across your setup tracks." }
];

export const dashboardBusinessSections: NavSection[] = businessTypeConfigs.map((business) => ({
  id: business.slug,
  label: business.label,
  disabled: !business.available,
  badge: business.badge,
  items: [
    {
      href: `/dashboard/${business.slug}`,
      label: "Overview",
      description: `Overall progress for the ${business.label.toLowerCase()} setup.`
    },
    {
      href: `/dashboard/${business.slug}/dba-fbn`,
      label: "DBA / FBN",
      description: `Trade-name tracking for the ${business.label.toLowerCase()} setup.`
    },
    {
      href: `/dashboard/${business.slug}/documents`,
      label: "Documents",
      description: `Documents for the ${business.label.toLowerCase()} setup.`
    }
  ]
}));

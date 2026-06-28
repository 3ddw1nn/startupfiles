export type NavItem = {
  href: string;
  label: string;
  description?: string;
};

export const publicNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export const dashboardNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "See your current phase and next step." },
  { href: "/dashboard/roadmap", label: "Setup Roadmap", description: "Track required tasks by phase." },
  { href: "/dashboard/phase-0", label: "Phase 0: Sole Proprietor", description: "Start lean under your legal name." },
  { href: "/dashboard/phase-1", label: "Phase 1: LLC Formation", description: "Prepare for Whale Tales Labs LLC." },
  { href: "/dashboard/documents", label: "Documents", description: "Generate and review setup documents." },
  { href: "/dashboard/walkthroughs", label: "Walkthroughs", description: "Follow official filing guides." },
  { href: "/dashboard/compliance", label: "Compliance Center", description: "Stay ahead of recurring requirements." },
  { href: "/dashboard/business", label: "Business Profile", description: "Manage founder and business details." },
  { href: "/dashboard/products", label: "Products", description: "Track product lines and risk triggers." },
  { href: "/dashboard/filings", label: "Filing Records", description: "Store confirmations and notes." },
  { href: "/dashboard/reminders", label: "Reminders", description: "See deadlines and notifications." },
  { href: "/dashboard/settings", label: "Settings", description: "Control account and workspace settings." },
  { href: "/dashboard/support", label: "Support", description: "Reach out with product or compliance questions." }
];

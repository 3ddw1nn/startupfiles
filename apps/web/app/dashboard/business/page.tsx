import { DashboardPage } from "../../../components/dashboard-page";

export default function BusinessPage() {
  return (
    <DashboardPage
      title="The business profile becomes the single source of truth for the workspace."
      description="This area will collect the founder profile, business profile, formation status, naming choices, domain details, and location context that the rule engine and document generator depend on."
      cards={[
        { label: "Workspace model", value: "Single-owner", detail: "One active business profile in V1." },
        { label: "Core data", value: "Profile-driven", detail: "Answers feed tasks and documents." },
        { label: "Sensitive fields", value: "Scoped", detail: "User-owned data stays workspace-bound." }
      ]}
      listTitle="Profile details the schema already anticipates"
      listItems={[
        {
          title: "Founder details",
          detail: "Legal name, California location, home-office status, payment plans, contractor use, and data practices."
        },
        {
          title: "Business details",
          detail: "Current phase, legal operator name, planned LLC name, city license status, DBA/FBN status, and domain ownership."
        },
        {
          title: "System boundaries",
          detail: "The app should not store SSNs, tax IDs, card data, or government login credentials."
        }
      ]}
    />
  );
}

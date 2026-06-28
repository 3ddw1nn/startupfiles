import { DashboardPage } from "../../../components/dashboard-page";

export default function CompliancePage() {
  return (
    <DashboardPage
      title="Compliance should feel visible and calm, not like surprise debt."
      description="The compliance center is meant to track one-time requirements, recurring deadlines, and product-risk alerts so the founder knows what matters now and what only matters after formation or growth."
      cards={[
        { label: "Recurring focus", value: "Deadlines", detail: "Renewals and future filing dates." },
        { label: "Alert style", value: "Risk triggers", detail: "Surface meaningful business changes." },
        { label: "Reminder engine", value: "Planned", detail: "Scheduled through Convex jobs later." }
      ]}
      listTitle="Initial compliance categories"
      listItems={[
        {
          title: "Local license, seller's permit, and DBA/FBN decisions",
          detail: "Phase 0 needs targeted visibility into licensing and naming requirements."
        },
        {
          title: "Terms, privacy, and payment readiness",
          detail: "Policy and payment steps should appear before the founder starts collecting money or user data."
        },
        {
          title: "LLC compliance and assignment reminders",
          detail: "After formation, track Statement of Information, annual tax, domain assignment, and contractor or IP follow-through."
        }
      ]}
    />
  );
}

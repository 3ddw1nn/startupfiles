import { DashboardPage } from "../../../components/dashboard-page";

export default function RemindersPage() {
  return (
    <DashboardPage
      title="Reminders should nudge the founder before deadlines become stress."
      description="The app plans to combine one-time milestones with recurring compliance reminders so future work is visible early instead of surfacing only when something is overdue."
      cards={[
        { label: "Reminder types", value: "One-time + recurring", detail: "Setup and compliance events." },
        { label: "Delivery", value: "In-app first", detail: "Email later through Resend." },
        { label: "Status model", value: "4 states", detail: "Scheduled, sent, dismissed, complete." }
      ]}
      listTitle="Initial reminders already called out in docs"
      listItems={[
        {
          title: "Local and LLC deadlines",
          detail: "Business license renewals, California LLC Statement of Information, and annual tax reminders."
        },
        {
          title: "Operational upkeep",
          detail: "Domain renewal checks, terms and privacy reviews, and document packet review reminders."
        },
        {
          title: "Phase-change follow-through",
          detail: "When an LLC is formed, new migration and assignment reminders should automatically appear."
        }
      ]}
    />
  );
}

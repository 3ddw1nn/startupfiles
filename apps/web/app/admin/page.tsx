import { DashboardPage } from "../../components/dashboard-page";

export default function AdminHomePage() {
  return (
    <DashboardPage
      title="Admin tools will manage the content that powers the founder experience."
      description="The plans call for a separate internal area where sources, walkthroughs, templates, rules, and support requests can be updated without code changes."
      cards={[
        { label: "Audience", value: "Internal", detail: "Admin and content-editor only." },
        { label: "Primary job", value: "Content ops", detail: "Keep source-backed guidance current." },
        { label: "Access", value: "Role-gated", detail: "Server-side enforcement required." }
      ]}
      listTitle="Planned admin areas"
      listItems={[
        {
          title: "Sources and walkthroughs",
          detail: "Maintain official URLs, internal summaries, field guidance, and last-reviewed dates."
        },
        {
          title: "Templates and rules",
          detail: "Edit document templates, compliance logic, disclaimer language, and roadmap triggers."
        },
        {
          title: "Support operations",
          detail: "Review incoming support requests, track status, and use repeated issues to improve the product."
        }
      ]}
    />
  );
}

import { DashboardPage } from "../../../components/dashboard-page";

export default function SupportPage() {
  return (
    <DashboardPage
      title="Support belongs inside the workspace because confusion happens mid-flow."
      description="The product plan treats support as part of the core experience, with stored requests, internal status tracking, and notifications instead of burying help behind a generic contact link."
      cards={[
        { label: "Request states", value: "3", detail: "Open, replied, closed." },
        { label: "Notification path", value: "Resend", detail: "Transactional routing planned." },
        { label: "Admin view", value: "Later", detail: "Internal support triage in admin routes." }
      ]}
      listTitle="Support workflow goals"
      listItems={[
        {
          title: "Capture the context of the question",
          detail: "Support should know which roadmap area, document, or walkthrough the founder was using when they got stuck."
        },
        {
          title: "Keep product and advice boundaries clear",
          detail: "Support can help with app behavior and source clarity without slipping into legal or tax advice."
        },
        {
          title: "Feed product improvement",
          detail: "Patterns in support requests should drive better walkthrough copy, clearer warnings, and stronger defaults."
        }
      ]}
    />
  );
}

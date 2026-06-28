import { DashboardPage } from "../../../components/dashboard-page";

export default function WalkthroughsPage() {
  return (
    <DashboardPage
      title="Walkthroughs should guide the founder through official forms without pretending to file them."
      description="This section is planned for government and compliance workflows with prerequisites, official links, step-by-step guidance, output reminders, and warnings about when to stop and verify first."
      cards={[
        { label: "V1 behavior", value: "Guide only", detail: "No auto-filing." },
        { label: "Key walkthoughs", value: "6", detail: "Irvine, SOS, EIN, seller permit, DBA/FBN." },
        { label: "Sources", value: "Official", detail: "Every path points back to the agency source." }
      ]}
      listTitle="Walkthrough requirements from the plan"
      listItems={[
        {
          title: "Prerequisites and timing",
          detail: "Show what information or account access the user needs before opening a government site."
        },
        {
          title: "Profile-linked field guidance",
          detail: "Make it obvious which answers from the workspace belong in which form fields."
        },
        {
          title: "Receipts and next steps",
          detail: "Prompt the user to download confirmations and log what the filing unlocks next."
        }
      ]}
    />
  );
}

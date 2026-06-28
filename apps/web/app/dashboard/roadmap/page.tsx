import { DashboardPage } from "../../../components/dashboard-page";

export default function RoadmapPage() {
  return (
    <DashboardPage
      title="Turn intake answers into a staged business setup roadmap."
      description="This section will become the rule-driven center of the product, where tasks move between not started, ready, blocked, complete, and not needed based on the founder’s real situation."
      cards={[
        { label: "Task states", value: "6", detail: "Not started through not needed." },
        { label: "Current mode", value: "Staged", detail: "Phase 0 first, LLC later." },
        { label: "Rule engine", value: "Planned", detail: "Derived from intake answers." }
      ]}
      listTitle="Roadmap logic already defined in docs"
      listItems={[
        {
          title: "No LLC exists",
          detail: "Recommend Phase 0 and keep the user in sole proprietor validation mode."
        },
        {
          title: "Separate public business name",
          detail: "Make the DBA/FBN task ready before the founder uses that name publicly."
        },
        {
          title: "Payments, contracts, data, contractors, hardware, or growing risk",
          detail: "Move LLC readiness and migration tasks closer to the top of the workspace."
        }
      ]}
    />
  );
}

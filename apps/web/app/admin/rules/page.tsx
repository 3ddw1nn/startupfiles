import { DashboardPage } from "../../../components/dashboard-page";

export default function AdminRulesPage() {
  return (
    <DashboardPage
      title="Rules are the logic layer that makes the roadmap feel personalized."
      description="The rule engine planned in the docs is what turns intake answers into the right phase recommendation, task visibility, warnings, and document readiness."
      cards={[
        { label: "Rule outputs", value: "6+", detail: "Phase, tasks, warnings, readiness, reminders." },
        { label: "Current logic", value: "Doc-defined", detail: "Ready to become code next." },
        { label: "Change impact", value: "High", detail: "Affects roadmap and compliance behavior." }
      ]}
      listTitle="Initial rules already mapped"
      listItems={[
        {
          title: "Naming and DBA/FBN logic",
          detail: "A separate public business name should make the DBA/FBN decision task ready during sole proprietor mode."
        },
        {
          title: "Payments and product-risk triggers",
          detail: "Payments, goods, data collection, or hardware should unlock additional setup and compliance work."
        },
        {
          title: "LLC readiness cues",
          detail: "Revenue, contracts, contractors, and rising exposure should surface the Phase 1 migration path."
        }
      ]}
    />
  );
}

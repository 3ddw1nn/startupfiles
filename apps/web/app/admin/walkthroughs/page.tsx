import { DashboardPage } from "../../../components/dashboard-page";

export default function AdminWalkthroughsPage() {
  return (
    <DashboardPage
      title="Walkthrough content needs an internal editing surface."
      description="Government sites change, application fields shift, and warnings need refinement. This route reserves the admin path for maintaining walkthrough steps without redeploying UI copy everywhere by hand."
      cards={[
        { label: "Content type", value: "Step-by-step", detail: "Prereqs, steps, warnings, saved outputs." },
        { label: "Status model", value: "Draft to published", detail: "Matches the document planning." },
        { label: "Examples", value: "Irvine, SOS, IRS", detail: "Core filings first." }
      ]}
      listTitle="Editing concerns"
      listItems={[
        {
          title: "Prerequisites and stop conditions",
          detail: "Walkthroughs should include clear warnings about when a founder should not continue."
        },
        {
          title: "Official-field guidance",
          detail: "The internal editor should support fields or snippets tied back to profile answers."
        },
        {
          title: "Review cadence",
          detail: "Every walkthrough should have a last-reviewed timestamp to avoid stale guidance."
        }
      ]}
    />
  );
}

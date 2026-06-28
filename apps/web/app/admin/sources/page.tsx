import { DashboardPage } from "../../../components/dashboard-page";

export default function AdminSourcesPage() {
  return (
    <DashboardPage
      title="Official sources should be curated like product infrastructure."
      description="Each requirement in FounderFile depends on clear official links, review dates, and internal summaries that keep public guidance grounded in actual agencies and filing systems."
      cards={[
        { label: "Source fields", value: "Link + summary", detail: "Agency, jurisdiction, review date, status." },
        { label: "Goal", value: "Trust", detail: "Users should see where guidance comes from." },
        { label: "Update model", value: "Admin-managed", detail: "No code edit required later." }
      ]}
      listTitle="Why this matters"
      listItems={[
        {
          title: "Guidance must stay reviewable",
          detail: "Each requirement should point to an agency source that can be revisited and revalidated."
        },
        {
          title: "Walkthroughs depend on it",
          detail: "Source changes often ripple into step-by-step guidance, warnings, and field instructions."
        },
        {
          title: "Compliance products need provenance",
          detail: "Users should never have to guess whether a recommendation came from an official rule or generic internet content."
        }
      ]}
    />
  );
}

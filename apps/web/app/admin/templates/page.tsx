import { DashboardPage } from "../../../components/dashboard-page";

export default function AdminTemplatesPage() {
  return (
    <DashboardPage
      title="Template management is where product knowledge becomes reusable output."
      description="The early document system is Markdown-first, so template editing is a central admin responsibility rather than a minor convenience feature."
      cards={[
        { label: "V1 format", value: "Markdown", detail: "Structured templates first." },
        { label: "Versioning", value: "Required", detail: "Generated docs should record template version." },
        { label: "Scope", value: "Admin-owned", detail: "Separate from user-generated docs." }
      ]}
      listTitle="Template rules already defined"
      listItems={[
        {
          title: "Always include generation context",
          detail: "Generated documents should show generation date and the source profile used."
        },
        {
          title: "Respect product boundaries",
          detail: "Appropriate disclaimers should be embedded where the document could be mistaken for professional advice."
        },
        {
          title: "Keep sensitive data out",
          detail: "The system should never place SSNs into generated documents because V1 should not collect them in the first place."
        }
      ]}
    />
  );
}

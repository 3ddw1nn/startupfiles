import { DashboardPage } from "../../../components/dashboard-page";

export default function DocumentsPage() {
  return (
    <DashboardPage
      title="Documents are one of the main product outputs, not side effects."
      description="The document center is planned as the place where personalized worksheets, legal-policy drafts, filing prep, and saved records all live together with versioning and review states."
      cards={[
        { label: "V1 format", value: "Markdown", detail: "Server-rendered drafts first." },
        { label: "Later export", value: "PDF/DOCX", detail: "Planned after the initial generator." },
        { label: "Review states", value: "3", detail: "Draft, reviewed, exported." }
      ]}
      listTitle="Initial document categories"
      listItems={[
        {
          title: "Setup worksheets",
          detail: "Founder profile summaries, business license prep, bookkeeping worksheets, and readiness checklists."
        },
        {
          title: "Government form prep",
          detail: "Structured worksheets that help a user complete official filing forms outside the app."
        },
        {
          title: "Internal records",
          detail: "Domain ownership memos, filing receipts, and assignment reminders that keep the founder organized."
        }
      ]}
    />
  );
}

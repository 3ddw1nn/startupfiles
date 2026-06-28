import { DashboardPage } from "../../../components/dashboard-page";

export default function FilingsPage() {
  return (
    <DashboardPage
      title="Filing records turn the workspace into a real operating memory."
      description="The roadmap calls for a place to store confirmations, notes, dates, and attachments so the founder can prove what was done and return to that context later."
      cards={[
        { label: "Record types", value: "Filings + receipts", detail: "Both government and internal records." },
        { label: "Proof style", value: "Manual save", detail: "User keeps confirmations and notes." },
        { label: "Storage link", value: "Planned", detail: "Attachment storage later." }
      ]}
      listTitle="What these records should capture"
      listItems={[
        {
          title: "Filing details",
          detail: "Type, name, date filed, confirmation number, and notes tied back to the relevant roadmap task."
        },
        {
          title: "Receipts and evidence",
          detail: "Application confirmations, PDFs, screenshots, and downloaded records that prove a step was completed."
        },
        {
          title: "Useful continuity",
          detail: "The record should feed reminders and make follow-up filings or renewals easier later."
        }
      ]}
    />
  );
}

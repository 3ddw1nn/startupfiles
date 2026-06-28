import { DashboardPage } from "../../../components/dashboard-page";

export default function PhaseOnePage() {
  return (
    <DashboardPage
      title="Phase 1 is for the moment the business earns a cleaner structure."
      description="The LLC workflow is intentionally triggered by real business weight: revenue, contracts, contractors, data risk, advertiser money, payouts, hardware, or the founder’s decision that liability separation is worth the annual cost."
      cards={[
        { label: "Planned entity", value: "Whale Tales Labs LLC", detail: "California LLC path." },
        { label: "Trigger style", value: "Risk-based", detail: "Not a vanity milestone." },
        { label: "Core filings", value: "SOS + EIN", detail: "Articles, Statement of Information, EIN." }
      ]}
      listTitle="Planned LLC workflow pieces"
      listItems={[
        {
          title: "Formation packet",
          detail: "Articles prep, statement prep, EIN prep, operating agreement outline, and migration notes."
        },
        {
          title: "Post-formation migration",
          detail: "Shift banking, Stripe or vendors, public operator language, and domain/IP ownership into the LLC."
        },
        {
          title: "Compliance calendar",
          detail: "Track Statement of Information timing, annual California tax, and renewal or review reminders."
        }
      ]}
    />
  );
}

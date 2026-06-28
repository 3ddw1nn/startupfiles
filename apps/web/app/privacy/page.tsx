import { MarketingPage } from "../../components/marketing-page";

export default function PrivacyPage() {
  return (
    <MarketingPage
      eyebrow="Privacy"
      title="Sensitive setup data deserves narrow collection and clear boundaries."
      description="The product plans treat privacy as a core requirement because users may enter legal names, addresses, product details, filing status, and compliance choices."
      sections={[
        {
          title: "Data the product is built around",
          body: "Founder profile details, business profile details, product lines, setup answers, task progress, generated documents, filing notes, and reminder data."
        },
        {
          title: "Data it should not collect",
          body: "SSNs, tax IDs, government login credentials, payment card data, or any information that would exceed the app’s preparation-and-guidance role."
        },
        {
          title: "Security posture",
          body: "User-owned records should be scoped by user or workspace, admin views should be role-gated, and critical actions should leave an audit trail."
        },
        {
          title: "Current operator",
          body: "During Phase 0, public privacy and terms materials should identify Edward Lee as the operator rather than Whale Tales Labs."
        }
      ]}
    />
  );
}

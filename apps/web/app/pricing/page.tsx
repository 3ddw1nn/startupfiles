import { MarketingPage } from "../../components/marketing-page";

export default function PricingPage() {
  return (
    <MarketingPage
      eyebrow="Pricing Direction"
      title="Start with clarity now, monetize when the workflow earns it."
      description="The roadmap plans for free and paid layers later, but the first build is focused on making the product genuinely useful before packaging it into pricing tiers."
      sections={[
        {
          title: "Free checklist tier",
          body: "A lighter planning path with setup guidance, phase recommendations, and essential reminders."
        },
        {
          title: "Paid document packet",
          body: "A richer version with generated worksheets, organized records, and more guided preparation for filings."
        },
        {
          title: "Guided workspace",
          body: "The core subscription direction is a living dashboard for setup, compliance, reminders, and document management."
        },
        {
          title: "Expert review later",
          body: "The plans leave room for optional advisor review, but that is intentionally outside the first version."
        }
      ]}
    />
  );
}

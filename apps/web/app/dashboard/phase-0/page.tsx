import { DashboardPage } from "../../../components/dashboard-page";

export default function PhaseZeroPage() {
  return (
    <DashboardPage
      title="Phase 0 keeps the founder lean, compliant, and honest about what exists."
      description="This workflow is centered on operating under a legal name, getting local licensing right, deciding on Stripe and banking deliberately, and not implying a business entity that does not exist yet."
      cards={[
        { label: "Operator", value: "Edward Lee", detail: "Public-facing operator during Phase 0." },
        { label: "License path", value: "Irvine", detail: "Primary local filing workflow." },
        { label: "DBA/FBN", value: "Conditional", detail: "Only needed if using a separate public name." }
      ]}
      listTitle="Planned Phase 0 outputs"
      listItems={[
        {
          title: "Sole proprietor startup checklist",
          detail: "A personalized list of steps for getting the founder’s initial setup in order."
        },
        {
          title: "Stripe sole proprietor worksheet",
          detail: "Guidance for early payment setup without the app storing SSNs or handling onboarding secrets."
        },
        {
          title: "Terms and privacy readiness checklist",
          detail: "A reminder to publish policy pages before collecting meaningful user data or payments."
        }
      ]}
    />
  );
}

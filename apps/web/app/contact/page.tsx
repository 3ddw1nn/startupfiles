import { MarketingPage } from "../../components/marketing-page";

export default function ContactPage() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="Reach the operator directly while the product is still early."
      description="The first release assumes a simple support flow: user-facing contact, internal support handling, and transactional notifications managed server-side."
      sections={[
        {
          title: "Support requests",
          body: "Users should be able to ask product questions, flag broken source links, or report confusing walkthrough steps."
        },
        {
          title: "Internal routing",
          body: "The architecture plans for support requests to be stored in Convex and paired with Resend-based notifications."
        },
        {
          title: "What support is for",
          body: "Clarifying product behavior, setup flow issues, and document-generation problems, not providing legal or tax advice."
        },
        {
          title: "Why this matters",
          body: "Trust in a compliance product comes from clear boundaries, responsive fixes, and accurate links to official sources."
        }
      ]}
    />
  );
}

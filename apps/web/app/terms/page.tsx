import { MarketingPage } from "../../components/marketing-page";

export default function TermsPage() {
  return (
    <MarketingPage
      eyebrow="Terms"
      title="The app’s boundaries are part of the product, not fine print."
      description="FounderFile’s plans are unusually explicit about what the app should and should not imply, especially around legal advice, operator identity, and business-formation status."
      sections={[
        {
          title: "No professional advice",
          body: "FounderFile prepares documents, organizes answers, and guides users through official resources, but it is not a law firm, CPA firm, or tax advisor."
        },
        {
          title: "No filing automation in V1",
          body: "Users remain responsible for reviewing, verifying, and submitting anything to a government agency."
        },
        {
          title: "Operator naming rule",
          body: "The public product should identify Edward Lee as the operator during Phase 0 and should not present Whale Tales Labs as the seller or operator before a DBA/FBN or LLC exists."
        },
        {
          title: "Important practical warnings",
          body: "Buying a domain is not formation, trademark clearance, DBA/FBN registration, or liability protection, and a sole proprietorship does not shield personal assets."
        }
      ]}
    />
  );
}

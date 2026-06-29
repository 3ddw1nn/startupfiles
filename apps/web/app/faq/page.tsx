import { MarketingPage } from "../../components/marketing-page";

export default function FaqPage() {
  return (
    <MarketingPage
      eyebrow="FAQ"
      title="The questions this product is built around."
      description="StartupFiles is designed to answer the practical questions founders actually get stuck on: what to do now, what not to do yet, and which official sources matter."
      sections={[
        {
          title: "Is this legal advice?",
          body: "No. StartupFiles gives structured guidance, source links, preparation documents, and review reminders, but the user remains responsible for verification and filing."
        },
        {
          title: "Who is it for in V1?",
          body: "California solo founders, especially founders starting under their own legal name before an LLC makes financial and operational sense."
        },
        {
          title: "Does it file government forms?",
          body: "Not in V1. The product is centered on walkthroughs, prep worksheets, and organized records rather than automated filing."
        },
        {
          title: "Does it store SSNs?",
          body: "No. The product plans explicitly avoid collecting SSNs, tax IDs, payment card data, or government login credentials."
        }
      ]}
    />
  );
}

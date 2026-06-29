import { MarketingPage } from "../../components/marketing-page";

export default function AboutPage() {
  return (
    <MarketingPage
      eyebrow="About StartupFiles"
      title="A practical setup workspace, not a legal-content maze."
      description="StartupFiles is being built around a real founder path: starting as a California sole proprietor, getting the basics right, and only paying for an LLC once the business has enough gravity to justify it."
      sections={[
        {
          title: "Who it serves first",
          body: "Solo founders in California who want guided setup, document preparation, and a staged path from sole proprietor to LLC."
        },
        {
          title: "What it does not do",
          body: "It does not auto-file forms, collect SSNs, replace a lawyer or CPA, or pretend that generic blog content counts as operational guidance."
        },
        {
          title: "Why the staged model matters",
          body: "A founder can start lean under their legal name, buy time to validate the business, and then shift into LLC mode when revenue, risk, contracts, or hiring actually demand it."
        },
        {
          title: "What the workspace produces",
          body: "Personalized roadmaps, prep worksheets, filing walkthroughs, reminders, and a clean record of what was done, what is blocked, and what is not needed yet."
        }
      ]}
    />
  );
}

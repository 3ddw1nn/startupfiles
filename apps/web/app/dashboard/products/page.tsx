import { DashboardPage } from "../../../components/dashboard-page";

export default function ProductsPage() {
  return (
    <DashboardPage
      title="Products and business lines are first-class inputs to compliance decisions."
      description="The planning docs treat each product line as part of the setup model so the roadmap can respond to software, hardware, services, digital goods, payments, advertiser money, rewards, and data collection differently."
      cards={[
        { label: "Default examples", value: "MOMO, Trovr", detail: "Initial founder context." },
        { label: "Risk inputs", value: "Payments + data", detail: "Key triggers for readiness changes." },
        { label: "Types", value: "6+", detail: "Software through physical goods and other." }
      ]}
      listTitle="Why product lines matter"
      listItems={[
        {
          title: "They personalize the roadmap",
          detail: "Accepting payments, selling goods, or collecting user data can unlock new tasks and warnings."
        },
        {
          title: "They affect LLC timing",
          detail: "Hardware, preorders, payouts, and contractor-heavy operations create a stronger case for forming the LLC sooner."
        },
        {
          title: "They improve bookkeeping clarity",
          detail: "The product plans include tracking revenue and expenses by product line even during the sole proprietor phase."
        }
      ]}
    />
  );
}

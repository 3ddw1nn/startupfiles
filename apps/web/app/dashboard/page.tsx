import { DashboardLayout } from "../../components/dashboard-layout";
import { DashboardHomeContent } from "../../components/dashboard-home-content";
import { getCurrentUser } from "../../lib/current-user";

export default async function DashboardHomePage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="Your setup dashboard"
      description="Keep moving through the business setup path, track progress, and jump straight into the documents and filings that matter next."
      initialUser={currentUser}
    >
      <DashboardHomeContent />
    </DashboardLayout>
  );
}

import { DashboardLayout } from "../../../components/dashboard-layout";
import { getCurrentUser } from "../../../lib/current-user";
import { ui } from "../../../components/ui-classes";

export default async function DashboardPrivacyPage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="Privacy"
      description="What StartupFiles stores and how founder workspace data is used."
      initialUser={currentUser}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Privacy</div>
          <h2 className="mt-[10px]">Workspace data</h2>
        </div>
        <ul className="m-0 grid list-none gap-[14px] p-0">
          <li className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
            <div className="font-bold">Profile and setup answers</div>
            <div className="mt-1.5 text-[var(--muted)]">
              Founder details, business inputs, task progress, and document selections are stored so the workspace can tailor the setup path.
            </div>
          </li>
          <li className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
            <div className="font-bold">Operational metadata</div>
            <div className="mt-1.5 text-[var(--muted)]">
              Workspace events and timestamps are retained so changes can be tracked and guidance stays consistent across sessions.
            </div>
          </li>
        </ul>
      </section>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "../../../components/dashboard-layout";
import { getCurrentUser } from "../../../lib/current-user";
import { ui } from "../../../components/ui-classes";

export default async function DashboardContactPage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="Contact us"
      description="Reach out when the workspace needs a content correction, product fix, or filing clarification."
      initialUser={currentUser}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Contact</div>
          <h2 className="mt-[10px]">Support channels</h2>
        </div>
        <div className="grid gap-[18px]">
          <article className={ui.infoCard}>
            <div>
              <strong className="block text-[1rem]">Email support</strong>
              <p className="mt-2 text-[var(--muted)]">Use the workspace support inbox for billing questions, product bugs, or content corrections.</p>
            </div>
          </article>
          <article className={ui.infoCard}>
            <div>
              <strong className="block text-[1rem]">Product feedback</strong>
              <p className="mt-2 text-[var(--muted)]">Share missing workflows, confusing guidance, or pages that need a clearer founder-facing explanation.</p>
            </div>
          </article>
        </div>
      </section>
    </DashboardLayout>
  );
}

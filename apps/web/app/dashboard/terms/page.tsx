import { DashboardLayout } from "../../../components/dashboard-layout";
import { getCurrentUser } from "../../../lib/current-user";
import { ui } from "../../../components/ui-classes";

export default async function DashboardTermsPage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="Terms"
      description="The operating terms for using StartupFiles as a setup console."
      initialUser={currentUser}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Terms</div>
          <h2 className="mt-[10px]">Use of the console</h2>
        </div>
        <ul className="m-0 grid list-none gap-[14px] p-0">
          <li className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
            <div className="font-bold">Guidance, not legal advice</div>
            <div className="mt-1.5 text-[var(--muted)]">
              StartupFiles prepares documents and setup guidance, but it does not replace a lawyer, CPA, or tax professional.
            </div>
          </li>
          <li className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
            <div className="font-bold">Verification remains your responsibility</div>
            <div className="mt-1.5 text-[var(--muted)]">
              Founders remain responsible for checking filing rules, deadlines, and agency requirements before submitting anything official.
            </div>
          </li>
        </ul>
      </section>
    </DashboardLayout>
  );
}

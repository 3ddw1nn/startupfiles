import { DashboardLayout } from "../../../../components/dashboard-layout";
import { getCurrentUser } from "../../../../lib/current-user";
import {
  budgetingNotes,
  businessBudgetRows,
  businessComparisonColumns
} from "@startupfiles/shared/facts";
import { ui } from "../../../../components/ui-classes";

export default async function DashboardFactsBudgetingPage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="Budgeting and fees"
      description="Transparent setup cost planning across each business type, including the lower-cost sole proprietor path when you stay under your own legal name."
      initialUser={currentUser}
    >
      <section className="grid gap-[22px] lg:grid-cols-3">
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Cheapest</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">Sole proprietor</strong>
          <div className="text-[var(--muted)]">Individual path under your own legal name is typically the lowest-cost option.</div>
        </article>
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Middle ground</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">DBA / FBN or LLC</strong>
          <div className="text-[var(--muted)]">DBA stays lighter than LLC, while LLC buys separation at a higher startup cost.</div>
        </article>
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Highest overhead</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">S / C corp</strong>
          <div className="text-[var(--muted)]">These tracks usually carry more compliance, payroll, tax, and legal overhead.</div>
        </article>
      </section>

      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Budgeting table</div>
          <h2 className="mt-[10px]">What costs more and why</h2>
        </div>

        <div className={ui.factsTableWrap}>
          <table className={ui.factsTable}>
            <thead>
              <tr>
                <th className={`${ui.factsCell} ${ui.factsHead}`}>Budget area</th>
                {businessComparisonColumns.map((column) => (
                  <th key={column.key} className={`${ui.factsCell} ${ui.factsHead}`}>
                    <div className={ui.factsColumnHeader}>
                      <strong className={ui.factsColumnTitle}>{column.label}</strong>
                      {column.badge ? <span className={ui.factsColumnBadge}>{column.badge}</span> : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {businessBudgetRows.map((row) => (
                <tr key={row.label}>
                  <th className={`${ui.factsCell} ${ui.factsRowHeader}`}>{row.label}</th>
                  {businessComparisonColumns.map((column) => (
                    <td key={column.key} className={`${ui.factsCell} ${ui.factsBodyCell}`}>{row.values[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Transparency notes</div>
          <h2 className="mt-[10px]">How to read the costs</h2>
        </div>
        <ul className="m-0 grid list-none gap-[14px] p-0">
          {budgetingNotes.map((note) => (
            <li key={note} className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
              <div className="text-[var(--text)]">{note}</div>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}

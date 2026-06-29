import { DashboardLayout } from "../../../../components/dashboard-layout";
import { getCurrentUser } from "../../../../lib/current-user";
import {
  businessComparisonColumns,
  businessComparisonRows
} from "@startupfiles/shared/facts";
import { ui } from "../../../../components/ui-classes";

export default async function DashboardFactsComparisonPage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="Business type comparison"
      description="A transparent side-by-side view of how each business path compares, including the cheaper sole proprietor path when you operate under your own legal name."
      initialUser={currentUser}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Comparison table</div>
          <h2 className="mt-[10px]">See the tradeoffs clearly</h2>
          <p className="mt-[10px] max-w-[860px] text-[var(--muted)]">
            This page is here to make the differences obvious. Sole proprietor is split into the two real-world paths:
            operating as yourself under your legal name, or operating with a DBA / FBN public-facing name.
          </p>
        </div>

        <div className={ui.factsTableWrap}>
          <table className={ui.factsTable}>
            <thead>
              <tr>
                <th className={`${ui.factsCell} ${ui.factsHead}`}>Category</th>
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
              {businessComparisonRows.map((row) => (
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
    </DashboardLayout>
  );
}

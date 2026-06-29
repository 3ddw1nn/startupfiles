import { DashboardLayout } from "../../../components/dashboard-layout";
import { getCurrentUser } from "../../../lib/current-user";
import { ui } from "../../../components/ui-classes";

const allDocuments = [
  {
    title: "Business launch checklist",
    detail: "Shared startup checklist covering permits, licensing, tax registration, and document organization.",
    status: "Ready"
  },
  {
    title: "LLC formation packet",
    detail: "Formation paperwork tracker for articles, operating agreement, EIN, and bank setup.",
    status: "Ready"
  },
  {
    title: "DBA / FBN worksheet",
    detail: "Trade-name planning worksheet used across sole proprietor and LLC flows.",
    status: "In progress"
  },
  {
    title: "S corporation workspace",
    detail: "Reserved for a future guided flow once the S corporation setup experience is live.",
    status: "TBA"
  }
];

export default async function DashboardDocumentsPage() {
  const currentUser = await getCurrentUser();

  return (
    <DashboardLayout
      title="All documents"
      description="This is the cross-workspace shelf for every checklist, worksheet, and filing packet connected to your setup."
      initialUser={currentUser}
      progress={{
        currentStep: 4,
        totalSteps: 10,
        label: "Document shelf organized",
        actionHref: "/dashboard/llc/documents"
      }}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Documents library</div>
          <h2 className="mt-[10px]">Every document in one place</h2>
        </div>
        <div className="grid gap-[18px]">
          {allDocuments.map((document) => (
            <article
              key={document.title}
              className={ui.documentCard}
            >
              <div>
                <strong className="block text-[1rem]">{document.title}</strong>
                <p className="mt-2 text-[var(--muted)]">{document.detail}</p>
              </div>
              <span
                className={`inline-flex min-h-[30px] items-center justify-center rounded-full px-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] ${
                  document.status === "Ready"
                    ? "bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]"
                    : document.status === "In progress"
                      ? "bg-[color-mix(in_srgb,var(--warning)_16%,transparent)] text-[var(--warning)]"
                      : "bg-[color-mix(in_srgb,var(--muted)_12%,transparent)] text-[var(--muted)]"
                }`}
              >
                {document.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

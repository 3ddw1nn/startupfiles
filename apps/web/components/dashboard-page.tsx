import { DashboardLayout } from "./dashboard-layout";
import { ui } from "./ui-classes";

export function DashboardPage({
  title,
  description,
  cards,
  listTitle,
  listItems
}: {
  title: string;
  description: string;
  cards: Array<{ label: string; value: string; detail: string }>;
  listTitle: string;
  listItems: Array<{ title: string; detail: string }>;
}) {
  return (
    <DashboardLayout title={title} description={description}>
      <section className="grid gap-[22px] lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className={`${ui.surface} grid gap-2 p-6`}>
            <span className={ui.kicker}>{card.label}</span>
            <strong className="font-sans text-[2rem] tracking-[-0.04em]">{card.value}</strong>
            <div className="text-[var(--muted)]">{card.detail}</div>
          </article>
        ))}
      </section>

      <section className={`${ui.surface} p-6`}>
        <div className={ui.kicker}>{listTitle}</div>
        <ul className="mt-[18px] grid list-none gap-[14px] p-0">
          {listItems.map((item) => (
            <li key={item.title} className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
              <div className="font-bold">{item.title}</div>
              <div className="mt-1.5 text-[var(--muted)]">
                {item.detail}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}

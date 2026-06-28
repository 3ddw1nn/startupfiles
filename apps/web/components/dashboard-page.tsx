import { DashboardLayout } from "./dashboard-layout";

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
      <section className="gridThree">
        {cards.map((card) => (
          <article key={card.label} className="surface pageSection metric">
            <span className="kicker">{card.label}</span>
            <strong>{card.value}</strong>
            <div className="muted">{card.detail}</div>
          </article>
        ))}
      </section>

      <section className="surface pageSection">
        <div className="kicker">{listTitle}</div>
        <ul className="list" style={{ marginTop: 18 }}>
          {listItems.map((item) => (
            <li key={item.title}>
              <div style={{ fontWeight: 700 }}>{item.title}</div>
              <div className="muted" style={{ marginTop: 6 }}>
                {item.detail}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}

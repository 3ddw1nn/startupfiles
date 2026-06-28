import Link from "next/link";
import { PublicLayout } from "./public-layout";

export function MarketingPage({
  eyebrow,
  title,
  description,
  sections
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{ title: string; body: string }>;
}) {
  return (
    <PublicLayout>
      <div className="shell stack">
        <section className="surface pageSection">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="headline" style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)", margin: "20px 0 14px" }}>
            {title}
          </h1>
          <p className="muted" style={{ fontSize: "1.08rem", maxWidth: 760, margin: 0 }}>
            {description}
          </p>
          <div className="buttonRow" style={{ marginTop: 24 }}>
            <Link href="/sign-up" className="buttonPrimary">
              Start your setup
            </Link>
            <Link href="/dashboard" className="buttonSecondary">
              Preview the workspace
            </Link>
          </div>
        </section>

        <section className="gridTwo">
          {sections.map((section) => (
            <article key={section.title} className="surface pageSection stack">
              <div className="kicker">{section.title}</div>
              <p className="muted" style={{ margin: 0, fontSize: "1rem" }}>
                {section.body}
              </p>
            </article>
          ))}
        </section>
      </div>
    </PublicLayout>
  );
}

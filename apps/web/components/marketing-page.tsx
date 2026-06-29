import Link from "next/link";
import { PublicLayout } from "./public-layout";
import { ui } from "./ui-classes";

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
      <div className="mx-auto grid w-[min(var(--content-width),calc(100vw-32px))] gap-[18px]">
        <section className={`${ui.surface} p-6`}>
          <div className={ui.eyebrow}>{eyebrow}</div>
          <h1 className="font-sans text-[clamp(2.4rem,8vw,5rem)] leading-[0.98] tracking-[-0.045em] [margin:20px_0_14px]">
            {title}
          </h1>
          <p className="m-0 max-w-[760px] text-[1.08rem] text-[var(--muted)]">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3.5">
            <Link href="/sign-up" className={ui.buttonPrimary}>
              Start your setup
            </Link>
            <Link href="/dashboard" className={ui.buttonSecondary}>
              Preview the workspace
            </Link>
          </div>
        </section>

        <section className="grid gap-[22px] md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className={`${ui.surface} grid gap-[18px] p-6`}>
              <div className={ui.kicker}>{section.title}</div>
              <p className="m-0 text-[1rem] text-[var(--muted)]">
                {section.body}
              </p>
            </article>
          ))}
        </section>
      </div>
    </PublicLayout>
  );
}

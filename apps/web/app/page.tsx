import Link from "next/link";
import { PublicLayout } from "../components/public-layout";
import { ui } from "../components/ui-classes";

const workflow = [
  {
    title: "Answer the setup questions once",
    body: "Capture your founder details, business model, product lines, payment plans, and naming choices so the app can tailor the path."
  },
  {
    title: "Get the right phase recommendation",
    body: "Start with a sole proprietor workflow under your legal name, then move toward a California LLC only when risk or traction justifies it."
  },
  {
    title: "Generate prep docs and walkthroughs",
    body: "Turn your answers into checklists, government-form prep worksheets, compliance reminders, and records you can keep organized."
  }
];

const features = [
  "Phase-aware roadmap with not started, ready, blocked, and complete states.",
  "Document prep instead of vague blog content.",
  "Official-source links and verification reminders before filing.",
  "Clear warnings about DBA/FBN, public operator naming, and LLC timing."
];

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="mx-auto grid w-[min(var(--content-width),calc(100vw-32px))] gap-[18px]">
        <section className={`${ui.surface} overflow-hidden p-6`}>
          <div className="grid gap-[22px] md:grid-cols-2 md:items-center">
            <div className="grid gap-[18px]">
              <div className={ui.eyebrow}>California Solo Founder Setup</div>
              <h1 className="m-0 font-sans text-[clamp(3.2rem,10vw,7rem)] leading-[0.98] tracking-[-0.045em]">
                Build the business before it turns into a mess.
              </h1>
              <p className="m-0 max-w-[650px] text-[1.1rem] text-[var(--muted)]">
                StartupFiles gives solo founders a practical setup console for Phase 0 sole
                proprietor work, then shows exactly when Phase 1 LLC formation becomes the smart
                move.
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link href="/sign-up" className={ui.buttonPrimary}>
                  Start your setup
                </Link>
                <Link href="/dashboard" className={ui.buttonSecondary}>
                  View the workspace
                </Link>
              </div>
            </div>

            <div className="grid gap-[18px] rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,#fff6eb,#f7e5cf)] p-6 [html[data-theme='dark']_&]:border-[rgba(148,163,184,0.18)] [html[data-theme='dark']_&]:bg-[linear-gradient(180deg,rgba(20,28,49,0.96),rgba(14,21,38,0.94))]">
              <div className={ui.kicker}>What it helps with</div>
              <ul className="m-0 grid list-none gap-[14px] p-0">
                {features.map((feature) => (
                  <li key={feature} className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
                    <div>{feature}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-[22px] lg:grid-cols-3">
          {workflow.map((item) => (
            <article key={item.title} className={`${ui.surface} grid gap-[18px] p-6`}>
              <div className={ui.kicker}>{item.title}</div>
              <p className="m-0 text-[var(--muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section className={`${ui.surface} p-6`}>
          <div className="grid gap-[22px] md:grid-cols-2 md:items-start">
            <div className="grid gap-[18px]">
              <div className={ui.eyebrow}>Phase 0 First</div>
              <h2 className="m-0 font-sans text-[clamp(2.1rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.045em]">
                Start lean under your legal name, not under a made-up company shell.
              </h2>
            </div>
            <div className="grid gap-[18px]">
              <p className="m-0 text-[var(--muted)]">
                The initial StartupFiles path follows Edward’s setup: Irvine business license,
                Stripe as a sole proprietor if needed, no DBA/FBN unless using a separate public
                name, and no public use of Whale Tales Labs as the seller/operator before it
                legally exists.
              </p>
              <p className="m-0 text-[var(--muted)]">
                When customer payments, contracts, contractors, data risk, or hardware make things
                heavier, the app pivots into a California LLC formation packet and compliance
                calendar.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

import Link from "next/link";
import { PublicLayout } from "../components/public-layout";

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
      <div className="shell stack">
        <section className="surface pageSection" style={{ overflow: "hidden" }}>
          <div className="gridTwo" style={{ alignItems: "center" }}>
            <div className="stack">
              <div className="eyebrow">California Solo Founder Setup</div>
              <h1 className="headline" style={{ fontSize: "clamp(3.2rem, 10vw, 7rem)", margin: 0 }}>
                Build the business before it turns into a mess.
              </h1>
              <p className="muted" style={{ fontSize: "1.1rem", maxWidth: 650, margin: 0 }}>
                FounderFile gives solo founders a practical setup console for Phase 0 sole
                proprietor work, then shows exactly when Phase 1 LLC formation becomes the smart
                move.
              </p>
              <div className="buttonRow">
                <Link href="/sign-up" className="buttonPrimary">
                  Start your setup
                </Link>
                <Link href="/dashboard" className="buttonSecondary">
                  View the workspace
                </Link>
              </div>
            </div>

            <div className="card stack" style={{ background: "linear-gradient(180deg, #fff6eb, #f7e5cf)" }}>
              <div className="kicker">What it helps with</div>
              <ul className="list">
                {features.map((feature) => (
                  <li key={feature}>
                    <div>{feature}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="gridThree">
          {workflow.map((item) => (
            <article key={item.title} className="surface pageSection stack">
              <div className="kicker">{item.title}</div>
              <p className="muted" style={{ margin: 0 }}>
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section className="surface pageSection">
          <div className="gridTwo" style={{ alignItems: "start" }}>
            <div className="stack">
              <div className="eyebrow">Phase 0 First</div>
              <h2 className="headline" style={{ margin: 0, fontSize: "clamp(2.1rem, 6vw, 4.5rem)" }}>
                Start lean under your legal name, not under a made-up company shell.
              </h2>
            </div>
            <div className="stack">
              <p className="muted" style={{ margin: 0 }}>
                The initial FounderFile path follows Edward’s setup: Irvine business license,
                Stripe as a sole proprietor if needed, no DBA/FBN unless using a separate public
                name, and no public use of Whale Tales Labs as the seller/operator before it
                legally exists.
              </p>
              <p className="muted" style={{ margin: 0 }}>
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

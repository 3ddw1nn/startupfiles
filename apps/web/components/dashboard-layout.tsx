import Link from "next/link";
import type { Route } from "next";
import { dashboardNavItems } from "@startupfiles/shared/navigation";

export function DashboardLayout({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "20px 0 28px" }}>
      <div className="shell">
        <div className="dashboardShell">
          <aside className="surface pageSection" style={{ alignSelf: "start" }}>
            <div className="stack" style={{ marginBottom: 24 }}>
              <div className="eyebrow">Founder Workspace</div>
              <div>
                <div style={{ fontWeight: 800 }}>StartupFiles</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  Edward Lee workspace
                </div>
              </div>
            </div>

            <nav className="stack">
              {dashboardNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(49, 38, 24, 0.1)",
                    background: "rgba(255, 250, 242, 0.75)"
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{item.label}</div>
                  {item.description ? (
                    <div className="muted" style={{ fontSize: "0.92rem", marginTop: 6 }}>
                      {item.description}
                    </div>
                  ) : null}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="stack">
            <div className="surface pageSection">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "flex-start"
                }}
              >
                <div className="stack" style={{ maxWidth: 700 }}>
                  <div className="eyebrow">Phase 0 Active</div>
                  <div>
                    <h1 className="headline" style={{ margin: 0, fontSize: "clamp(2.3rem, 6vw, 4.4rem)" }}>
                      {title}
                    </h1>
                    <p className="muted" style={{ fontSize: "1.06rem", margin: "14px 0 0" }}>
                      {description}
                    </p>
                  </div>
                </div>
                <div
                  className="card"
                  style={{ minWidth: 240, background: "rgba(182, 82, 47, 0.08)" }}
                >
                  <div className="kicker">Current operator</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: 10 }}>
                    Edward Lee
                  </div>
                  <div className="muted" style={{ marginTop: 8 }}>
                    Whale Tales Labs should stay out of the public footer until a DBA/FBN or LLC
                    actually exists.
                  </div>
                </div>
              </div>
            </div>

            {children}
          </section>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Route } from "next";
import { publicNavItems } from "@startupfiles/shared/navigation";
import { siteConfig } from "@startupfiles/shared/site";

export function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "20px 0 36px" }}>
      <header className="shell">
        <div
          className="surface"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            padding: "16px 22px",
            marginBottom: 22
          }}
        >
          <div>
            <Link href="/" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              StartupFiles
            </Link>
            <div className="muted" style={{ fontSize: "0.95rem", marginTop: 4 }}>
              Guided setup workspace for California solo founders
            </div>
          </div>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href as Route} className="muted">
                {item.label}
              </Link>
            ))}
            <Link href="/sign-in" className="buttonSecondary">
              Sign in
            </Link>
            <Link href="/sign-up" className="buttonPrimary">
              Start your setup
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="shell" style={{ paddingTop: 22 }}>
        <div
          className="surface"
          style={{
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap"
          }}
        >
          <div className="stack" style={{ maxWidth: 540 }}>
            <strong>{siteConfig.name}</strong>
            <div className="muted">
              Structured guidance, official-source links, and document prep for founders who
              want to start lean and know when an LLC actually becomes worth it.
            </div>
          </div>
          <div className="stack" style={{ justifyItems: "end" }}>
            <div className="muted">{siteConfig.footerText}</div>
            <div className="muted" style={{ fontSize: "0.92rem", maxWidth: 440, textAlign: "right" }}>
              StartupFiles provides structured guidance and document preparation support. It is
              not legal, tax, or accounting advice.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

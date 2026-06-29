import Link from "next/link";
import type { Route } from "next";
import { publicNavItems } from "@startupfiles/shared/navigation";
import { siteConfig } from "@startupfiles/shared/site";
import { getCurrentUser } from "../lib/current-user";
import { ThemeToggle } from "./theme-toggle";
import { ui } from "./ui-classes";

export async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="px-0 pb-9 pt-5">
      <header className="mx-auto w-[min(var(--content-width),calc(100vw-32px))]">
        <div className={`${ui.surface} flex flex-wrap items-center justify-between gap-5 px-6 py-5`}>
          <div>
            <Link href="/" className="font-extrabold tracking-[-0.03em]">
              StartupFiles
            </Link>
            <div className="mt-1 text-[0.95rem] text-[var(--muted)]">
              Guided setup workspace for California solo founders
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-4 text-[0.96rem]">
            <ThemeToggle />
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
            {currentUser ? (
              <>
                <span className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel-strong)_68%,transparent)] px-4 text-[0.92rem] font-semibold text-[var(--text)]">
                  {currentUser.email}
                </span>
                <Link href="/dashboard" className={ui.buttonPrimary}>
                  <span className="inline-flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-md bg-black/10 text-[0.78rem] font-bold leading-none text-current" aria-hidden="true">
                    &gt;_
                  </span>
                  Console
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" className={ui.buttonSecondary}>
                  Sign in
                </Link>
                <Link href="/sign-up" className={ui.buttonPrimary}>
                  Start your setup
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mx-auto w-[min(var(--content-width),calc(100vw-32px))] pt-[22px]">
        <div className={`${ui.surface} flex flex-wrap justify-between gap-[18px] p-6`}>
          <div className="grid max-w-[540px] gap-[18px]">
            <strong>{siteConfig.name}</strong>
            <div className="text-[var(--muted)]">
              Structured guidance, official-source links, and document prep for founders who
              want to start lean and know when an LLC actually becomes worth it.
            </div>
          </div>
          <div className="grid gap-[18px] justify-items-end">
            <div className="text-[var(--muted)]">{siteConfig.footerText}</div>
            <div className="max-w-[440px] text-right text-[0.92rem] text-[var(--muted)]">
              StartupFiles provides structured guidance and document preparation support. It is
              not legal, tax, or accounting advice.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

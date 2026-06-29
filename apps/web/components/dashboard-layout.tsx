"use client";

import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import type { CurrentUser } from "@startupfiles/shared/domain";
import { businessTypeConfigs } from "@startupfiles/shared/dashboard";
import {
  dashboardBusinessSections,
  dashboardFactsNavSection,
  dashboardPrimaryNavItems
} from "@startupfiles/shared/navigation";
import { convexApi } from "../lib/convex-api";
import { ThemeToggle } from "./theme-toggle";
import { ui } from "./ui-classes";

function decodeJwtPayload(token: string | null): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  const payload = token.split(".")[1];
  if (!payload || typeof window === "undefined") {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(window.atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readStringClaim(payload: Record<string, unknown> | null, keys: string[]) {
  for (const key of keys) {
    const value = payload?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? "rotate-90" : "rotate-0"}`}
    >
      <path
        d="M3 2.5 7 6l-4 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-[22px] min-w-[42px] items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--panel-strong)_60%,transparent)] px-2 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
      {children}
    </span>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  return (
    <span
      className="relative inline-grid h-8 w-8 place-items-center rounded-full"
      aria-hidden="true"
      style={{
        background: `conic-gradient(var(--accent) ${percent * 3.6}deg, color-mix(in srgb, var(--muted) 16%, transparent) 0deg)`
      }}
    >
      <span className="absolute inset-[3px] rounded-full bg-[var(--panel-strong)]" />
      <span className="relative z-[1] text-[0.56rem] font-extrabold tracking-[-0.01em] text-[var(--text)]">
        {percent}%
      </span>
    </span>
  );
}

function navItemClass(active: boolean) {
  return active
    ? "flex min-h-[38px] items-center rounded-[10px] border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-3 py-2.5 text-[0.94rem] font-bold text-[var(--text)]"
    : "flex min-h-[38px] items-center rounded-[10px] border border-transparent px-3 py-2.5 text-[0.94rem] font-bold text-[var(--muted)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] hover:text-[var(--text)]";
}

function navSubItemClass(active: boolean) {
  return active
    ? "flex min-h-9 items-center rounded-lg border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] px-3 py-2 text-[0.9rem] text-[var(--text)]"
    : "flex min-h-9 items-center rounded-lg border border-transparent px-3 py-2 text-[0.9rem] text-[var(--muted)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_9%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] hover:text-[var(--text)]";
}

export function DashboardLayout({
  title,
  description,
  showHeader = true,
  progress,
  initialUser = null,
  children
}: {
  title: string;
  description: string;
  showHeader?: boolean;
  progress?: {
    currentStep: number;
    totalSteps: number;
    label?: string;
    actionHref?: string;
    actionLabel?: string;
  };
  initialUser?: CurrentUser | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const token = useAuthToken();
  const queriedUser = useQuery(convexApi.currentUser, {});
  const user = queriedUser ?? initialUser;
  const tokenPayload = decodeJwtPayload(token);
  const tokenEmail = readStringClaim(tokenPayload, ["email", "preferred_username"]);
  const tokenName = readStringClaim(tokenPayload, ["name"]);
  const accountLabel = user?.email ?? tokenEmail ?? user?.name ?? tokenName ?? "Account";
  const workspaceName = user?.name ?? tokenName ? `${user?.name ?? tokenName} workspace` : "Founder workspace";
  const avatarLabel = accountLabel.slice(0, 1).toUpperCase();
  const activeBusiness =
    businessTypeConfigs.find(
      (business) =>
        pathname === `/dashboard/${business.slug}` || pathname.startsWith(`/dashboard/${business.slug}/`)
    ) ?? null;
  const setupOverview = useQuery(convexApi.getSetupOverview, {});
  const lastBusinessType = setupOverview?.lastActiveBusinessType ?? null;
  const topbarBusinessType = activeBusiness?.slug ?? lastBusinessType ?? "sole-proprietor";
  const topbarBusiness =
    businessTypeConfigs.find((business) => business.slug === topbarBusinessType) ?? activeBusiness ?? null;
  const setupSession = useQuery(convexApi.getSetupSession, {
    businessType: topbarBusinessType
  });
  const setupSummary = setupOverview?.summaries.find((summary) => summary.businessType === topbarBusinessType);
  const hasStartedSetup = setupSession !== undefined && setupSession !== null;
  const resolvedProgress = progress ??
    (topbarBusiness
      ? {
          currentStep: setupSummary?.currentStep ?? 0,
          totalSteps: setupSummary?.totalSteps ?? topbarBusiness.totalSteps,
          actionHref: `/dashboard/${topbarBusiness.slug}/setup` as Route,
          actionLabel: "Start"
        }
      : {
          currentStep: 3,
          totalSteps: 10,
          actionHref: "/dashboard/llc" as Route
        });

  const effectiveHref = hasStartedSetup
    ? (`/dashboard/${topbarBusinessType}/setup` as Route)
    : (topbarBusiness ? (`/dashboard/${topbarBusiness.slug}/setup` as Route) : resolvedProgress.actionHref);
  const effectiveLabel = hasStartedSetup ? "Resume" : (topbarBusiness ? "Start" : resolvedProgress.actionLabel);
  const progressPercent =
    resolvedProgress.totalSteps > 0
      ? Math.round(
          ((setupSummary?.completedSteps ?? Math.max(resolvedProgress.currentStep - 1, 0)) /
            resolvedProgress.totalSteps) *
            100
        )
      : 0;

  const onSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="grid min-h-screen grid-cols-[292px_minmax(0,1fr)] bg-transparent">
      <aside className="sticky top-0 z-[1] grid h-screen grid-rows-[auto_1fr_auto] gap-[18px] border-r border-[var(--border)] bg-[var(--panel-strong)] p-[18px] backdrop-blur-[24px]">
        <Link href="/" className="grid min-h-[54px] grid-cols-[38px_minmax(0,1fr)] items-center gap-3">
          <span className="inline-grid h-[38px] w-[38px] place-items-center rounded-xl bg-[linear-gradient(180deg,var(--text),color-mix(in_srgb,var(--text)_78%,var(--accent)))] text-[0.84rem] font-extrabold text-[var(--panel-strong)]">
            SF
          </span>
          <span className="min-w-0">
            <strong className="block text-[1rem]">StartupFiles</strong>
            <span className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[0.86rem] text-[var(--muted)]">
              {workspaceName}
            </span>
          </span>
        </Link>

        <nav className="grid content-start gap-2.5 overflow-auto py-2" aria-label="Dashboard">
          {dashboardPrimaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href as Route} className={navItemClass(isActive)}>
                {item.label}
              </Link>
            );
          })}

          <details className="grid gap-1.5 py-0.5" open={pathname.startsWith("/dashboard/facts")}>
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-[10px] border border-transparent px-3 py-2.5 text-[0.94rem] font-bold text-[var(--text)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
              <span className="grid min-w-0 gap-0.5">
                <span className="inline-flex min-w-0 items-center gap-2.5">
                  <Chevron open={pathname.startsWith("/dashboard/facts")} />
                  <span>{dashboardFactsNavSection.label}</span>
                </span>
                <span className="text-[0.72rem] font-semibold tracking-[0.01em] text-[var(--muted)]">
                  Business tradeoffs and cost transparency
                </span>
              </span>
            </summary>
            <div className="mt-0.5 grid gap-1 border-l border-[color-mix(in_srgb,var(--border)_80%,transparent)] pl-[18px]">
              {dashboardFactsNavSection.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href as Route} className={navSubItemClass(isActive)}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </details>

          <div className="px-2.5 pb-0.5 pt-3.5 font-mono text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[var(--muted)]">
            Business types
          </div>
          {dashboardBusinessSections.map((section) => {
            const sectionIsActive = section.items.some(
              (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
            );
            const sectionSummary = setupOverview?.summaries.find((summary) => summary.businessType === section.id);
            const sectionTotalSteps =
              sectionSummary?.totalSteps ??
              businessTypeConfigs.find((business) => business.slug === section.id)?.totalSteps ??
              0;
            const sectionCompletedSteps = sectionSummary?.completedSteps ?? 0;
            const sectionPercent =
              sectionTotalSteps > 0 ? Math.round((sectionCompletedSteps / sectionTotalSteps) * 100) : 0;
            const sectionStepLabel = sectionSummary
              ? `Step ${sectionSummary.currentStep} of ${sectionSummary.totalSteps}`
              : `Step 0 of ${sectionTotalSteps}`;

            if (section.disabled) {
              return (
                <div key={section.id} className="grid gap-1.5 py-0.5" aria-disabled="true">
                  <div className="flex min-h-10 items-center justify-between gap-3 rounded-[10px] bg-[color-mix(in_srgb,var(--panel-strong)_55%,transparent)] px-3 py-2.5 text-[color-mix(in_srgb,var(--muted)_70%,transparent)]">
                    <span className="grid min-w-0 gap-0.5">
                      <span className="inline-flex min-w-0 items-center gap-2.5">
                        <span>{section.label}</span>
                      </span>
                      <span className="text-[0.72rem] font-semibold tracking-[0.01em] text-[var(--muted)]">
                        Coming soon
                      </span>
                    </span>
                    {section.badge ? <NavBadge>{section.badge}</NavBadge> : null}
                  </div>
                </div>
              );
            }

            return (
              <details key={section.id} className="grid gap-1.5 py-0.5" open={sectionIsActive}>
                <summary
                  className={`flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-[10px] border px-3 py-2.5 text-[0.94rem] font-bold transition-colors ${
                    sectionIsActive
                      ? "border-[color-mix(in_srgb,var(--accent)_16%,transparent)]"
                      : "border-transparent hover:border-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                  }`}
                >
                  <span className="grid min-w-0 gap-0.5">
                    <span className="inline-flex min-w-0 items-center gap-2.5">
                      <Chevron open={sectionIsActive} />
                      <span>{section.label}</span>
                    </span>
                    <span className="text-[0.72rem] font-semibold tracking-[0.01em] text-[var(--muted)]">
                      {sectionStepLabel}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2">
                    <ProgressRing percent={sectionPercent} />
                    {section.badge ? <NavBadge>{section.badge}</NavBadge> : null}
                  </span>
                </summary>
                <div className="mt-0.5 grid gap-1 border-l border-[color-mix(in_srgb,var(--border)_80%,transparent)] pl-[18px]">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href as Route} className={navSubItemClass(isActive)}>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </nav>

        <div className="grid content-end gap-3">
          <details className="relative">
            <summary className="grid min-h-[52px] cursor-pointer list-none grid-cols-[34px_minmax(0,1fr)_12px] items-center gap-2.5 rounded-[14px] border border-[var(--border)] bg-[var(--panel-strong)] p-2">
              <span className="inline-grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] font-extrabold text-[var(--accent-strong)]">
                {avatarLabel}
              </span>
              <span className="min-w-0">
                <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[0.9rem]">
                  {accountLabel}
                </strong>
                <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[0.82rem] text-[var(--muted)]">
                  Account
                </span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 text-[var(--muted)]">
                <path
                  d="M2.5 4.25 6 7.75l3.5-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className="absolute bottom-[calc(100%+10px)] left-0 z-[5] grid min-w-[220px] gap-1 rounded-[16px] border border-[var(--border)] bg-[var(--panel-strong)] p-2 shadow-[0_18px_50px_rgba(2,6,23,0.28)]">
              <Link href={"/dashboard/account" as Route} className="flex min-h-9 items-center rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]">
                Account settings
              </Link>
              <Link href={"/dashboard/privacy" as Route} className="flex min-h-9 items-center rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]">
                Privacy
              </Link>
              <Link href={"/dashboard/terms" as Route} className="flex min-h-9 items-center rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]">
                Terms
              </Link>
              <Link href={"/dashboard/contact" as Route} className="flex min-h-9 items-center rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]">
                Contact us
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className="flex min-h-9 w-full items-center rounded-md border-0 bg-transparent px-2.5 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
              >
                Sign out
              </button>
            </div>
          </details>
        </div>
      </aside>

      <main className="relative z-[2] min-w-0 pb-[42px]">
        <header className="sticky top-0 z-[9] grid min-h-[68px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[18px] border-b border-[var(--border)] bg-white px-[22px] py-[10px] backdrop-blur-[20px] [html[data-theme='dark']_&]:bg-[rgba(11,17,32,0.94)]">
          <div className="flex items-center">
            <ThemeToggle />
          </div>
          <div className="grid min-w-0 gap-0.5">
            <div className="font-mono text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
              {topbarBusiness ? topbarBusiness.label : "Dashboard"}
            </div>
            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.98rem] leading-[1.1] tracking-[-0.02em]">
              {title || "Founder console"}
            </strong>
          </div>
          <div className="flex min-w-[min(520px,100%)] items-center gap-3.5">
            <div className="grid min-w-[152px] gap-0.5">
              <strong className="text-[0.88rem]">
                Step {resolvedProgress.currentStep} of {resolvedProgress.totalSteps}
              </strong>
              <span className="text-[0.78rem] text-[var(--muted)]">
                {resolvedProgress.label ?? `${progressPercent}% completed`}
              </span>
            </div>
            <div
              className="h-2 flex-[1_1_180px] overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--muted)_18%,transparent)]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={resolvedProgress.totalSteps}
              aria-valuenow={resolvedProgress.currentStep}
            >
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_45%,#22c55e))]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {effectiveHref ? (
              <Link href={effectiveHref as Route} className={ui.buttonPrimary}>
                {effectiveLabel ?? "Continue"}
              </Link>
            ) : (
              <button type="button" className={ui.buttonSecondary} disabled>
                Continue
              </button>
            )}
          </div>
        </header>

        <section className="grid max-w-[1240px] gap-[18px] px-[22px]">
          {showHeader ? (
            <div className="grid max-w-[960px] gap-2 px-[22px] pb-0 pt-6">
              <div className="font-mono text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
                {activeBusiness ? activeBusiness.label : "Dashboard"}
              </div>
              <h1 className="m-0 text-[clamp(2.1rem,4vw,3rem)] leading-[1.02] tracking-[-0.045em]">
                {title}
              </h1>
              <p className="m-0 text-[1rem] leading-[1.5] text-[var(--muted)]">{description}</p>
            </div>
          ) : null}
          {children}
        </section>
      </main>
    </div>
  );
}

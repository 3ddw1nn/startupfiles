"use client";

import Link from "next/link";
import type { Route } from "next";
import { useQuery } from "convex/react";
import type { BusinessTypeConfig, SetupDocument } from "@startupfiles/shared/dashboard";
import type { CurrentUser } from "@startupfiles/shared/domain";
import { getSetupConfig } from "@startupfiles/shared/setup";
import { DashboardLayout } from "./dashboard-layout";
import { convexApi } from "../lib/convex-api";
import { ui } from "./ui-classes";

function getDocumentStatusLabel(status: SetupDocument["status"]) {
  if (status === "ready") {
    return "Ready";
  }

  if (status === "in_progress") {
    return "In progress";
  }

  return "TBA";
}

export function BusinessOverviewPage({
  business,
  initialUser
}: {
  business: BusinessTypeConfig;
  initialUser?: CurrentUser | null;
}) {
  const setupConfig = getSetupConfig(business.slug);
  const session = useQuery(convexApi.getSetupSession, { businessType: business.slug });
  const hasSession = session !== undefined && session !== null;

  // Compute real progress from setup session, falling back to config defaults
  const totalSteps = setupConfig?.totalSteps ?? business.totalSteps;
  const completedSteps = hasSession
    ? session!.stepStatuses.filter((s: string) => s === "complete").length
    : business.completedSteps;
  const completionPercent =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <DashboardLayout
      title={`${business.label} setup`}
      description={business.summary}
      initialUser={initialUser}
      progress={{
        currentStep: Math.max(completedSteps, 1),
        totalSteps,
        label: `${completionPercent}% complete`,
        actionHref: business.available ? (`/dashboard/${business.slug}/setup` as Route) : undefined
      }}
    >
      <section className="grid gap-[22px] lg:grid-cols-3">
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Completed</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">{completedSteps}</strong>
          <div className="text-[var(--muted)]">Steps finished for this business type.</div>
        </article>
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Remaining</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">{Math.max(totalSteps - completedSteps, 0)}</strong>
          <div className="text-[var(--muted)]">Tasks still ahead before this setup track is complete.</div>
        </article>
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Next focus</span>
          <strong className="text-[1.2rem] leading-[1.35]">{business.available ? "Keep moving" : "Coming soon"}</strong>
          <div className="text-[var(--muted)]">{business.nextStep}</div>
        </article>
      </section>

      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Overall progress</div>
          <h2 className="mt-[10px]">{business.label} roadmap</h2>
          <p className="mt-2 max-w-[760px] text-[var(--muted)]">
            {business.nextStep}
          </p>
        </div>
        <ul className="grid list-none gap-[14px] p-0 m-0">
          {business.milestones.map((item) => (
            <li key={item} className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
              <div className="font-bold">{item}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-[22px] md:grid-cols-2">
        <article className={`${ui.surface} grid gap-[18px] p-6`}>
          <div className={ui.kicker}>DBA / FBN</div>
          <h3 className="mt-1.5">Naming and filing</h3>
          <p className="m-0 text-[var(--muted)]">
            Keep your public name, county filing, and document set aligned from the start.
          </p>
          <Link href={`/dashboard/${business.slug}/dba-fbn` as Route} className={ui.buttonSecondary}>
            Open DBA / FBN
          </Link>
        </article>

        <article className={`${ui.surface} grid gap-[18px] p-6`}>
          <div className={ui.kicker}>Documents</div>
          <h3 className="mt-1.5">Track your paperwork</h3>
          <p className="m-0 text-[var(--muted)]">
            Keep formation paperwork, registrations, and supporting docs in one place.
          </p>
          <Link href={`/dashboard/${business.slug}/documents` as Route} className={ui.buttonSecondary}>
            Open documents
          </Link>
        </article>
      </section>
    </DashboardLayout>
  );
}

export function BusinessDbaPage({
  business,
  initialUser
}: {
  business: BusinessTypeConfig;
  initialUser?: CurrentUser | null;
}) {
  return (
    <DashboardLayout
      title={`${business.label} DBA / FBN`}
      description="Track whether this business needs a trade-name filing and what documents should stay aligned with it."
      initialUser={initialUser}
      progress={{
        currentStep: business.completedSteps,
        totalSteps: business.totalSteps,
        actionHref: business.available ? (`/dashboard/${business.slug}/documents` as Route) : undefined
      }}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>DBA / FBN checklist</div>
          <h2 className="mt-[10px]">Name setup for {business.label}</h2>
        </div>
        <ul className="grid list-none gap-[14px] p-0 m-0">
          {business.dbaChecklist.map((item) => (
            <li key={item} className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
              <div className="font-bold">{item}</div>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}

export function BusinessDocumentsPage({
  business,
  initialUser
}: {
  business: BusinessTypeConfig;
  initialUser?: CurrentUser | null;
}) {
  return (
    <DashboardLayout
      title={`${business.label} documents`}
      description="A focused document shelf for the paperwork that belongs to this setup path."
      initialUser={initialUser}
      progress={{
        currentStep: business.completedSteps,
        totalSteps: business.totalSteps,
        actionHref: business.available ? (`/dashboard/${business.slug}` as Route) : undefined
      }}
    >
      <section className={`${ui.surface} grid gap-[18px] p-6`}>
        <div>
          <div className={ui.kicker}>Documents</div>
          <h2 className="mt-[10px]">{business.label} paperwork</h2>
        </div>
        <div className="grid gap-[18px]">
          {business.documents.map((document) => (
            <article
              key={document.title}
              className={ui.documentCard}
            >
              <div>
                <strong className="block text-[1rem]">{document.title}</strong>
                <p className="mt-2 text-[var(--muted)]">{document.detail}</p>
              </div>
              <span
                className={`inline-flex min-h-[30px] items-center justify-center rounded-full px-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] ${
                  document.status === "ready"
                    ? "bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]"
                    : document.status === "in_progress"
                      ? "bg-[color-mix(in_srgb,var(--warning)_16%,transparent)] text-[var(--warning)]"
                      : "bg-[color-mix(in_srgb,var(--muted)_12%,transparent)] text-[var(--muted)]"
                }`}
              >
                {getDocumentStatusLabel(document.status)}
              </span>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

"use client";

import Link from "next/link";
import type { Route } from "next";
import { useQuery } from "convex/react";
import { businessTypeConfigs } from "@startupfiles/shared/dashboard";
import { convexApi } from "../lib/convex-api";
import { ui } from "./ui-classes";

export function DashboardHomeContent() {
  const setupOverview = useQuery(convexApi.getSetupOverview, {});
  const activeType = setupOverview?.lastActiveBusinessType ?? "sole-proprietor";
  const activeBusiness =
    businessTypeConfigs.find((business) => business.slug === activeType) ?? businessTypeConfigs[0];
  const activeSummary = setupOverview?.summaries.find((summary) => summary.businessType === activeType);
  const documentsCount = activeBusiness.documents.length;
  const completedSteps = activeSummary?.completedSteps ?? 0;
  const totalSteps = activeSummary?.totalSteps ?? activeBusiness.totalSteps;

  return (
    <>
      <section className="grid gap-[22px] lg:grid-cols-3">
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Active track</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">{activeBusiness.label}</strong>
          <div className="text-[var(--muted)]">This is the last business type you worked on in the setup flow.</div>
        </article>
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Documents</span>
          <strong className="font-sans text-[2rem] tracking-[-0.04em]">{documentsCount}</strong>
          <div className="text-[var(--muted)]">Documents currently attached to the {activeBusiness.label.toLowerCase()} setup path.</div>
        </article>
        <article className={`${ui.surface} grid gap-2 p-6`}>
          <span className={ui.kicker}>Next action</span>
          <strong className="text-[1.2rem] leading-[1.35]">
            Step {Math.max(activeSummary?.currentStep ?? 1, 1)} of {totalSteps}
          </strong>
          <div className="text-[var(--muted)]">
            {completedSteps > 0
              ? `Resume your ${activeBusiness.label.toLowerCase()} setup where you left off.`
              : `Start the ${activeBusiness.label.toLowerCase()} setup flow.`}
          </div>
        </article>
      </section>

      <section className="grid gap-[22px] md:grid-cols-2">
        <article className={`${ui.surface} grid gap-[18px] p-6`}>
          <div>
            <div className={ui.kicker}>Business types</div>
            <h2 className="mt-[10px]">Choose a setup path</h2>
            <p className="mt-2 text-[var(--muted)]">
              Each business type now has its own progress overview, document shelf, and DBA / FBN workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link href={"/dashboard/sole-proprietor" as Route} className={ui.buttonSecondary}>
              Sole proprietor
            </Link>
            <Link href={"/dashboard/llc" as Route} className={ui.buttonPrimary}>
              Open LLC
            </Link>
          </div>
        </article>

        <article className={`${ui.surface} grid gap-[18px] p-6`}>
          <div>
            <div className={ui.kicker}>All documents</div>
            <h2 className="mt-[10px]">One place for every file</h2>
            <p className="mt-2 text-[var(--muted)]">
              Browse everything across the dashboard or drop into the document page inside any entity section.
            </p>
          </div>
          <Link href={"/dashboard/documents" as Route} className={ui.buttonSecondary}>
            Open all documents
          </Link>
        </article>
      </section>
    </>
  );
}

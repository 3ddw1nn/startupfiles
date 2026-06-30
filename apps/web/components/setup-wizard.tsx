"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { DashboardLayout } from "./dashboard-layout";
import { convexApi } from "../lib/convex-api";
import { ui } from "./ui-classes";
import type { CurrentUser } from "@startupfiles/shared/domain";
import { getSetupConfig, type SetupConfig, type SetupStep } from "@startupfiles/shared/setup";

type SetupSession = {
  currentStep: number;
  stepStatuses: string[];
  isEntityApplication?: boolean;
  legalFirstName?: string;
  legalMiddleName?: string;
  legalLastName?: string;
  legalSuffix?: string;
  needsDba?: boolean;
  dbaName?: string;
  dbaCounty?: string;
  dbaNewspaperName?: string;
  dbaPublicationFiled?: boolean;
  isCompleted: boolean;
} | null;

type StepOneDraft = {
  isEntityApplication: boolean | null;
  legalFirstName: string;
  legalMiddleName: string;
  legalLastName: string;
  legalSuffix: string;
};

type StepTwoDraft = {
  needsDba: boolean | null;
  dbaName: string;
  dbaCounty: string;
  dbaNewspaperName: string;
  dbaPublicationFiled: boolean;
};

const tw = {
  muted: "text-[var(--muted)]",
  stack: "grid gap-[18px]",
  kicker: ui.kicker,
  surfaceInset:
    "rounded-[20px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_76%,transparent)] p-5",
  setupWorkspace:
    "grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,360px)]",
  setupRail: "grid gap-[18px] xl:sticky xl:top-[92px]",
  setupRailPanel: `${ui.surface} p-[22px]`,
  setupWorkbench: `${ui.surface} mt-6 grid gap-6 p-7`,
  setupStage: "grid gap-5",
  setupInfoPanel:
    "rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_84%,transparent),color-mix(in_srgb,var(--panel)_70%,transparent))] p-[22px]",
  setupBulletList: "m-0 grid list-none gap-3 p-0",
  setupBulletListSimple: "m-0 grid list-none gap-3 p-0",
  setupSummaryGrid: "grid gap-4 md:grid-cols-2",
  setupReviewGrid: "grid gap-4 md:grid-cols-2",
  setupChoiceGrid: "grid gap-4 md:grid-cols-2",
  setupFormGrid: "grid gap-4 md:grid-cols-2",
  setupField: "grid gap-2",
  setupError:
    "rounded-2xl border border-[color-mix(in_srgb,#ff6b6b_34%,transparent)] bg-[color-mix(in_srgb,#ff6b6b_10%,transparent)] px-4 py-3 text-[var(--text)]",
  setupActionBar:
    "grid items-center gap-4 border-t border-[var(--border)] pt-[18px] md:grid-cols-[auto_minmax(0,1fr)_auto]",
  setupActionMeta: "grid gap-1",
  setupButtonPrimary:
    "min-h-[52px] rounded-2xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_86%,white),var(--accent))] px-[22px] font-bold tracking-[-0.01em] text-white shadow-[0_16px_36px_color-mix(in_srgb,var(--accent)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:shadow-none",
  setupButtonSecondary:
    "min-h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-[22px] font-bold tracking-[-0.01em] text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-[0.55]",
  setupPageSpacing: "",
  setupContentGrid: "grid items-start gap-[18px]",
  setupPrimaryPanel: "grid gap-[18px]",
  setupRoadmapPreview: "grid gap-2.5",
  setupRoadmapRow: "grid gap-1.5",
  setupMiniStats: "grid gap-3 md:grid-cols-2"
} as const;

function getStatusLabel(status: string) {
  if (status === "complete") return "Complete";
  if (status === "in_progress") return "In progress";
  if (status === "not_needed") return "Not needed";
  return "Not started";
}

function getStatusTone(status: string) {
  if (status === "complete") return "complete";
  if (status === "in_progress") return "active";
  if (status === "not_needed") return "muted";
  return "idle";
}

function getStepPreparation(step: SetupStep) {
  return [
    `Review the scope for ${step.title.toLowerCase()} before you click through it.`,
    `Capture the business name, timing, and jurisdiction details that connect to this step.`,
    "Keep documents and decisions consistent so the later filings do not drift."
  ];
}

function getStepOutputs(step: SetupStep) {
  return [
    `${step.title} plan recorded`,
    "Inputs aligned with your other documents",
    "Clear handoff into the next step"
  ];
}

function getDefaultSubstepIndex(step: SetupStep, session: SetupSession) {
  if (!session) return 0;
  if (step.stepNumber !== 1) return 0;
  if (session.stepStatuses[0] === "complete") return step.substeps.length - 1;
  if (session.isEntityApplication === undefined) return 0;
  if (session.isEntityApplication === false) {
    const hasName = Boolean(session.legalFirstName?.trim() && session.legalLastName?.trim());
    return hasName ? step.substeps.length - 1 : 1;
  }
  return step.substeps.length - 1;
}

function getCurrentStepPercent(step: SetupStep, session: SetupSession, substepIndex: number) {
  if (!session) return 0;
  const status = session.stepStatuses[step.stepNumber - 1] ?? "not_started";
  if (status === "complete" || status === "not_needed") return 100;
  const total = Math.max(step.substeps.length, 1);
  return Math.round((substepIndex / total) * 100);
}

function normalizeStepStatuses(config: SetupConfig, statuses: string[] | undefined, currentStep: number) {
  const latestInProgressIndex = statuses?.reduce(
    (latest, status, index) => (status === "in_progress" ? index : latest),
    -1
  ) ?? -1;
  const minimumStep = statuses ? 1 : 0;
  const effectiveCurrentStep = Math.min(
    Math.max(currentStep, latestInProgressIndex + 1, minimumStep),
    config.totalSteps
  );

  return config.steps.map((step, index) => {
    const status = statuses?.[index] ?? (step.stepNumber === effectiveCurrentStep ? "in_progress" : "not_started");
    if (step.stepNumber < effectiveCurrentStep && status !== "not_needed") return "complete";
    if (step.stepNumber === effectiveCurrentStep && status === "not_started") return "in_progress";
    return status;
  });
}

function getEffectiveCurrentStep(statuses: string[] | undefined, fallbackStep: number) {
  const latestInProgressIndex = statuses?.reduce(
    (latest, status, index) => (status === "in_progress" ? index : latest),
    -1
  ) ?? -1;
  const minimumStep = statuses ? 1 : 0;
  return Math.max(fallbackStep, latestInProgressIndex + 1, minimumStep);
}

function SetupProgressRail({
  config,
  session,
  currentStep,
  stepStatuses,
  activeSubstepIndex,
  onNavigate
}: {
  config: SetupConfig;
  session: SetupSession;
  currentStep: number;
  stepStatuses: string[];
  activeSubstepIndex: number;
  onNavigate: (stepNumber: number) => void;
}) {
  const completedSteps = stepStatuses.filter((status) => status === "complete" || status === "not_needed").length;
  const overallPercent = Math.round((completedSteps / config.totalSteps) * 100);

  return (
    <aside className={tw.setupRail}>
      <section className={tw.setupRailPanel}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={tw.kicker}>Progress map</div>
            <h2 className="mt-2 text-[1.15rem]">Roadmap</h2>
          </div>
          <div className="rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-3 py-2 font-bold text-[var(--text)]">{overallPercent}%</div>
        </div>
        <div className="mt-[18px] grid gap-2.5">
          {config.steps.map((step) => {
            const status = stepStatuses[step.stepNumber - 1] ?? "not_started";
            const tone = getStatusTone(status);
            const isCurrent = currentStep === step.stepNumber;
            const isDone = status === "complete" || status === "not_needed";
            const progress = isCurrent
              ? getCurrentStepPercent(step, session, activeSubstepIndex)
              : status === "complete" || status === "not_needed"
                ? 100
                : 0;

            return (
              <button
                key={step.stepNumber}
                type="button"
                className={`grid items-center gap-[14px] rounded-[18px] border px-[14px] py-[14px] text-left md:grid-cols-[48px_minmax(0,1fr)] ${
                  isCurrent
                    ? "border-[color-mix(in_srgb,var(--accent)_44%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_11%,var(--panel))] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
                    : "border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_72%,transparent)]"
                }`}
                onClick={() => onNavigate(step.stepNumber)}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full border text-[0.95rem] font-extrabold ${
                    isDone
                      ? "border-[color-mix(in_srgb,var(--success)_42%,transparent)] bg-[color-mix(in_srgb,var(--success)_16%,transparent)] text-[var(--success)]"
                      : tone === "active"
                        ? "border-[color-mix(in_srgb,var(--border)_88%,transparent)] text-[var(--text)]"
                        : "border-[color-mix(in_srgb,var(--border)_88%,transparent)] text-[var(--muted)]"
                  }`}
                  style={{ ["--progress" as string]: `${progress}%` }}
                  aria-hidden="true"
                >
                  {isDone ? "✓" : step.stepNumber}
                </span>
                <span className="grid gap-1">
                  <span className="flex items-center justify-between gap-2.5 text-[0.8rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                    <strong>Step {step.stepNumber}</strong>
                    <span>{step.substeps.length} checkpoints</span>
                  </span>
                  <span className="text-[1rem] font-bold">{step.title}</span>
                  <span className="text-[0.92rem] text-[var(--muted)]">{getStatusLabel(status)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={tw.setupRailPanel}>
        <div className={tw.kicker}>Session status</div>
        <div className={`${tw.setupMiniStats} mt-[18px]`}>
          <article className="rounded-[18px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-5 py-[18px]">
            <span className="block text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">Completed</span>
            <strong className="mt-2.5 block text-[1.3rem]">{completedSteps}</strong>
          </article>
          <article className="rounded-[18px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-5 py-[18px]">
            <span className="block text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">Remaining</span>
            <strong className="mt-2.5 block text-[1.3rem]">{Math.max(config.totalSteps - completedSteps, 0)}</strong>
          </article>
        </div>
        <p className={`m-0 mt-[18px] ${tw.muted}`}>
          Each step can hold multiple checkpoints, so we can keep the flow structured without flattening everything into one long form.
        </p>
      </section>
    </aside>
  );
}

function SetupKickoff({
  config,
  businessType,
  saving,
  error,
  onStart
}: {
  config: SetupConfig;
  businessType: string;
  saving: boolean;
  error: string | null;
  onStart: () => Promise<void>;
}) {
  const businessLabel = businessType === "llc" ? "LLC" : "Sole proprietor";

  return (
    <div className={tw.setupWorkspace}>
      <section className={tw.setupWorkbench}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <div>
            <div className={tw.kicker}>{businessLabel}</div>
            <h1 className="mt-2.5 font-sans text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.05em]">Build this setup one decision at a time.</h1>
            <p className="mt-[14px] max-w-[760px] text-[1.05rem] leading-[1.7] text-[var(--muted)]">
              This setup flow is now structured around core steps and smaller checkpoints inside each one, so the user always knows what comes next and what is already locked in.
            </p>
          </div>
          <div className="grid gap-3">
            <article className="rounded-[18px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-5 py-[18px]">
              <span className="block text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">Total steps</span>
              <strong className="mt-2.5 block text-[1.3rem]">{config.totalSteps}</strong>
            </article>
            <article className="rounded-[18px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-5 py-[18px]">
              <span className="block text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">Checkpoints</span>
              <strong className="mt-2.5 block text-[1.3rem]">{config.steps.reduce((total, step) => total + step.substeps.length, 0)}</strong>
            </article>
            <article className="rounded-[18px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-5 py-[18px]">
              <span className="block text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">Current status</span>
              <strong className="mt-2.5 block text-[1.3rem]">Not started</strong>
            </article>
          </div>
        </div>

        <div className="grid gap-[18px] md:grid-cols-2">
          <article className={`${tw.surfaceInset} ${tw.stack}`}>
            <div className={tw.kicker}>How it works</div>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <strong>Step flow</strong>
                <p className={tw.muted}>Every major setup task lives in its own step with dedicated back and next controls.</p>
              </div>
              <div className="grid gap-1.5">
                <strong>Checkpoint system</strong>
                <p className={tw.muted}>Each step can hold smaller questions and reviews, like a step 1.1, 1.2, and 1.3 flow.</p>
              </div>
              <div className="grid gap-1.5">
                <strong>Persistent progress</strong>
                <p className={tw.muted}>Main step progress stays connected to the saved setup session so the dashboard stays in sync.</p>
              </div>
            </div>
          </article>

          <article className={`${tw.surfaceInset} ${tw.stack}`}>
            <div className={tw.kicker}>What you will cover</div>
            <ul className={tw.setupBulletList}>
              {config.steps.slice(0, 4).map((step) => (
                <li key={step.stepNumber} className="grid gap-0.5">
                  <strong>Step {step.stepNumber}</strong>
                  <span className={tw.muted}>{step.title}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {error ? <div className={tw.setupError}>{error}</div> : null}

        <div className={tw.setupActionBar}>
          <div className={tw.setupActionMeta}>
            <strong>Ready to begin?</strong>
            <span className={tw.muted}>The first step starts with applicant identity and legal naming.</span>
          </div>
          <button type="button" className={tw.setupButtonPrimary} disabled={saving} onClick={onStart}>
            {saving ? "Starting..." : "Launch setup flow"}
          </button>
        </div>
      </section>

      <aside className={tw.setupRail}>
        <section className={tw.setupRailPanel}>
          <div className={tw.kicker}>Roadmap preview</div>
          <div className={`${tw.setupRoadmapPreview} mt-[18px]`}>
            {config.steps.map((step) => (
              <div key={step.stepNumber} className={tw.setupRoadmapRow}>
                <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted)]">Step {step.stepNumber}</span>
                <strong className="text-[1.02rem]">{step.title}</strong>
                <span className={tw.muted}>{step.substeps.length} checkpoints</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function EntityChoiceCard({
  selected,
  title,
  detail,
  onClick
}: {
  selected: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`grid min-h-[190px] gap-2.5 rounded-[22px] border p-[22px] text-left ${
        selected
          ? "border-[color-mix(in_srgb,var(--accent)_46%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--panel))] shadow-[0_12px_36px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
          : "border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_74%,transparent)]"
      }`}
      onClick={onClick}
    >
      <span
        className={`h-[14px] w-[14px] rounded-full border-2 ${selected ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border)] bg-transparent"}`}
        aria-hidden="true"
      />
      <strong>{title}</strong>
      <p className={`m-0 leading-[1.65] ${tw.muted}`}>{detail}</p>
    </button>
  );
}

function StepOneContent({
  substepIndex,
  draft,
  onDraftChange
}: {
  substepIndex: number;
  draft: StepOneDraft;
  onDraftChange: (patch: Partial<StepOneDraft>) => void;
}) {
  if (substepIndex === 0) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>Who is applying?</h2>
          <p className={tw.muted}>
            This first checkpoint anchors the rest of the setup. We need to know whether the paperwork is tied directly to you or to an existing entity.
          </p>
        </div>
        <div className={tw.setupChoiceGrid}>
          <EntityChoiceCard
            selected={draft.isEntityApplication === false}
            title="I am applying as myself"
            detail="Use this when the business is tied directly to your personal legal identity."
            onClick={() => onDraftChange({ isEntityApplication: false })}
          />
          <EntityChoiceCard
            selected={draft.isEntityApplication === true}
            title="I am applying as an entity"
            detail="Use this when the filing runs through a separate legal business entity."
            onClick={() => onDraftChange({ isEntityApplication: true })}
          />
        </div>
      </div>
    );
  }

  if (substepIndex === 1) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>Confirm your legal name</h2>
          <p className={tw.muted}>
            Enter the full legal name for the person or signer tied to this setup. We use this for filings and the saved setup session.
          </p>
        </div>
        <div className={tw.setupFormGrid}>
          <label className={tw.setupField}>
            <span>First name</span>
            <input
              type="text"
              value={draft.legalFirstName}
              onChange={(event) => onDraftChange({ legalFirstName: event.target.value })}
              placeholder="John"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className={tw.setupField}>
            <span>Middle name <span className={tw.muted}>(optional)</span></span>
            <input
              type="text"
              value={draft.legalMiddleName}
              onChange={(event) => onDraftChange({ legalMiddleName: event.target.value })}
              placeholder="Michael"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className={tw.setupField}>
            <span>Last name</span>
            <input
              type="text"
              value={draft.legalLastName}
              onChange={(event) => onDraftChange({ legalLastName: event.target.value })}
              placeholder="Doe"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className={tw.setupField}>
            <span>Suffix <span className={tw.muted}>(optional)</span></span>
            <input
              type="text"
              value={draft.legalSuffix}
              onChange={(event) => onDraftChange({ legalSuffix: event.target.value })}
              placeholder="Jr., III"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
        </div>
      </div>
    );
  }

  return null;
}

function StepTwoContent({
  substepIndex,
  isEntityApplication,
  draft,
  onDraftChange
}: {
  substepIndex: number;
  isEntityApplication: boolean | null;
  draft: StepTwoDraft;
  onDraftChange: (patch: Partial<StepTwoDraft>) => void;
}) {
  if (isEntityApplication === false) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>This step is skipped</h2>
          <p className={tw.muted}>
            Because you selected individual, you do not need to complete the DBA / FBN step right now. We will move you straight to the next step.
          </p>
        </div>
        <div className={tw.setupInfoPanel}>
          <strong>What happens next</strong>
          <ul className={tw.setupBulletListSimple}>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Step 2 is marked not needed for the individual path.</li>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Next takes you to the city business license step.</li>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Your legal name and applicant choice stay saved in the setup session.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (substepIndex === 0) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>Do you need a DBA / FBN filing?</h2>
          <p className={tw.muted}>
            If the business will operate under a name different from the legal entity name, you will need to file a DBA (doing business as) or FBN (fictitious business name).
          </p>
        </div>
        <div className={tw.setupChoiceGrid}>
          <EntityChoiceCard
            selected={draft.needsDba === true}
            title="Yes, I need a DBA / FBN"
            detail="The public-facing business name differs from the legal entity name."
            onClick={() => onDraftChange({ needsDba: true })}
          />
          <EntityChoiceCard
            selected={draft.needsDba === false}
            title="No, I will use the legal name"
            detail="The business will operate publicly under its exact legal name."
            onClick={() => onDraftChange({ needsDba: false })}
          />
        </div>
      </div>
    );
  }

  if (substepIndex === 1) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>Business name & county</h2>
          <p className={tw.muted}>
            Capture the exact DBA name and the county where the filing will be made.
          </p>
        </div>
        <div className={tw.setupFormGrid}>
          <label className={tw.setupField}>
            <span>DBA / FBN name</span>
            <input
              type="text"
              value={draft.dbaName}
              onChange={(event) => onDraftChange({ dbaName: event.target.value })}
              placeholder="Doe Consulting"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className={tw.setupField}>
            <span>Filing county</span>
            <input
              type="text"
              value={draft.dbaCounty}
              onChange={(event) => onDraftChange({ dbaCounty: event.target.value })}
              placeholder="Orange County"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
        </div>
      </div>
    );
  }

  if (substepIndex === 2) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>Publish in a newspaper</h2>
          <p className={tw.muted}>
            Most California counties require publishing the DBA/FBN in a newspaper of general circulation before the filing is considered final.
          </p>
        </div>
        <div className={tw.setupInfoPanel}>
          <strong>California publication requirement</strong>
          <ul className={tw.setupBulletListSimple}>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Publish the filing once a week for 4 consecutive weeks in a newspaper of general circulation in the filing county.</li>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Publication generally must start within 30 days of filing the DBA/FBN with the county clerk.</li>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">After the last publication, you must file a Proof of Publication with the county clerk within 30 days — for example, Orange County (including Irvine) requires this before the filing is complete.</li>
            <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Requirements and approved newspapers vary by county, so confirm with your county clerk's office.</li>
          </ul>
        </div>
        <div className={tw.setupFormGrid}>
          <label className={tw.setupField}>
            <span>Newspaper used <span className={tw.muted}>(optional until scheduled)</span></span>
            <input
              type="text"
              value={draft.dbaNewspaperName}
              onChange={(event) => onDraftChange({ dbaNewspaperName: event.target.value })}
              placeholder="Orange County Register"
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className="grid items-center gap-2 self-end">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={draft.dbaPublicationFiled}
                onChange={(event) => onDraftChange({ dbaPublicationFiled: event.target.checked })}
                className="h-5 w-5 accent-[var(--accent)]"
              />
              Proof of publication filed with the county clerk
            </span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className={tw.setupStage}>
      <div>
        <h2>Lock the naming plan</h2>
        <p className={tw.muted}>
          Confirm the DBA / FBN details below so later setup steps use the same name everywhere.
        </p>
      </div>
      <div className={tw.setupReviewGrid}>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>Naming plan</span>
          <strong>{draft.dbaName.trim() || "No DBA name entered yet"}</strong>
          <p className={tw.muted}>{draft.dbaCounty.trim() || "No filing county entered yet"}</p>
        </article>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>Publication</span>
          <strong>{draft.dbaPublicationFiled ? "Proof of publication filed" : "Not yet filed"}</strong>
          <p className={tw.muted}>{draft.dbaNewspaperName.trim() || "No newspaper recorded yet"}</p>
        </article>
      </div>
    </div>
  );
}

function GenericStepContent({
  step,
  substepIndex
}: {
  step: SetupStep;
  substepIndex: number;
}) {
  if (substepIndex === 0) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>{step.substeps[0]?.label ?? step.title}</h2>
          <p className={tw.muted}>{step.substeps[0]?.detail ?? step.description}</p>
        </div>
        <div className={tw.setupSummaryGrid}>
          <article className={`${tw.surfaceInset} ${tw.stack}`}>
            <span className={tw.kicker}>Why this matters</span>
            <strong>{step.title}</strong>
            <p className={tw.muted}>{step.description}</p>
          </article>
          <article className={`${tw.surfaceInset} ${tw.stack}`}>
            <span className={tw.kicker}>What it unlocks</span>
            <strong>Cleaner next steps</strong>
            <p className={tw.muted}>Finishing this step keeps the later filings, documents, and launch work from drifting out of sync.</p>
          </article>
        </div>
      </div>
    );
  }

  if (substepIndex === 1) {
    return (
      <div className={tw.setupStage}>
        <div>
          <h2>{step.substeps[1]?.label ?? "Prepare inputs"}</h2>
          <p className={tw.muted}>{step.substeps[1]?.detail ?? "Gather what you need before moving forward."}</p>
        </div>
        <div className={tw.setupInfoPanel}>
          <strong>Prepare these inputs</strong>
          <ul className={tw.setupBulletListSimple}>
            {getStepPreparation(step).map((item) => (
              <li key={item} className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={tw.setupStage}>
      <div>
        <h2>{step.substeps[2]?.label ?? "Confirm step"}</h2>
        <p className={tw.muted}>{step.substeps[2]?.detail ?? "Confirm this step is ready to be marked complete."}</p>
      </div>
      <div className={tw.setupInfoPanel}>
        <strong>Expected outcome</strong>
        <ul className={tw.setupBulletListSimple}>
          {getStepOutputs(step).map((item) => (
            <li key={item} className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FinalReviewContent({
  config,
  session
}: {
  config: SetupConfig;
  session: SetupSession;
}) {
  const fullName = [
    session?.legalFirstName,
    session?.legalMiddleName,
    session?.legalLastName
  ]
    .filter(Boolean)
    .join(" ");
  const nameWithSuffix = session?.legalSuffix ? `${fullName}, ${session.legalSuffix}` : fullName;

  return (
    <div className={tw.setupStage}>
      <div>
        <h2>Final review</h2>
        <p className={tw.muted}>
          This is the full setup pass before the track is marked complete. The main step stays synced to the dashboard, while this page gives you the smaller checkpoint view.
        </p>
      </div>
      <div className={tw.setupReviewGrid}>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>Applicant context</span>
          <strong>{session?.isEntityApplication ? "Entity filing" : "Individual filing"}</strong>
          <p className={tw.muted}>{nameWithSuffix || "No personal legal name recorded."}</p>
        </article>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>DBA / FBN</span>
          <strong>
            {session?.needsDba === false
              ? "Not needed"
              : session?.dbaName || "No DBA name recorded"}
          </strong>
          <p className={tw.muted}>
            {session?.needsDba === false
              ? "Operating under the legal name."
              : session?.dbaCounty
                ? `${session.dbaCounty}${session?.dbaPublicationFiled ? " · Proof of publication filed" : " · Publication pending"}`
                : "Filing details not recorded yet."}
          </p>
        </article>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>Step coverage</span>
          <div className="grid gap-2.5">
            {config.steps.map((step) => {
              const status = session?.stepStatuses[step.stepNumber - 1] ?? "not_started";
              return (
                <div key={step.stepNumber} className="grid items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_72%,transparent)] px-[14px] py-3 md:grid-cols-[88px_minmax(0,1fr)_auto]">
                  <span className="text-[0.8rem] uppercase tracking-[0.12em] text-[var(--muted)]">Step {step.stepNumber}</span>
                  <strong>{step.title}</strong>
                  <em
                    className={`rounded-full px-2.5 py-2 text-[0.8rem] font-bold not-italic ${
                      getStatusTone(status) === "complete"
                        ? "bg-[color-mix(in_srgb,var(--success)_16%,transparent)] text-[var(--success)]"
                        : getStatusTone(status) === "active"
                          ? "bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--text)]"
                          : "bg-[color-mix(in_srgb,var(--border)_70%,transparent)] text-[var(--muted)]"
                    }`}
                  >
                    {getStatusLabel(status)}
                  </em>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
}

export function SetupWizard({
  businessType,
  initialUser
}: {
  businessType: string;
  initialUser?: CurrentUser | null;
}) {
  const config = getSetupConfig(businessType);
  const session = useQuery(convexApi.getSetupSession, { businessType }) ?? null;
  const startSetup = useMutation(convexApi.startSetup);
  const saveSetupStep = useMutation(convexApi.saveSetupStep);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStep, setLocalStep] = useState<number | null>(null);
  const [localStepStatuses, setLocalStepStatuses] = useState<string[] | null>(null);
  const [localSubsteps, setLocalSubsteps] = useState<Record<number, number>>({});
  const [stepOneDraft, setStepOneDraft] = useState<StepOneDraft>({
    isEntityApplication: null,
    legalFirstName: "",
    legalMiddleName: "",
    legalLastName: "",
    legalSuffix: ""
  });
  const [stepTwoDraft, setStepTwoDraft] = useState<StepTwoDraft>({
    needsDba: null,
    dbaName: "",
    dbaCounty: "",
    dbaNewspaperName: "",
    dbaPublicationFiled: false
  });

  useEffect(() => {
    setStepOneDraft({
      isEntityApplication: session?.isEntityApplication ?? null,
      legalFirstName: session?.legalFirstName ?? "",
      legalMiddleName: session?.legalMiddleName ?? "",
      legalLastName: session?.legalLastName ?? "",
      legalSuffix: session?.legalSuffix ?? ""
    });
  }, [
    session?.isEntityApplication,
    session?.legalFirstName,
    session?.legalMiddleName,
    session?.legalLastName,
    session?.legalSuffix
  ]);

  useEffect(() => {
    setStepTwoDraft({
      needsDba: session?.needsDba ?? null,
      dbaName: session?.dbaName ?? "",
      dbaCounty: session?.dbaCounty ?? "",
      dbaNewspaperName: session?.dbaNewspaperName ?? "",
      dbaPublicationFiled: session?.dbaPublicationFiled ?? false
    });
  }, [
    session?.needsDba,
    session?.dbaName,
    session?.dbaCounty,
    session?.dbaNewspaperName,
    session?.dbaPublicationFiled
  ]);

  useEffect(() => {
    if (session?.currentStep) {
      setLocalStep((current) => current ?? getEffectiveCurrentStep(session.stepStatuses, session.currentStep));
    }
  }, [session?.currentStep, session?.stepStatuses]);

  useEffect(() => {
    if (config && session?.stepStatuses) {
      setLocalStepStatuses((current) =>
        current ?? normalizeStepStatuses(config, session.stepStatuses, session.currentStep)
      );
    }
  }, [config, session?.currentStep, session?.stepStatuses]);

  if (!config) {
    return (
      <DashboardLayout
        title="Setup wizard"
        description="This business type does not have a setup wizard yet."
        initialUser={initialUser}
        showHeader={false}
      >
        <p>Unknown business type: {businessType}</p>
      </DashboardLayout>
    );
  }

  const sessionCurrentStep = session
    ? getEffectiveCurrentStep(session.stepStatuses, session.currentStep)
    : 0;
  const currentStep = localStep ?? sessionCurrentStep;
  const currentStepConfig = currentStep > 0 ? config.steps[currentStep - 1] : null;
  const stepStatuses =
    localStepStatuses ??
    normalizeStepStatuses(config, session?.stepStatuses, currentStep);
  const activeSubstepIndex = currentStepConfig
    ? localSubsteps[currentStep] ?? getDefaultSubstepIndex(currentStepConfig, session)
    : 0;
  const visibleSubsteps = useMemo(() => {
    if (!currentStepConfig) return [];
    return currentStepConfig.substeps;
  }, [currentStepConfig]);
  const currentSubstep = visibleSubsteps[activeSubstepIndex] ?? null;
  const completedSteps = stepStatuses.filter((status) => status === "complete" || status === "not_needed").length;
  const progressPercent = Math.round((completedSteps / config.totalSteps) * 100);
  const showCheckpointTabs =
    currentStepConfig?.stepNumber === 1 ||
    (currentStepConfig?.stepNumber === 2 && stepOneDraft.isEntityApplication !== false);

  const updateSubstep = async (stepNumber: number, substepIndex: number) => {
    setLocalSubsteps((current) => ({
      ...current,
      [stepNumber]: substepIndex
    }));

    try {
      await persistCurrentStep(stepNumber, stepStatuses);
    } catch (cause) {
      console.error("Failed to save substep progress", cause);
    }
  };

  const applyLocalProgress = (targetStep: number, nextStatuses: string[]) => {
    setLocalStep(targetStep);
    setLocalStepStatuses(nextStatuses);
  };

  useEffect(() => {
    if (!currentStepConfig || visibleSubsteps.length === 0) return;
    if (activeSubstepIndex >= visibleSubsteps.length) {
      updateSubstep(currentStepConfig.stepNumber, Math.max(visibleSubsteps.length - 1, 0));
    }
  }, [activeSubstepIndex, currentStepConfig, visibleSubsteps.length]);

  const persistCurrentStep = async (targetStep: number, nextStatuses: string[], isCompleted?: boolean) => {
    await saveSetupStep({
      businessType,
      currentStep: targetStep,
      stepStatuses: nextStatuses,
      isEntityApplication: stepOneDraft.isEntityApplication ?? undefined,
      legalFirstName: stepOneDraft.legalFirstName.trim() || undefined,
      legalMiddleName: stepOneDraft.legalMiddleName.trim() || undefined,
      legalLastName: stepOneDraft.legalLastName.trim() || undefined,
      legalSuffix: stepOneDraft.legalSuffix.trim() || undefined,
      needsDba: stepTwoDraft.needsDba ?? undefined,
      dbaName: stepTwoDraft.dbaName.trim() || undefined,
      dbaCounty: stepTwoDraft.dbaCounty.trim() || undefined,
      dbaNewspaperName: stepTwoDraft.dbaNewspaperName.trim() || undefined,
      dbaPublicationFiled: stepTwoDraft.dbaPublicationFiled,
      isCompleted
    });
    setLocalStep(targetStep);
  };

  const handleStart = async () => {
    setSaving(true);
    setError(null);
    await updateSubstep(1, 0);
    setLocalStep(1);

    try {
      await startSetup({ businessType });
    } catch (cause) {
      console.error("Failed to persist setup start", cause);
      setError("Setup opened, but progress could not save yet. Check that Convex is running, then keep going or try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = async (stepNumber: number) => {
    if (!config.steps[stepNumber - 1]) return;
    const targetStatus = stepStatuses[stepNumber - 1] ?? "not_started";
    const canOpenStep = stepNumber <= currentStep || targetStatus === "complete" || targetStatus === "not_needed";
    if (!canOpenStep) return;

    setSaving(true);
    setError(null);

    try {
      const nextStatuses = [...stepStatuses];
      if (nextStatuses[stepNumber - 1] === "not_started") {
        nextStatuses[stepNumber - 1] = "in_progress";
      }
      applyLocalProgress(stepNumber, nextStatuses);
      await updateSubstep(stepNumber, getDefaultSubstepIndex(config.steps[stepNumber - 1], session));
      await persistCurrentStep(stepNumber, nextStatuses);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to change steps");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = async () => {
    if (!currentStepConfig) return;

    if (activeSubstepIndex > 0) {
      await updateSubstep(currentStepConfig.stepNumber, activeSubstepIndex - 1);
      return;
    }

    if (currentStep <= 1) return;

    const previousStep = currentStep - 1;
    const previousConfig = config.steps[previousStep - 1];
    setSaving(true);
    setError(null);

    try {
      applyLocalProgress(previousStep, [...stepStatuses]);
      await updateSubstep(previousStep, Math.max(previousConfig.substeps.length - 1, 0));
      await persistCurrentStep(previousStep, [...stepStatuses]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to go back");
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!currentStepConfig) return;

    if (currentStepConfig.stepNumber === 1 && activeSubstepIndex === 0) {
      if (stepOneDraft.isEntityApplication === null) {
        setError("Choose whether you are applying as yourself or as an entity before moving on.");
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const nextStatuses = [...stepStatuses];
        nextStatuses[0] = "in_progress";
        applyLocalProgress(1, nextStatuses);
        await updateSubstep(1, 1);
        await persistCurrentStep(1, nextStatuses);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to save applicant choice");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (currentStepConfig.stepNumber === 1 && activeSubstepIndex === 1) {
      if (!stepOneDraft.legalFirstName.trim() || !stepOneDraft.legalLastName.trim()) {
        setError("First name and last name are required before you finish step 1.");
        return;
      }
    }

    if (currentStepConfig.stepNumber === 2 && stepOneDraft.isEntityApplication === false) {
      setSaving(true);
      setError(null);

      try {
        const nextStatuses = [...stepStatuses];
        nextStatuses[1] = "not_needed";
        const nextStep = 3;
        if (nextStatuses[nextStep - 1] !== "complete") {
          nextStatuses[nextStep - 1] = "in_progress";
        }
        applyLocalProgress(nextStep, nextStatuses);
        await updateSubstep(nextStep, 0);
        await persistCurrentStep(nextStep, nextStatuses);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to skip step");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (currentStepConfig.stepNumber === 2 && activeSubstepIndex === 0) {
      if (stepTwoDraft.needsDba === null) {
        setError("Choose whether you need a DBA or FBN filing before continuing.");
        return;
      }

      if (stepTwoDraft.needsDba === false) {
        setSaving(true);
        setError(null);

        try {
          const nextStatuses = [...stepStatuses];
          nextStatuses[1] = "not_needed";
          const nextStep = 3;
          if (nextStatuses[nextStep - 1] !== "complete") {
            nextStatuses[nextStep - 1] = "in_progress";
          }
          applyLocalProgress(nextStep, nextStatuses);
          await updateSubstep(nextStep, 0);
          await persistCurrentStep(nextStep, nextStatuses);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : "Failed to skip step");
        } finally {
          setSaving(false);
        }
        return;
      }
    }

    if (currentStepConfig.stepNumber === 2 && activeSubstepIndex === 1) {
      if (!stepTwoDraft.dbaName.trim() || !stepTwoDraft.dbaCounty.trim()) {
        setError("Add the DBA name and filing county before continuing.");
        return;
      }
    }

    if (activeSubstepIndex < visibleSubsteps.length - 1) {
      await updateSubstep(currentStepConfig.stepNumber, activeSubstepIndex + 1);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const nextStatuses = [...stepStatuses];
      nextStatuses[currentStepConfig.stepNumber - 1] = "complete";

      if (currentStepConfig.stepNumber < config.totalSteps) {
        if (nextStatuses[currentStepConfig.stepNumber] !== "complete") {
          nextStatuses[currentStepConfig.stepNumber] = "in_progress";
        }

        const nextStep = currentStepConfig.stepNumber + 1;
        applyLocalProgress(nextStep, nextStatuses);
        await updateSubstep(nextStep, 0);
        await persistCurrentStep(nextStep, nextStatuses);
      } else {
        await persistCurrentStep(currentStepConfig.stepNumber, nextStatuses, true);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  const renderMainStage = () => {
    if (!currentStepConfig) {
      return (
        <SetupKickoff
          config={config}
          businessType={businessType}
          saving={saving}
          error={error}
          onStart={handleStart}
        />
      );
    }

    const isFinalStep = currentStepConfig.stepNumber === config.totalSteps;

    return (
      <div className={tw.setupWorkspace}>
        <section className={tw.setupWorkbench}>
          <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
            <div className="max-w-[760px]">
              <div className={tw.kicker}>
                Step {currentStepConfig.stepNumber} of {config.totalSteps}
                {showCheckpointTabs && currentSubstep ? ` · ${currentStepConfig.stepNumber}.${activeSubstepIndex + 1}` : ""}
              </div>
              <h1 className="mt-2.5 font-sans text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.05em]">{currentStepConfig.title}</h1>
              <p className="mt-[14px] max-w-[760px] text-[1.05rem] leading-[1.7] text-[var(--muted)]">{currentStepConfig.description}</p>
            </div>
            <div className="min-w-[180px] rounded-[20px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_74%,transparent)] px-5 py-[18px] text-right">
              <span className="block text-[0.88rem] text-[var(--muted)]">{progressPercent}% complete</span>
              <strong className="mt-1.5 block text-[1.3rem]">{completedSteps} finished</strong>
            </div>
          </div>

          {showCheckpointTabs ? (
            <div className="grid gap-2.5 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]" role="tablist" aria-label="Current step checkpoints">
              {visibleSubsteps.map((substep, index) => (
                <button
                  key={substep.key}
                  type="button"
                  className={`grid gap-1 rounded-[18px] border px-4 py-[14px] text-left ${
                    index === activeSubstepIndex
                      ? "border-[color-mix(in_srgb,var(--accent)_42%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_14%,var(--panel))]"
                      : "border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_72%,transparent)]"
                  }`}
                  onClick={() => updateSubstep(currentStepConfig.stepNumber, index)}
                >
                  <span className="text-[0.78rem] font-bold tracking-[0.12em] text-[var(--muted)]">{currentStepConfig.stepNumber}.{index + 1}</span>
                  <strong className="text-[0.95rem]">{substep.label}</strong>
                </button>
              ))}
            </div>
          ) : null}

          <div className={tw.setupContentGrid}>
            <div className={tw.setupPrimaryPanel}>
              {error ? <div className={tw.setupError}>{error}</div> : null}
              {isFinalStep ? (
                <FinalReviewContent config={config} session={session} />
              ) : currentStepConfig.stepNumber === 1 ? (
                <StepOneContent
                  substepIndex={activeSubstepIndex}
                  draft={stepOneDraft}
                  onDraftChange={(patch) =>
                    setStepOneDraft((current) => ({
                      ...current,
                      ...patch
                    }))
                  }
                />
              ) : currentStepConfig.stepNumber === 2 ? (
                <StepTwoContent
                  substepIndex={activeSubstepIndex}
                  isEntityApplication={stepOneDraft.isEntityApplication}
                  draft={stepTwoDraft}
                  onDraftChange={(patch) =>
                    setStepTwoDraft((current) => ({
                      ...current,
                      ...patch
                    }))
                  }
                />
              ) : (
                <GenericStepContent step={currentStepConfig} substepIndex={activeSubstepIndex} />
              )}
            </div>
          </div>

          <div className={tw.setupActionBar}>
            <button
              type="button"
              className={tw.setupButtonSecondary}
              disabled={currentStepConfig.stepNumber === 1 && activeSubstepIndex === 0}
              onClick={handleBack}
            >
              Back
            </button>
            <div className={tw.setupActionMeta}>
              <strong>
                {currentSubstep?.label ?? currentStepConfig.title}
              </strong>
              <span className={tw.muted}>
                {isFinalStep
                  ? "Finish the full setup track."
                  : currentStepConfig.stepNumber === 2 && stepOneDraft.isEntityApplication === false
                    ? "This step is skipped for the individual path."
                    : activeSubstepIndex === visibleSubsteps.length - 1
                    ? "Mark this step complete and move forward."
                    : "Move to the next checkpoint inside this step."}
              </span>
            </div>
            <button
              type="button"
              className={tw.setupButtonPrimary}
              onClick={handleNext}
            >
              {isFinalStep
                ? "Complete setup"
                : currentStepConfig.stepNumber === 2 && stepOneDraft.isEntityApplication === false
                  ? "Continue to Step 3"
                  : currentStepConfig.stepNumber === 1 && activeSubstepIndex === 0
                    ? "Next"
                    : activeSubstepIndex === visibleSubsteps.length - 1
                  ? "Finish step"
                  : "Next checkpoint"}
            </button>
          </div>
        </section>

        <SetupProgressRail
          config={config}
          session={session}
          currentStep={currentStep}
          stepStatuses={stepStatuses}
          activeSubstepIndex={activeSubstepIndex}
          onNavigate={handleNavigate}
        />
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Setup wizard"
      description="Follow the steps to set up your business."
      initialUser={initialUser}
      showHeader={false}
      showTopProgress={false}
    >
      <div className={tw.setupPageSpacing}>{renderMainStage()}</div>
    </DashboardLayout>
  );
}

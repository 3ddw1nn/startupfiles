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
  isCompleted: boolean;
} | null;

type StepOneDraft = {
  isEntityApplication: boolean | null;
  legalFirstName: string;
  legalMiddleName: string;
  legalLastName: string;
  legalSuffix: string;
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
  setupWorkbench: `${ui.surface} mt-2 grid gap-6 p-7`,
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
    "min-h-[52px] rounded-2xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_86%,white),var(--accent))] px-[22px] font-bold tracking-[-0.01em] text-white shadow-[0_16px_36px_color-mix(in_srgb,var(--accent)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none",
  setupButtonSecondary:
    "min-h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-[22px] font-bold tracking-[-0.01em] text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-55",
  setupPageSpacing: "",
  setupContentGrid: "grid items-start gap-[18px] xl:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.82fr)]",
  setupPrimaryPanel: "grid gap-[18px]",
  setupSupportPanel: "grid gap-[18px]",
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
    return hasName ? 2 : 1;
  }
  return 2;
}

function getCurrentStepPercent(step: SetupStep, session: SetupSession, substepIndex: number) {
  if (!session) return 0;
  const status = session.stepStatuses[step.stepNumber - 1] ?? "not_started";
  if (status === "complete" || status === "not_needed") return 100;
  const total = Math.max(step.substeps.length, 1);
  return Math.round((substepIndex / total) * 100);
}

function SetupProgressRail({
  config,
  session,
  currentStep,
  activeSubstepIndex,
  onNavigate
}: {
  config: SetupConfig;
  session: SetupSession;
  currentStep: number;
  activeSubstepIndex: number;
  onNavigate: (stepNumber: number) => void;
}) {
  const completedSteps = session?.stepStatuses.filter((status) => status === "complete").length ?? 0;
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
            const status = session?.stepStatuses[step.stepNumber - 1] ?? "not_started";
            const tone = getStatusTone(status);
            const isCurrent = currentStep === step.stepNumber;
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
                  className={`grid h-12 w-12 place-items-center rounded-full border border-[color-mix(in_srgb,var(--border)_88%,transparent)] text-[0.95rem] font-extrabold ${
                    tone === "complete"
                      ? "text-[var(--success)]"
                      : tone === "active"
                        ? "text-[var(--text)]"
                        : "text-[var(--muted)]"
                  }`}
                  style={{ ["--progress" as string]: `${progress}%` }}
                  aria-hidden="true"
                >
                  {status === "complete" ? "✓" : step.stepNumber}
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
  saving,
  onDraftChange
}: {
  substepIndex: number;
  draft: StepOneDraft;
  saving: boolean;
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
    if (draft.isEntityApplication) {
      return (
        <div className={tw.setupStage}>
          <div>
            <h2>Entity filing path confirmed</h2>
            <p className={tw.muted}>
              Because you are applying as an entity, this step does not need a personal legal-name entry. We will carry that context into the next checkpoint and keep moving.
            </p>
          </div>
          <div className={tw.setupInfoPanel}>
            <strong>What changes now</strong>
            <ul className={tw.setupBulletListSimple}>
              <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">The setup will keep the filing context tied to a business entity.</li>
              <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">Later naming and document steps can reference the entity path directly.</li>
              <li className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">You can still come back and change this before the full setup is complete.</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className={tw.setupStage}>
        <div>
          <h2>Confirm your legal name</h2>
          <p className={tw.muted}>
            Since the setup is tied to you directly, the name here should match the identity used on filings, registrations, and supporting paperwork.
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
              disabled={saving}
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className={tw.setupField}>
            <span>Middle name</span>
            <input
              type="text"
              value={draft.legalMiddleName}
              onChange={(event) => onDraftChange({ legalMiddleName: event.target.value })}
              placeholder="Michael"
              disabled={saving}
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
              disabled={saving}
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
          <label className={tw.setupField}>
            <span>Suffix</span>
            <input
              type="text"
              value={draft.legalSuffix}
              onChange={(event) => onDraftChange({ legalSuffix: event.target.value })}
              placeholder="Jr., III"
              disabled={saving}
              className="h-[52px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_78%,var(--panel))] px-4 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
            />
          </label>
        </div>
      </div>
    );
  }

  const fullName = [
    draft.legalFirstName.trim(),
    draft.legalMiddleName.trim(),
    draft.legalLastName.trim()
  ]
    .filter(Boolean)
    .join(" ");
  const nameWithSuffix = draft.legalSuffix.trim() ? `${fullName}, ${draft.legalSuffix.trim()}` : fullName;

  return (
    <div className={tw.setupStage}>
      <div>
        <h2>Review step 1</h2>
        <p className={tw.muted}>
          This checkpoint closes out the applicant identity step. Review it before the setup moves into business naming and filing work.
        </p>
      </div>
      <div className={tw.setupSummaryGrid}>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>Applicant type</span>
          <strong>{draft.isEntityApplication ? "Business entity" : "Individual"}</strong>
        </article>
        <article className={`${tw.surfaceInset} ${tw.stack}`}>
          <span className={tw.kicker}>Legal name</span>
          <strong>{draft.isEntityApplication ? "Not required for this checkpoint" : nameWithSuffix || "Missing"}</strong>
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
  const [localSubsteps, setLocalSubsteps] = useState<Record<number, number>>({});
  const [stepOneDraft, setStepOneDraft] = useState<StepOneDraft>({
    isEntityApplication: null,
    legalFirstName: "",
    legalMiddleName: "",
    legalLastName: "",
    legalSuffix: ""
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
    if (session?.currentStep) {
      setLocalStep(session.currentStep);
    } else {
      setLocalStep(null);
    }
  }, [session?.currentStep]);

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

  const currentStep = localStep ?? session?.currentStep ?? 0;
  const currentStepConfig = currentStep > 0 ? config.steps[currentStep - 1] : null;
  const activeSubstepIndex = currentStepConfig
    ? localSubsteps[currentStep] ?? getDefaultSubstepIndex(currentStepConfig, session)
    : 0;
  const currentSubstep = currentStepConfig?.substeps[activeSubstepIndex] ?? null;
  const completedSteps = session?.stepStatuses.filter((status) => status === "complete").length ?? 0;
  const progressPercent = Math.round((completedSteps / config.totalSteps) * 100);

  const canProceed = useMemo(() => {
    if (!currentStepConfig) return false;
    if (currentStepConfig.stepNumber !== 1) return true;
    if (activeSubstepIndex === 0) {
      return stepOneDraft.isEntityApplication !== null;
    }
    if (activeSubstepIndex === 1 && stepOneDraft.isEntityApplication === false) {
      return Boolean(stepOneDraft.legalFirstName.trim() && stepOneDraft.legalLastName.trim());
    }
    return true;
  }, [activeSubstepIndex, currentStepConfig, stepOneDraft]);

  const updateSubstep = (stepNumber: number, substepIndex: number) => {
    setLocalSubsteps((current) => ({
      ...current,
      [stepNumber]: substepIndex
    }));
  };

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
      isCompleted
    });
    setLocalStep(targetStep);
  };

  const handleStart = async () => {
    setSaving(true);
    setError(null);
    try {
      await startSetup({ businessType });
      updateSubstep(1, 0);
      setLocalStep(1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to start setup");
    } finally {
      setSaving(false);
    }
  };

  const handleNavigate = async (stepNumber: number) => {
    if (!session || !config.steps[stepNumber - 1]) return;
    setSaving(true);
    setError(null);

    try {
      const nextStatuses = [...session.stepStatuses];
      if (nextStatuses[stepNumber - 1] === "not_started") {
        nextStatuses[stepNumber - 1] = "in_progress";
      }
      await persistCurrentStep(stepNumber, nextStatuses);
      updateSubstep(stepNumber, getDefaultSubstepIndex(config.steps[stepNumber - 1], session));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to change steps");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = async () => {
    if (!currentStepConfig) return;

    if (activeSubstepIndex > 0) {
      updateSubstep(currentStepConfig.stepNumber, activeSubstepIndex - 1);
      return;
    }

    if (!session || currentStep <= 1) return;

    const previousStep = currentStep - 1;
    const previousConfig = config.steps[previousStep - 1];
    setSaving(true);
    setError(null);

    try {
      await persistCurrentStep(previousStep, [...session.stepStatuses]);
      updateSubstep(previousStep, Math.max(previousConfig.substeps.length - 1, 0));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to go back");
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!currentStepConfig || !session) return;

    if (activeSubstepIndex < currentStepConfig.substeps.length - 1) {
      if (currentStepConfig.stepNumber === 1 && activeSubstepIndex === 0 && stepOneDraft.isEntityApplication === true) {
        updateSubstep(currentStepConfig.stepNumber, 1);
        return;
      }

      updateSubstep(currentStepConfig.stepNumber, activeSubstepIndex + 1);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const nextStatuses = [...session.stepStatuses];
      nextStatuses[currentStepConfig.stepNumber - 1] = "complete";

      if (currentStepConfig.stepNumber < config.totalSteps) {
        if (nextStatuses[currentStepConfig.stepNumber] !== "complete") {
          nextStatuses[currentStepConfig.stepNumber] = "in_progress";
        }

        const nextStep = currentStepConfig.stepNumber + 1;
        await persistCurrentStep(nextStep, nextStatuses);
        updateSubstep(nextStep, 0);
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
    if (!session || !currentStepConfig) {
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
                {currentSubstep ? ` · ${activeSubstepIndex + 1}.${currentStepConfig.substeps.length}` : ""}
              </div>
              <h1 className="mt-2.5 font-sans text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] tracking-[-0.05em]">{currentStepConfig.title}</h1>
              <p className="mt-[14px] max-w-[760px] text-[1.05rem] leading-[1.7] text-[var(--muted)]">{currentStepConfig.description}</p>
            </div>
            <div className="min-w-[180px] rounded-[20px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_74%,transparent)] px-5 py-[18px] text-right">
              <span className="block text-[0.88rem] text-[var(--muted)]">{progressPercent}% complete</span>
              <strong className="mt-1.5 block text-[1.3rem]">{completedSteps} finished</strong>
            </div>
          </div>

          <div className="grid gap-2.5 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]" role="tablist" aria-label="Current step checkpoints">
            {currentStepConfig.substeps.map((substep, index) => (
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

          <div className={tw.setupContentGrid}>
            <div className={tw.setupPrimaryPanel}>
              {error ? <div className={tw.setupError}>{error}</div> : null}
              {isFinalStep ? (
                <FinalReviewContent config={config} session={session} />
              ) : currentStepConfig.stepNumber === 1 ? (
                <StepOneContent
                  substepIndex={activeSubstepIndex}
                  draft={stepOneDraft}
                  saving={saving}
                  onDraftChange={(patch) =>
                    setStepOneDraft((current) => ({
                      ...current,
                      ...patch
                    }))
                  }
                />
              ) : (
                <GenericStepContent step={currentStepConfig} substepIndex={activeSubstepIndex} />
              )}
            </div>

            <div className={tw.setupSupportPanel}>
              <article className={`${tw.surfaceInset} ${tw.stack}`}>
                <div className={tw.kicker}>Current checkpoint</div>
                <strong>{currentSubstep?.label ?? "Checkpoint"}</strong>
                <p className={tw.muted}>{currentSubstep?.detail ?? currentStepConfig.description}</p>
              </article>
              <article className={`${tw.surfaceInset} ${tw.stack}`}>
                <div className={tw.kicker}>What to prepare</div>
                <ul className={tw.setupBulletListSimple}>
                  {getStepPreparation(currentStepConfig).map((item) => (
                    <li key={item} className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">{item}</li>
                  ))}
                </ul>
              </article>
              <article className={`${tw.surfaceInset} ${tw.stack}`}>
                <div className={tw.kicker}>What comes next</div>
                <ul className={tw.setupBulletListSimple}>
                  {getStepOutputs(currentStepConfig).map((item) => (
                    <li key={item} className="relative pl-[18px] leading-[1.6] text-[var(--muted)] before:absolute before:left-0 before:top-[0.65rem] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--accent)]">{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <div className={tw.setupActionBar}>
            <button
              type="button"
              className={tw.setupButtonSecondary}
              disabled={saving || (currentStepConfig.stepNumber === 1 && activeSubstepIndex === 0)}
              onClick={handleBack}
            >
              Back
            </button>
            <div className={tw.setupActionMeta}>
              <strong>
                {currentSubstep?.label ?? currentStepConfig.title}
              </strong>
              <span className={tw.muted}>
                {isFinalStep && activeSubstepIndex === currentStepConfig.substeps.length - 1
                  ? "Finish the full setup track."
                  : activeSubstepIndex === currentStepConfig.substeps.length - 1
                    ? "Mark this step complete and move forward."
                    : "Move to the next checkpoint inside this step."}
              </span>
            </div>
            <button
              type="button"
              className={tw.setupButtonPrimary}
              disabled={saving || !canProceed}
              onClick={handleNext}
            >
              {isFinalStep && activeSubstepIndex === currentStepConfig.substeps.length - 1
                ? "Complete setup"
                : activeSubstepIndex === currentStepConfig.substeps.length - 1
                  ? "Finish step"
                  : "Next checkpoint"}
            </button>
          </div>
        </section>

        <SetupProgressRail
          config={config}
          session={session}
          currentStep={currentStep}
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
    >
      <div className={tw.setupPageSpacing}>{renderMainStage()}</div>
    </DashboardLayout>
  );
}

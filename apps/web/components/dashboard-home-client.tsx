"use client";

import type { DashboardData, OnboardingInput, ProductLineInput, TaskStatus } from "@startupfiles/shared/domain";
import { useMutation, useQuery } from "convex/react";
import { useState, useTransition } from "react";
import { convexApi } from "../lib/convex-api";
import { DashboardLayout } from "./dashboard-layout";

function toDefaultInput(data: DashboardData): OnboardingInput {
  return {
    founderProfile: data.founderProfile,
    businessProfile: data.businessProfile,
    productLines: data.productLines.length > 0
      ? data.productLines
      : [
          {
            name: "MOMO",
            description: "Software product line.",
            type: "software",
            acceptsPayments: false,
            collectsUserData: false,
            hasAdvertiserMoney: false,
            hasRewardsOrPayouts: false,
            hasHardwareRisk: false,
            status: "not_started"
          }
        ]
  };
}

export function DashboardHomeClient() {
  const data = useQuery(convexApi.viewer, {});
  const saveOnboarding = useMutation(convexApi.saveOnboarding);
  const setTaskStatus = useMutation(convexApi.setTaskStatus as any);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (data === undefined) {
    return (
      <DashboardLayout
        title="Loading your founder workspace."
        description="Convex is loading the authenticated dashboard state."
      >
        <section className="surface pageSection">
          <p className="muted" style={{ margin: 0 }}>
            Pulling your workspace, tasks, and onboarding state from Convex.
          </p>
        </section>
      </DashboardLayout>
    );
  }

  if (data === null) {
    return (
      <DashboardLayout
        title="No workspace data was returned."
        description="This usually means the authenticated user has not been provisioned yet."
      >
        <section className="surface pageSection">
          <p className="muted" style={{ margin: 0 }}>
            Sign out and back in if the workspace seed callback did not finish cleanly.
          </p>
        </section>
      </DashboardLayout>
    );
  }

  const onSubmit = (formData: FormData) => {
    setMessage(null);
    setError(null);
    const productCount = Number(formData.get("productCount") ?? 2);
    const productLines: ProductLineInput[] = Array.from({ length: productCount }).map((_, index) => ({
      name: String(formData.get(`productName_${index}`) ?? "").trim(),
      description: String(formData.get(`productDescription_${index}`) ?? "").trim(),
      type: String(formData.get(`productType_${index}`) ?? "software") as ProductLineInput["type"],
      acceptsPayments: formData.get(`productAcceptsPayments_${index}`) === "on",
      collectsUserData: formData.get(`productCollectsUserData_${index}`) === "on",
      hasAdvertiserMoney: formData.get(`productAdvertiserMoney_${index}`) === "on",
      hasRewardsOrPayouts: formData.get(`productRewards_${index}`) === "on",
      hasHardwareRisk: formData.get(`productHardwareRisk_${index}`) === "on",
      status: "not_started"
    }));

    startTransition(async () => {
      try {
        await saveOnboarding({
          founderProfile: {
            legalName: String(formData.get("legalName") ?? "").trim(),
            state: String(formData.get("state") ?? "").trim(),
            city: String(formData.get("city") ?? "").trim(),
            county: String(formData.get("county") ?? "").trim(),
            operatesFromHome: formData.get("operatesFromHome") === "on",
            acceptsPayments: formData.get("acceptsPayments") === "on",
            usesSeparateBusinessName: formData.get("usesSeparateBusinessName") === "on",
            separateBusinessName: String(formData.get("separateBusinessName") ?? "").trim(),
            hasContractors: formData.get("hasContractors") === "on",
            hasCustomerContracts: formData.get("hasCustomerContracts") === "on",
            collectsUserData: formData.get("collectsUserData") === "on",
            sellsTangibleGoods: formData.get("sellsTangibleGoods") === "on",
            plansHardwareOrPreorders: formData.get("plansHardwareOrPreorders") === "on"
          },
          businessProfile: {
            legalOperatorName: String(formData.get("legalOperatorName") ?? "").trim(),
            plannedLlcName: String(formData.get("plannedLlcName") ?? "").trim(),
            cityBusinessLicenseCity: String(formData.get("cityBusinessLicenseCity") ?? "").trim(),
            cityBusinessLicenseStatus: String(
              formData.get("cityBusinessLicenseStatus") ?? "not_started"
            ) as OnboardingInput["businessProfile"]["cityBusinessLicenseStatus"],
            dbaStatus: String(formData.get("dbaStatus") ?? "not_needed") as OnboardingInput["businessProfile"]["dbaStatus"],
            stripeSetupStatus: String(
              formData.get("stripeSetupStatus") ?? "not_started"
            ) as OnboardingInput["businessProfile"]["stripeSetupStatus"],
            sellerPermitStatus: String(
              formData.get("sellerPermitStatus") ?? "not_started"
            ) as OnboardingInput["businessProfile"]["sellerPermitStatus"],
            domainName: String(formData.get("domainName") ?? "").trim(),
            domainOwnershipStatus: String(
              formData.get("domainOwnershipStatus") ?? "not_started"
            ) as OnboardingInput["businessProfile"]["domainOwnershipStatus"]
          },
          productLines: productLines.filter((product) => product.name.length > 0)
        });
        setMessage("Workspace saved. Your roadmap has been recalculated.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save onboarding.");
      }
    });
  };

  const setStatus = (taskId: string, status: TaskStatus) => {
    startTransition(async () => {
      try {
        await setTaskStatus({ taskId, status });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not update task.");
      }
    });
  };

  const defaults = toDefaultInput(data);

  return (
    <DashboardLayout
      title="Your StartupFiles workspace is now backed by Convex."
      description="Sign-up seeds the workspace, onboarding persists real founder and business state, and your roadmap updates from backend rules instead of placeholder copy."
    >
      <section className="gridThree">
        <article className="surface pageSection metric">
          <span className="kicker">Progress</span>
          <strong>{data.workspace.progressPercent}%</strong>
          <div className="muted">Calculated from the current roadmap task set.</div>
        </article>
        <article className="surface pageSection metric">
          <span className="kicker">Current phase</span>
          <strong>{data.workspace.currentPhase.replaceAll("_", " ")}</strong>
          <div className="muted">Derived from the saved founder and product risk profile.</div>
        </article>
        <article className="surface pageSection metric">
          <span className="kicker">Next step</span>
          <strong>{data.nextStep?.title ?? "No pending task"}</strong>
          <div className="muted">{data.nextStep?.description ?? "Everything currently looks settled."}</div>
        </article>
      </section>

      <section className="surface pageSection stack">
        <div className="kicker">Workspace Warnings</div>
        <ul className="list">
          {data.warnings.map((warning) => (
            <li key={warning}>
              <div>{warning}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface pageSection stack">
        <div className="kicker">Founder Intake</div>
        <p className="muted" style={{ margin: 0 }}>
          This form saves directly to Convex and immediately recalculates the roadmap tasks in the backend.
        </p>
        <form
          className="stack"
          action={onSubmit}
        >
          <div className="gridTwo">
            <label className="stack">
              <span>Legal name</span>
              <input name="legalName" defaultValue={defaults.founderProfile.legalName} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>Legal operator name</span>
              <input name="legalOperatorName" defaultValue={defaults.businessProfile.legalOperatorName} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>State</span>
              <input name="state" defaultValue={defaults.founderProfile.state} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>City</span>
              <input name="city" defaultValue={defaults.founderProfile.city} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>County</span>
              <input name="county" defaultValue={defaults.founderProfile.county} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>Planned LLC name</span>
              <input name="plannedLlcName" defaultValue={defaults.businessProfile.plannedLlcName} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>Business license city</span>
              <input name="cityBusinessLicenseCity" defaultValue={defaults.businessProfile.cityBusinessLicenseCity} className="card" style={{ padding: "14px 16px" }} />
            </label>
            <label className="stack">
              <span>Domain</span>
              <input name="domainName" defaultValue={defaults.businessProfile.domainName} className="card" style={{ padding: "14px 16px" }} placeholder="startupfiles.com" />
            </label>
            <label className="stack">
              <span>Business license status</span>
              <select name="cityBusinessLicenseStatus" defaultValue={defaults.businessProfile.cityBusinessLicenseStatus} className="card" style={{ padding: "14px 16px" }}>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <label className="stack">
              <span>DBA/FBN status</span>
              <select name="dbaStatus" defaultValue={defaults.businessProfile.dbaStatus} className="card" style={{ padding: "14px 16px" }}>
                <option value="not_needed">Not needed</option>
                <option value="considering">Considering</option>
                <option value="ready">Ready</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <label className="stack">
              <span>Stripe setup</span>
              <select name="stripeSetupStatus" defaultValue={defaults.businessProfile.stripeSetupStatus} className="card" style={{ padding: "14px 16px" }}>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <label className="stack">
              <span>Seller permit</span>
              <select name="sellerPermitStatus" defaultValue={defaults.businessProfile.sellerPermitStatus} className="card" style={{ padding: "14px 16px" }}>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <label className="stack">
              <span>Domain ownership</span>
              <select name="domainOwnershipStatus" defaultValue={defaults.businessProfile.domainOwnershipStatus} className="card" style={{ padding: "14px 16px" }}>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <label className="stack">
              <span>Separate business name</span>
              <input name="separateBusinessName" defaultValue={defaults.founderProfile.separateBusinessName} className="card" style={{ padding: "14px 16px" }} placeholder="Leave blank if none" />
            </label>
          </div>

          <div className="gridThree">
            {[
              ["operatesFromHome", "Operates from home", defaults.founderProfile.operatesFromHome],
              ["acceptsPayments", "Accepts payments", defaults.founderProfile.acceptsPayments],
              ["usesSeparateBusinessName", "Uses separate business name", defaults.founderProfile.usesSeparateBusinessName],
              ["hasContractors", "Has contractors", defaults.founderProfile.hasContractors],
              ["hasCustomerContracts", "Has customer contracts", defaults.founderProfile.hasCustomerContracts],
              ["collectsUserData", "Collects user data", defaults.founderProfile.collectsUserData],
              ["sellsTangibleGoods", "Sells tangible goods", defaults.founderProfile.sellsTangibleGoods],
              ["plansHardwareOrPreorders", "Plans hardware or preorders", defaults.founderProfile.plansHardwareOrPreorders]
            ].map(([name, label, checked]) => (
              <label key={name as string} className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input type="checkbox" name={name as string} defaultChecked={Boolean(checked)} />
                <span>{label as string}</span>
              </label>
            ))}
          </div>

          <input type="hidden" name="productCount" value={defaults.productLines.length} />
          <div className="stack">
            <div className="kicker">Product Lines</div>
            {defaults.productLines.map((product, index) => (
              <div key={`${product.name}-${index}`} className="card stack">
                <div className="gridTwo">
                  <label className="stack">
                    <span>Product name</span>
                    <input name={`productName_${index}`} defaultValue={product.name} className="card" style={{ padding: "14px 16px" }} />
                  </label>
                  <label className="stack">
                    <span>Type</span>
                    <select name={`productType_${index}`} defaultValue={product.type} className="card" style={{ padding: "14px 16px" }}>
                      <option value="software">Software</option>
                      <option value="browser_extension">Browser extension</option>
                      <option value="hardware">Hardware</option>
                      <option value="services">Services</option>
                      <option value="digital_product">Digital product</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>
                <label className="stack">
                  <span>Description</span>
                  <input name={`productDescription_${index}`} defaultValue={product.description} className="card" style={{ padding: "14px 16px" }} />
                </label>
                <div className="gridThree">
                  {[
                    [`productAcceptsPayments_${index}`, "Accepts payments", product.acceptsPayments],
                    [`productCollectsUserData_${index}`, "Collects user data", product.collectsUserData],
                    [`productAdvertiserMoney_${index}`, "Has advertiser money", product.hasAdvertiserMoney],
                    [`productRewards_${index}`, "Has rewards or payouts", product.hasRewardsOrPayouts],
                    [`productHardwareRisk_${index}`, "Has hardware risk", product.hasHardwareRisk]
                  ].map(([name, label, checked]) => (
                    <label key={name as string} className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <input type="checkbox" name={name as string} defaultChecked={Boolean(checked)} />
                      <span>{label as string}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {message ? <div className="card" style={{ color: "#2f6b4f" }}>{message}</div> : null}
          {error ? <div className="card" style={{ color: "#8f3617" }}>{error}</div> : null}

          <div className="buttonRow">
            <button type="submit" className="buttonPrimary" disabled={isPending}>
              {isPending ? "Saving..." : "Save workspace"}
            </button>
          </div>
        </form>
      </section>

      <section className="surface pageSection">
        <div className="kicker">Roadmap Tasks</div>
        <ul className="list" style={{ marginTop: 18 }}>
          {data.tasks.map((task) => (
            <li key={task.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start" }}>
                <div className="stack" style={{ gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>{task.title}</div>
                  <div className="muted">{task.description}</div>
                  <div className="muted" style={{ fontSize: "0.92rem" }}>
                    Phase: {task.phaseKey === "phase_0" ? "Phase 0" : "Phase 1"} • Status: {task.status.replaceAll("_", " ")}
                  </div>
                </div>
                <div className="buttonRow">
                  {task.status !== "complete" && task.status !== "not_needed" ? (
                    <button
                      type="button"
                      className="buttonSecondary"
                      onClick={() => setStatus(task.id, "complete")}
                    >
                      Mark complete
                    </button>
                  ) : null}
                  {task.status === "complete" ? (
                    <button
                      type="button"
                      className="buttonSecondary"
                      onClick={() => setStatus(task.id, "not_started")}
                    >
                      Reopen
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}

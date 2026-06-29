export type SetupStepStatus = "not_started" | "in_progress" | "complete" | "not_needed";

export type SetupSubstep = {
  key: string;
  label: string;
  detail: string;
};

export type SetupStep = {
  stepNumber: number;
  title: string;
  description: string;
  substeps: SetupSubstep[];
};

export type SetupConfig = {
  businessType: string;
  totalSteps: number;
  steps: SetupStep[];
};

export const soleProprietorSetup: SetupConfig = {
  businessType: "sole-proprietor",
  totalSteps: 7,
  steps: [
    {
      stepNumber: 1,
      title: "Entity application",
      description: "Decide who is applying, confirm whether you are operating as yourself or an entity, and capture your legal identity details.",
      substeps: [
        {
          key: "applicant-mode",
          label: "Choose applicant type",
          detail: "Tell us whether you are filing as an individual or as an existing business entity."
        },
        {
          key: "legal-name",
          label: "Confirm legal name",
          detail: "If you are filing as yourself, we will collect the exact legal name that must match the paperwork."
        },
        {
          key: "review",
          label: "Review step 1",
          detail: "Check the summary and confirm this setup step is ready to move forward."
        }
      ]
    },
    {
      stepNumber: 2,
      title: "DBA / FBN filing",
      description: "Decide whether you need a DBA or fictitious business name filing and line up the naming details before you publish anything.",
      substeps: [
        {
          key: "requirements",
          label: "Check county rules",
          detail: "Review whether your public-facing name differs from your legal name and whether county filing is required."
        },
        {
          key: "prep",
          label: "Prepare filing inputs",
          detail: "Gather the business name, county, publication notes, and timing details before submitting."
        },
        {
          key: "confirm",
          label: "Lock the naming plan",
          detail: "Confirm the name strategy is clear so the next setup steps use the same naming everywhere."
        }
      ]
    },
    {
      stepNumber: 3,
      title: "City business license",
      description: "Identify where you operate, confirm local licensing rules, and prepare the details needed before you start selling.",
      substeps: [
        {
          key: "jurisdiction",
          label: "Find the right city",
          detail: "Pin down the city or cities that may require a license based on where you work and where customers are served."
        },
        {
          key: "requirements",
          label: "Collect license details",
          detail: "Get together start dates, business activity details, and any fee or renewal expectations."
        },
        {
          key: "confirm",
          label: "Confirm filing plan",
          detail: "Make sure the licensing plan is captured before you move into tax and banking tasks."
        }
      ]
    },
    {
      stepNumber: 4,
      title: "Tax registration",
      description: "Map out EIN, seller's permit, and state tax needs so you are not guessing later when payments start coming in.",
      substeps: [
        {
          key: "tax-scope",
          label: "Map tax obligations",
          detail: "Figure out whether you need an EIN, seller's permit, payroll setup, or state registrations."
        },
        {
          key: "documents",
          label: "Prepare tax documents",
          detail: "Gather the identifying details and paperwork that support each registration."
        },
        {
          key: "confirm",
          label: "Confirm tax setup",
          detail: "Record the plan so the business can move into payments and operations with less friction."
        }
      ]
    },
    {
      stepNumber: 5,
      title: "Banking & payments",
      description: "Separate money cleanly, choose payment rails, and line up the systems that keep your books usable.",
      substeps: [
        {
          key: "accounts",
          label: "Choose accounts",
          detail: "Decide which bank account, card, and payment processor setup makes sense for this business."
        },
        {
          key: "ops",
          label: "Set operational rules",
          detail: "Capture who gets paid where, how expenses are tracked, and how invoices or subscriptions will run."
        },
        {
          key: "confirm",
          label: "Confirm money flow",
          detail: "Validate the funds flow before you move to launch prep and review."
        }
      ]
    },
    {
      stepNumber: 6,
      title: "Legal pages & launch",
      description: "Get the public-facing legal basics, domain choices, and launch checklist into shape before going live.",
      substeps: [
        {
          key: "public-surface",
          label: "Review public surface",
          detail: "Audit the website, product copy, and launch points that need legal or business details attached."
        },
        {
          key: "policies",
          label: "Prepare policies",
          detail: "Set up the minimum terms, privacy, and contact details needed for your launch surface."
        },
        {
          key: "confirm",
          label: "Confirm launch readiness",
          detail: "Check that the public launch surfaces align with the rest of the business setup."
        }
      ]
    },
    {
      stepNumber: 7,
      title: "Review & submit",
      description: "Run a final pass across your setup decisions and mark the whole setup path complete when it is ready.",
      substeps: [
        {
          key: "audit",
          label: "Audit everything",
          detail: "Review the earlier steps, documents, and answers for consistency."
        },
        {
          key: "fix-gaps",
          label: "Catch any gaps",
          detail: "Look for missing names, filings, or accounts before the setup is marked done."
        },
        {
          key: "submit",
          label: "Complete setup",
          detail: "Confirm the full setup track is complete and ready to operate from."
        }
      ]
    }
  ]
};

export const llcSetup: SetupConfig = {
  businessType: "llc",
  totalSteps: 9,
  steps: [
    {
      stepNumber: 1,
      title: "Entity application",
      description: "Confirm who is applying, whether the LLC already exists, and what legal identity details need to anchor the rest of the formation flow.",
      substeps: [
        {
          key: "applicant-mode",
          label: "Choose applicant type",
          detail: "Tell us whether you are filing as an individual founder or on behalf of an entity."
        },
        {
          key: "legal-name",
          label: "Confirm legal name",
          detail: "Capture the legal person details tied to the filing so later documents stay consistent."
        },
        {
          key: "review",
          label: "Review step 1",
          detail: "Make sure the filing identity is correct before the flow moves into naming and formation."
        }
      ]
    },
    {
      stepNumber: 2,
      title: "DBA / FBN filing",
      description: "Decide whether the LLC will use its legal name or a separate public-facing brand and prepare the filing plan.",
      substeps: [
        {
          key: "requirements",
          label: "Check naming rules",
          detail: "Confirm whether the public brand name differs from the LLC legal name and triggers a DBA or FBN."
        },
        {
          key: "prep",
          label: "Prepare filing inputs",
          detail: "Gather county, publication, and branding details before you file."
        },
        {
          key: "confirm",
          label: "Lock the naming plan",
          detail: "Carry the chosen naming strategy consistently into formation, banking, and launch."
        }
      ]
    },
    {
      stepNumber: 3,
      title: "LLC name & formation",
      description: "Reserve the name, prepare the organizer details, and file the core state formation paperwork.",
      substeps: [
        {
          key: "name-check",
          label: "Check name availability",
          detail: "Make sure the LLC name works before the filing package is assembled."
        },
        {
          key: "formation-prep",
          label: "Prepare formation details",
          detail: "Collect addresses, managers, organizers, and state filing details."
        },
        {
          key: "confirm",
          label: "Confirm formation package",
          detail: "Verify the state filing package is coherent before you submit it."
        }
      ]
    },
    {
      stepNumber: 4,
      title: "Registered agent & operating agreement",
      description: "Assign the registered agent, settle the operating structure, and prepare the agreement that supports how the business runs.",
      substeps: [
        {
          key: "agent",
          label: "Select registered agent",
          detail: "Confirm the person or service that will receive legal notices."
        },
        {
          key: "agreement",
          label: "Draft operating agreement",
          detail: "Capture ownership, management, and signature details clearly."
        },
        {
          key: "confirm",
          label: "Confirm internal structure",
          detail: "Make sure the agent and agreement decisions align with the formation filing."
        }
      ]
    },
    {
      stepNumber: 5,
      title: "EIN & tax setup",
      description: "Obtain the EIN, map the LLC's tax profile, and prepare any state registrations you need before opening operations.",
      substeps: [
        {
          key: "federal",
          label: "Handle federal setup",
          detail: "Prepare the information needed for the EIN and federal business identity."
        },
        {
          key: "state",
          label: "Handle state setup",
          detail: "Check seller's permit, payroll, or state account registrations if they apply."
        },
        {
          key: "confirm",
          label: "Confirm tax profile",
          detail: "Record the tax setup so banking and launch steps do not drift from it."
        }
      ]
    },
    {
      stepNumber: 6,
      title: "City business license",
      description: "Confirm local licensing rules for the LLC and collect the details needed for any city registration.",
      substeps: [
        {
          key: "jurisdiction",
          label: "Find the right city",
          detail: "Identify the local authority that applies to your operations."
        },
        {
          key: "requirements",
          label: "Prepare license details",
          detail: "Gather dates, activity descriptions, and fee expectations."
        },
        {
          key: "confirm",
          label: "Confirm filing plan",
          detail: "Lock in the local compliance plan before launch."
        }
      ]
    },
    {
      stepNumber: 7,
      title: "Banking, payments & bookkeeping",
      description: "Open the business money stack, pick payment tools, and define the bookkeeping system that supports the LLC from day one.",
      substeps: [
        {
          key: "accounts",
          label: "Open core accounts",
          detail: "Choose the bank account and payment rails tied to the LLC's legal and tax setup."
        },
        {
          key: "ops",
          label: "Set operating rules",
          detail: "Define how invoices, subscriptions, reimbursements, and bookkeeping will work."
        },
        {
          key: "confirm",
          label: "Confirm money flow",
          detail: "Review the financial ops plan before public launch."
        }
      ]
    },
    {
      stepNumber: 8,
      title: "Legal pages & launch",
      description: "Align the site, product, and launch surfaces with the entity you just formed and the way it is allowed to operate.",
      substeps: [
        {
          key: "surface",
          label: "Review public surface",
          detail: "Audit the website, app, and launch channels that expose the business publicly."
        },
        {
          key: "policies",
          label: "Prepare legal basics",
          detail: "Line up terms, privacy, and support/contact details."
        },
        {
          key: "confirm",
          label: "Confirm launch readiness",
          detail: "Make sure your public launch aligns with the LLC's internal setup."
        }
      ]
    },
    {
      stepNumber: 9,
      title: "Review & submit",
      description: "Run the final review, catch any mismatches, and mark the LLC setup path complete when the record is clean.",
      substeps: [
        {
          key: "audit",
          label: "Audit everything",
          detail: "Check the setup answers, documents, and name usage one more time."
        },
        {
          key: "fix-gaps",
          label: "Catch any gaps",
          detail: "Flag what is still missing before the formation track is marked done."
        },
        {
          key: "submit",
          label: "Complete setup",
          detail: "Confirm the LLC setup track is complete and ready to work from."
        }
      ]
    }
  ]
};

export function getSetupConfig(businessType: string): SetupConfig | null {
  if (businessType === "sole-proprietor") return soleProprietorSetup;
  if (businessType === "llc") return llcSetup;
  return null;
}

export function getSetupStep(businessType: string, stepNumber: number) {
  return getSetupConfig(businessType)?.steps.find((step) => step.stepNumber === stepNumber) ?? null;
}

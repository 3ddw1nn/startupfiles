import { getAuthUserId } from "@convex-dev/auth/server";
import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";
import type { GenericId } from "convex/values";

type SetupStep = {
  stepNumber: number;
  title: string;
  description: string;
};

type SetupConfig = {
  businessType: string;
  totalSteps: number;
  steps: SetupStep[];
};

const soleProprietorSetup: SetupConfig = {
  businessType: "sole-proprietor",
  totalSteps: 7,
  steps: [
    { stepNumber: 1, title: "Entity application", description: "Decide whether you are applying as yourself or as a business entity, and provide your legal name." },
    { stepNumber: 2, title: "DBA / FBN filing", description: "If you are using a separate business name, file the DBA or Fictitious Business Name with your county." },
    { stepNumber: 3, title: "City business license", description: "Register for a business license with your local city before accepting payments." },
    { stepNumber: 4, title: "Tax registration", description: "Obtain an EIN, register for state taxes, and apply for a seller's permit if needed." },
    { stepNumber: 5, title: "Banking & payments", description: "Set up a separate bank account, payment processing, and bookkeeping." },
    { stepNumber: 6, title: "Legal pages & launch", description: "Prepare terms of service, privacy policy, and finalize your domain and website." },
    { stepNumber: 7, title: "Review & submit", description: "Review all your answers and confirm everything is ready." }
  ]
};

const llcSetup: SetupConfig = {
  businessType: "llc",
  totalSteps: 9,
  steps: [
    { stepNumber: 1, title: "Entity application", description: "Decide whether you are applying as a business entity and provide your legal name." },
    { stepNumber: 2, title: "DBA / FBN filing", description: "If the LLC operates under a brand name different from its legal name, file the DBA." },
    { stepNumber: 3, title: "LLC name & formation", description: "Check name availability and file Articles of Organization with the state." },
    { stepNumber: 4, title: "Registered agent & operating agreement", description: "Designate a registered agent and draft an operating agreement." },
    { stepNumber: 5, title: "EIN & tax setup", description: "Obtain an EIN from the IRS and handle state tax registration." },
    { stepNumber: 6, title: "City business license", description: "Register for a business license with your local city." },
    { stepNumber: 7, title: "Banking, payments & bookkeeping", description: "Set up a business bank account, Stripe, and accounting." },
    { stepNumber: 8, title: "Legal pages & launch", description: "Prepare terms of service, privacy policy, and finalize your online presence." },
    { stepNumber: 9, title: "Review & submit", description: "Review all your answers and confirm everything is ready." }
  ]
};

function getSetupConfig(businessType: string): SetupConfig | null {
  if (businessType === "sole-proprietor") return soleProprietorSetup;
  if (businessType === "llc") return llcSetup;
  return null;
}

function normalizeStepStatuses(statuses: string[], currentStep: number, totalSteps = statuses.length, minimumStep = 0) {
  const safeStatuses = Array.from({ length: totalSteps }, (_step, index) => statuses[index] ?? "not_started");
  const latestInProgressIndex = safeStatuses.reduce(
    (latest, status, index) => (status === "in_progress" ? index : latest),
    -1
  );
  const boundedMinimumStep = Math.min(Math.max(minimumStep, 0), totalSteps);
  const effectiveCurrentStep = Math.min(
    Math.max(currentStep, latestInProgressIndex + 1, boundedMinimumStep),
    totalSteps
  );
  const normalized = safeStatuses.map((status, index) => {
    const stepNumber = index + 1;
    if (stepNumber < effectiveCurrentStep && status !== "not_needed") return "complete";
    if (stepNumber === effectiveCurrentStep && status === "not_started") return "in_progress";
    return status;
  });

  return {
    currentStep: effectiveCurrentStep,
    stepStatuses: normalized
  };
}

function stepStatusesChanged(left: string[], right: string[]) {
  return left.length !== right.length || left.some((status, index) => status !== right[index]);
}

const query = queryGeneric;
const mutation = mutationGeneric;

const stepStatusValidator = v.union(
  v.literal("not_started"),
  v.literal("in_progress"),
  v.literal("complete"),
  v.literal("not_needed")
);

type SetupSessionDoc = {
  _id: GenericId<"setupSessions">;
  workspaceId: GenericId<"workspaces">;
  businessType: string;
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
  startedAt?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
};

export const getSetupSession = query({
  args: {
    businessType: v.string()
  },
  handler: async (ctx, args): Promise<SetupSessionDoc | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q: any) => q.eq("ownerUserId", userId))
      .unique();
    if (!workspace) return null;

    const session = await ctx.db
      .query("setupSessions")
      .withIndex("by_workspace_and_type", (q: any) =>
        q.eq("workspaceId", workspace._id).eq("businessType", args.businessType)
      )
      .unique();

    if (!session) return null;

    const config = getSetupConfig(args.businessType);
    const normalized = normalizeStepStatuses(
      session.stepStatuses,
      session.currentStep,
      config?.totalSteps ?? session.stepStatuses.length,
      1
    );
    return {
      ...(session as SetupSessionDoc),
      ...normalized
    };
  }
});

export const getSetupOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        lastActiveBusinessType: null,
        summaries: []
      };
    }

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q: any) => q.eq("ownerUserId", userId))
      .unique();
    if (!workspace) {
      return {
        lastActiveBusinessType: null,
        summaries: []
      };
    }

    const sessions = await ctx.db
      .query("setupSessions")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspace._id))
      .take(50);

    const summaries = sessions
      .map((session) => {
        const config = getSetupConfig(session.businessType);
        const totalSteps = config?.totalSteps ?? session.stepStatuses.length;
        const normalized = normalizeStepStatuses(session.stepStatuses, session.currentStep, totalSteps, 1);
        const completedSteps = normalized.stepStatuses.filter(
          (status: string) => status === "complete" || status === "not_needed"
        ).length;
        return {
          businessType: session.businessType,
          currentStep: normalized.currentStep,
          totalSteps,
          completedSteps,
          updatedAt: session.updatedAt,
          isCompleted: session.isCompleted
        };
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return {
      lastActiveBusinessType: summaries[0]?.businessType ?? null,
      summaries
    };
  }
});

export const startSetup = mutation({
  args: {
    businessType: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in.");

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q: any) => q.eq("ownerUserId", userId))
      .unique();
    if (!workspace) throw new Error("Workspace not found.");

    const config = getSetupConfig(args.businessType);
    if (!config) throw new Error(`Unknown business type: ${args.businessType}`);

    const existing = await ctx.db
      .query("setupSessions")
      .withIndex("by_workspace_and_type", (q: any) =>
        q.eq("workspaceId", workspace._id).eq("businessType", args.businessType)
      )
      .unique();

    if (existing) {
      const normalized = normalizeStepStatuses(existing.stepStatuses, existing.currentStep, config.totalSteps, 1);
      if (
        existing.currentStep !== normalized.currentStep ||
        stepStatusesChanged(existing.stepStatuses, normalized.stepStatuses)
      ) {
        await ctx.db.patch(existing._id, {
          currentStep: normalized.currentStep,
          stepStatuses: normalized.stepStatuses,
          updatedAt: Date.now()
        });
      }
      return existing._id;
    }

    const now = Date.now();
    const stepStatuses = config.steps.map((_s: any, i: number) =>
      i === 0 ? "in_progress" : "not_started"
    );

    const id = await ctx.db.insert("setupSessions", {
      workspaceId: workspace._id,
      businessType: args.businessType,
      currentStep: 1,
      stepStatuses,
      isCompleted: false,
      startedAt: now,
      createdAt: now,
      updatedAt: now
    });

    return id;
  }
});

export const saveSetupStep = mutation({
  args: {
    businessType: v.string(),
    currentStep: v.number(),
    stepStatuses: v.array(stepStatusValidator),
    isEntityApplication: v.optional(v.boolean()),
    legalFirstName: v.optional(v.string()),
    legalMiddleName: v.optional(v.string()),
    legalLastName: v.optional(v.string()),
    legalSuffix: v.optional(v.string()),
    needsDba: v.optional(v.boolean()),
    dbaName: v.optional(v.string()),
    dbaCounty: v.optional(v.string()),
    dbaNewspaperName: v.optional(v.string()),
    dbaPublicationFiled: v.optional(v.boolean()),
    isCompleted: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in.");

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q: any) => q.eq("ownerUserId", userId))
      .unique();
    if (!workspace) throw new Error("Workspace not found.");

    const session = await ctx.db
      .query("setupSessions")
      .withIndex("by_workspace_and_type", (q: any) =>
        q.eq("workspaceId", workspace._id).eq("businessType", args.businessType)
      )
      .unique();

    const now = Date.now();
    const config = getSetupConfig(args.businessType);
    const normalized = normalizeStepStatuses(
      args.stepStatuses,
      args.currentStep,
      config?.totalSteps ?? args.stepStatuses.length,
      1
    );
    const patch: Record<string, any> = {
      currentStep: normalized.currentStep,
      stepStatuses: normalized.stepStatuses,
      updatedAt: now
    };

    if (args.isEntityApplication !== undefined) {
      patch.isEntityApplication = args.isEntityApplication;
    }
    if (args.legalFirstName !== undefined) {
      patch.legalFirstName = args.legalFirstName;
    }
    if (args.legalMiddleName !== undefined) {
      patch.legalMiddleName = args.legalMiddleName;
    }
    if (args.legalLastName !== undefined) {
      patch.legalLastName = args.legalLastName;
    }
    if (args.legalSuffix !== undefined) {
      patch.legalSuffix = args.legalSuffix;
    }
    if (args.needsDba !== undefined) {
      patch.needsDba = args.needsDba;
    }
    if (args.dbaName !== undefined) {
      patch.dbaName = args.dbaName;
    }
    if (args.dbaCounty !== undefined) {
      patch.dbaCounty = args.dbaCounty;
    }
    if (args.dbaNewspaperName !== undefined) {
      patch.dbaNewspaperName = args.dbaNewspaperName;
    }
    if (args.dbaPublicationFiled !== undefined) {
      patch.dbaPublicationFiled = args.dbaPublicationFiled;
    }
    if (args.isCompleted) {
      patch.isCompleted = true;
      patch.completedAt = now;
    }

    if (!session) {
      await ctx.db.insert("setupSessions", {
        workspaceId: workspace._id,
        businessType: args.businessType,
        currentStep: normalized.currentStep,
        stepStatuses: normalized.stepStatuses,
        isCompleted: args.isCompleted === true,
        startedAt: now,
        createdAt: now,
        ...patch
      });
      return true;
    }

    await ctx.db.patch(session._id, patch);
    return true;
  }
});

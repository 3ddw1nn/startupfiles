import type { DashboardData, OnboardingInput, TaskStatus } from "@founderfile/shared/domain";
import { makeFunctionReference } from "convex/server";

export const convexApi = {
  viewer: makeFunctionReference<"query", Record<string, never>, DashboardData | null>("app:viewer"),
  saveOnboarding: makeFunctionReference<"mutation", OnboardingInput, DashboardData>("app:saveOnboarding"),
  setTaskStatus: makeFunctionReference<
    "mutation",
    {
      taskId: string;
      status: TaskStatus;
    },
    boolean
  >("app:setTaskStatus")
};

import {
  getDemoAccountUsage,
  updateDemoAccountUsage,
} from "../models/demoAccountModel";

// Check if demo usage is within limits
export const isDemoUsageAllowed = async (userId: string) => {
  const usage = await getDemoAccountUsage(userId);
  const currentTime = new Date();

  // Check daily limit
  if (usage.dailyCount >= 30) {
    return false;
  }

  // Check hourly limit
  const hourStart = new Date(currentTime);
  hourStart.setHours(currentTime.getHours() - 1);
  if (usage.hourlyCount >= 10 && usage.lastRequestTime > hourStart) {
    return false;
  }

  return true;
};

// Increment demo usage (call only after allowing the action)
export const incrementDemoUsage = async (userId: string) => {
  await updateDemoAccountUsage(userId);
};

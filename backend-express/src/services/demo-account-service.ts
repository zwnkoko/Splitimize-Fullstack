import {
  getDemoAccountUsage,
  updateDemoAccountUsage,
} from "../models/demoAccountModel";

export const checkDemoAccountUsage = async (userId: string) => {
  const usage = await getDemoAccountUsage(userId);
  const currentTime = new Date();

  // Check daily limit
  if (usage.dailyCount >= 30) {
    return { allowed: false };
  }

  // Check hourly limit
  const hourStart = new Date(currentTime);
  hourStart.setHours(currentTime.getHours() - 1);
  if (usage.hourlyCount >= 10 && usage.lastRequestTime > hourStart) {
    return { allowed: false };
  }

  // Update usage
  await updateDemoAccountUsage(userId);
  return { allowed: true };
};

import { prisma } from "@/lib/prisma";

export const getDemoAccountUsage = async (userId: string) => {
  const usage = await prisma.demoAccount.findUnique({
    where: { userId },
  });
  console.log(usage);
  return (
    usage || { dailyCount: 0, hourlyCount: 0, lastRequestTime: new Date(0) }
  );
};

export const updateDemoAccountUsage = async (userId: string) => {
  const currentTime = new Date();
  await prisma.demoAccount.upsert({
    where: { userId },
    update: {
      dailyCount: { increment: 1 },
      hourlyCount: { increment: 1 },
      lastRequestTime: currentTime,
    },
    create: {
      userId,
      dailyCount: 1,
      hourlyCount: 1,
      lastRequestTime: currentTime,
    },
  });
};

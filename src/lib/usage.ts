import { prisma } from "@/lib/prisma";

export const FREE_LIMITS = {
  aiMessages: 10,
  ttsRequests: 20,
};

// Safety cap for paid users — prevents runaway API costs.
export const PAID_LIMITS = {
  aiMessages: 200,
  ttsRequests: 500,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Returns null if allowed (and increments), or an error payload when over quota.
export async function checkAndIncrementUsage(
  userId: string,
  plan: string,
  kind: "aiMessages" | "ttsRequests"
): Promise<{ error: string; upgradeUrl?: string } | null> {
  const limit = plan === "free" ? FREE_LIMITS[kind] : PAID_LIMITS[kind];
  const date = todayKey();

  const counter = await prisma.usageCounter.upsert({
    where: { userId_date: { userId, date } },
    update: {},
    create: { userId, date },
  });

  if (counter[kind] >= limit) {
    return plan === "free"
      ? { error: "limit", upgradeUrl: "/pricing" }
      : { error: "daily_cap" };
  }

  await prisma.usageCounter.update({
    where: { userId_date: { userId, date } },
    data: { [kind]: { increment: 1 } },
  });
  return null;
}

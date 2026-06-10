import { prisma } from "@/lib/prisma";

export const FREE_LIMITS = {
  aiMessages: 10,
  ttsRequests: 20,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Returns null if allowed (and increments), or an error payload when over quota.
export async function checkAndIncrementUsage(
  userId: string,
  plan: string,
  kind: "aiMessages" | "ttsRequests"
): Promise<{ error: string; upgradeUrl: string } | null> {
  if (plan !== "free") return null;

  const date = todayKey();
  const counter = await prisma.usageCounter.upsert({
    where: { userId_date: { userId, date } },
    update: {},
    create: { userId, date },
  });

  if (counter[kind] >= FREE_LIMITS[kind]) {
    return { error: "limit", upgradeUrl: "/pricing" };
  }

  await prisma.usageCounter.update({
    where: { userId_date: { userId, date } },
    data: { [kind]: { increment: 1 } },
  });
  return null;
}

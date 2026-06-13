import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getTopicMeta } from "@/lib/packages-data";

// Returns the learner's study topics grouped by language, each with a total
// card count and how many are due now. Powers the language-tabbed study
// launcher. Cards with no `topic` are bucketed as the "custom" topic.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const cards = await prisma.card.findMany({
    where: { userId: session.userId },
    select: { language: true, topic: true, dueDate: true },
  });

  // key = `${language}::${topicId}`
  const groups = new Map<
    string,
    { language: string; topicId: string; total: number; due: number }
  >();

  for (const c of cards) {
    const topicId = c.topic ?? "custom";
    const key = `${c.language}::${topicId}`;
    let g = groups.get(key);
    if (!g) {
      g = { language: c.language, topicId, total: 0, due: 0 };
      groups.set(key, g);
    }
    g.total++;
    if (c.dueDate <= now) g.due++;
  }

  const byLanguage: Record<string, Array<{
    topicId: string;
    label: string;
    emoji: string;
    color: string;
    total: number;
    due: number;
  }>> = { en: [], ar: [], fr: [] };

  for (const g of groups.values()) {
    const meta = getTopicMeta(g.topicId === "custom" ? null : g.topicId);
    if (!byLanguage[g.language]) byLanguage[g.language] = [];
    byLanguage[g.language].push({
      topicId: g.topicId,
      label: meta.label,
      emoji: meta.emoji,
      color: meta.color,
      total: g.total,
      due: g.due,
    });
  }

  // Stable order: core first, custom last, packages in between by label.
  for (const lang of Object.keys(byLanguage)) {
    byLanguage[lang].sort((a, b) => {
      const rank = (t: string) => (t === "core" ? 0 : t === "custom" ? 2 : 1);
      const r = rank(a.topicId) - rank(b.topicId);
      return r !== 0 ? r : a.label.localeCompare(b.label, "tr");
    });
  }

  return NextResponse.json({ byLanguage });
}

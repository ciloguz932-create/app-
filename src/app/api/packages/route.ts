import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CONTENT_PACKAGES } from "@/lib/packages-data";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const installs = await prisma.contentInstall.findMany({
    where: { userId: session.userId, kind: "package" },
    select: { contentId: true },
  });
  const installed = new Set(installs.map((i) => i.contentId));

  return NextResponse.json({
    packages: CONTENT_PACKAGES.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      language: p.language,
      level: p.level,
      emoji: p.emoji,
      color: p.color,
      counts: {
        vocabulary: p.vocabulary.length,
        patterns: p.patterns.length,
        readings: p.readings.length,
      },
      installed: installed.has(p.id),
    })),
  });
}

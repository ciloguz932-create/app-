import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BADGE_DEFS } from "@/lib/badges";

const VALID_KEYS = new Set(BADGE_DEFS.map((b) => b.key));

export async function GET() {
  const badges = await prisma.badge.findMany({ orderBy: { unlockedAt: "asc" }, take: 200 });
  return NextResponse.json(badges);
}

export async function POST(req: Request) {
  const { key } = await req.json();
  if (!key || typeof key !== "string") return NextResponse.json({ error: "key required" }, { status: 400 });
  if (!VALID_KEYS.has(key)) return NextResponse.json({ error: "unknown badge key" }, { status: 400 });
  const badge = await prisma.badge.upsert({
    where: { key },
    create: { key },
    update: {},
  });
  return NextResponse.json(badge);
}

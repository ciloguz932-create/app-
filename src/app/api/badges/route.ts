import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const badges = await prisma.badge.findMany({ orderBy: { unlockedAt: "asc" } });
  return NextResponse.json(badges);
}

export async function POST(req: Request) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  const badge = await prisma.badge.upsert({
    where: { key },
    create: { key },
    update: {},
  });
  return NextResponse.json(badge);
}

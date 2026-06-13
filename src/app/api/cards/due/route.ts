import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language");
  const topic = searchParams.get("topic");
  const limit = parseInt(searchParams.get("limit") || "20");

  const now = new Date();

  const cards = await prisma.card.findMany({
    where: {
      userId: session.userId,
      dueDate: { lte: now },
      ...(language && language !== "all" ? { language } : {}),
      ...(topic && topic !== "all" ? { topic } : {}),
    },
    orderBy: { dueDate: "asc" },
    take: limit,
  });

  return NextResponse.json(cards);
}

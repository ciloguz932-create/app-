import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language");
  const limit = parseInt(searchParams.get("limit") || "20");

  const now = new Date();

  const cards = await prisma.card.findMany({
    where: {
      dueDate: { lte: now },
      ...(language && language !== "all" ? { language } : {}),
    },
    orderBy: { dueDate: "asc" },
    take: limit,
  });

  return NextResponse.json(cards);
}

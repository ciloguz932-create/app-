import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language");
  const search = searchParams.get("search");

  const cards = await prisma.card.findMany({
    where: {
      ...(language && language !== "all" ? { language } : {}),
      ...(search
        ? {
            OR: [
              { word: { contains: search } },
              { translation: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cards);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { word, translation, language, example, notes } = body;

  if (!word || !translation || !language) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const card = await prisma.card.create({
    data: { word, translation, language, example: example || null, notes: notes || null },
  });

  return NextResponse.json(card, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.card.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

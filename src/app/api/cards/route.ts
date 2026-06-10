import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language");
  const search = searchParams.get("search");

  const cards = await prisma.card.findMany({
    where: {
      userId: session.userId,
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
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { word, translation, language, example, notes } = body;

  if (!word || !translation || !language) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const card = await prisma.card.create({
    data: {
      userId: session.userId,
      word,
      translation,
      language,
      example: example || null,
      notes: notes || null,
    },
  });

  return NextResponse.json(card, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.word === "string") data.word = body.word;
  if (typeof body.translation === "string") data.translation = body.translation;
  if (typeof body.example === "string" || body.example === null) data.example = body.example;
  if (typeof body.notes === "string" || body.notes === null) data.notes = body.notes;
  if (typeof body.isFavorite === "boolean") data.isFavorite = body.isFavorite;

  const result = await prisma.card.updateMany({
    where: { id, userId: session.userId },
    data,
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const card = await prisma.card.findUnique({ where: { id } });
  return NextResponse.json(card);
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const result = await prisma.card.deleteMany({
    where: { id, userId: session.userId },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

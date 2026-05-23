import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language") || "en";
  const difficulty = searchParams.get("difficulty");
  const id = searchParams.get("id");

  if (id) {
    const passage = await prisma.readingPassage.findUnique({ where: { id } });
    if (!passage) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...passage, questions: JSON.parse(passage.questions) });
  }

  const passages = await prisma.readingPassage.findMany({
    where: {
      language,
      ...(difficulty ? { difficulty } : {}),
    },
    select: { id: true, title: true, language: true, difficulty: true },
  });

  return NextResponse.json(passages);
}

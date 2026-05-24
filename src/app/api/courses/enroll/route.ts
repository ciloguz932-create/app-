import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/lib/courses";

export async function POST(req: Request) {
  const { courseId } = (await req.json()) as { courseId?: string };
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  const course = getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  let added = 0;
  for (const v of course.vocabulary) {
    const existing = await prisma.card.findFirst({
      where: { word: v.word, language: course.language },
    });
    if (!existing) {
      await prisma.card.create({
        data: {
          word: v.word,
          translation: v.translation,
          language: course.language,
          example: v.example,
          notes: `[${course.title}]`,
        },
      });
      added++;
    }
  }

  return NextResponse.json({ added, total: course.vocabulary.length });
}

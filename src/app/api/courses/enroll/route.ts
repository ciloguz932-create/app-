import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCourse } from "@/lib/courses";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const installs = await prisma.contentInstall.findMany({
    where: { userId: session.userId, kind: "course" },
    select: { contentId: true },
  });

  return NextResponse.json({ enrolled: installs.map((i) => i.contentId) });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      where: { word: v.word, language: course.language, userId: session.userId },
    });
    if (!existing) {
      await prisma.card.create({
        data: {
          userId: session.userId,
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

  await prisma.contentInstall.upsert({
    where: {
      userId_kind_contentId: {
        userId: session.userId,
        kind: "course",
        contentId: course.id,
      },
    },
    update: {},
    create: { userId: session.userId, kind: "course", contentId: course.id },
  });

  return NextResponse.json({ added, total: course.vocabulary.length });
}

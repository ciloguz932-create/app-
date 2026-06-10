import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, signToken, setSessionCookie } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  });
  await setSessionCookie(token);

  return NextResponse.json({ plan: user.plan });
}

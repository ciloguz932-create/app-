import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    const invalid = NextResponse.json(
      { error: "E-posta veya şifre hatalı" },
      { status: 401 }
    );

    if (!email || !password) return invalid;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return invalid;

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return invalid;

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarEmoji: user.avatarEmoji,
        avatarColor: user.avatarColor,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Sunucu hatası, lütfen tekrar deneyin" }, { status: 500 });
  }
}


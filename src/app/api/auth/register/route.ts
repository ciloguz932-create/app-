import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setSessionCookie } from "@/lib/auth";
import { seedUserData } from "@/lib/seed-user";

const AVATARS = ["🎓", "📚", "🦉", "🌟", "🚀", "🧠", "🌍", "✨"];
const COLORS = ["#A51C30", "#C5A028", "#1E5A8A", "#2E6B4F", "#6B3FA0"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin" }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "İsim en az 2 karakter olmalı" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarEmoji =
    typeof body.avatarEmoji === "string" && AVATARS.includes(body.avatarEmoji)
      ? body.avatarEmoji
      : AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const avatarColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  const user = await prisma.user.create({
    data: { email, name, passwordHash, avatarEmoji, avatarColor },
  });

  await seedUserData(prisma, user.id);

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  });
  await setSessionCookie(token);

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarEmoji: user.avatarEmoji,
        avatarColor: user.avatarColor,
        role: user.role,
        plan: user.plan,
      },
    },
    { status: 201 }
  );
}

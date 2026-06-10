import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, signToken, setSessionCookie } from "@/lib/auth";

const VALID_PLANS = new Set(["pro", "institution"]);

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const plan = typeof body?.plan === "string" ? body.plan : "";
  if (!VALID_PLANS.has(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (process.env.STRIPE_SECRET_KEY) {
    // Stripe seam: create a real Checkout Session here and return its URL.
    // Webhook at /api/webhooks/stripe will then update the plan.
    return NextResponse.json(
      { error: "Stripe checkout not yet wired" },
      { status: 501 }
    );
  }

  // Demo mode: instant upgrade
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { plan, planUpdatedAt: new Date() },
  });

  // Re-issue JWT so the new plan takes effect without re-login
  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  });
  await setSessionCookie(token);

  return NextResponse.json({ url: "/checkout/success" });
}

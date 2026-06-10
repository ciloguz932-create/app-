import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_PLANS = new Set(["pro", "institution"]);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = (await req.json()) as { plan?: string };
  if (!plan || !VALID_PLANS.has(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Demo mode — no Stripe key configured
  if (!process.env.STRIPE_SECRET_KEY) {
    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { plan, planUpdatedAt: new Date() },
    });
    const { signToken, setSessionCookie } = await import("@/lib/auth");
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
    await setSessionCookie(token);
    return NextResponse.json({ url: "/checkout/success" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const priceId =
    plan === "pro"
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_INST_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: "Price ID not configured" }, { status: 500 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Create or retrieve Stripe customer
  let customerId = user.stripeCustomerId ?? undefined;
  if (!customerId) {
    const existing = await stripe.customers.list({ email: user.email, limit: 1 });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: user.id, plan },
    success_url: `${baseUrl}/checkout/success`,
    cancel_url: `${baseUrl}/checkout`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}

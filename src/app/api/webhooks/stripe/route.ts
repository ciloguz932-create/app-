import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const stripe = new Stripe(secretKey);
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan } = session.metadata ?? {};
    if (userId && plan) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          planUpdatedAt: new Date(),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { plan: "free", planUpdatedAt: new Date(), stripeSubscriptionId: null },
    });
  }

  return NextResponse.json({ received: true });
}

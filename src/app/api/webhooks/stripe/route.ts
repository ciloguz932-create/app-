import { NextResponse } from "next/server";

// Stripe webhook seam. When real payments are enabled:
// 1. npm i stripe; set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET
// 2. Verify signature with stripe.webhooks.constructEvent
// 3. On checkout.session.completed / customer.subscription.updated,
//    update User.plan by the customer's email or metadata.userId
export async function POST() {
  return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
}

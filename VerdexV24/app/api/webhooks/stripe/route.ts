import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook secret is not configured", { status: 500 });
  }
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  const event = stripe.webhooks.constructEvent(
    body,
    signature!,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "active", plan: "pro" })
      .eq("user_id", session.client_reference_id)
  }

  return Response.json({ received: true })
}

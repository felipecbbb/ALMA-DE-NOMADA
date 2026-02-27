import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type OrderStatus = "pending" | "paid" | "cancelled" | "refunded" | "expired";

function asStringMap(metadata: Stripe.Metadata | null | undefined) {
  const output: Record<string, string> = {};
  if (!metadata) return output;

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") output[key] = value;
  }
  return output;
}

async function upsertOrderFromSession(
  session: Stripe.Checkout.Session,
  status: OrderStatus,
) {
  if (!session.id) return;

  const stripe = getStripeServerClient();
  const supabase = createSupabaseAdminClient();
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 20,
  });

  const items = lineItems.data.map((item) => ({
    description: item.description ?? "Producto",
    quantity: item.quantity ?? 1,
    amount_total: item.amount_total ?? 0,
    currency: (item.currency ?? session.currency ?? "eur").toUpperCase(),
  }));

  const metadata = asStringMap(session.metadata);

  const payload = {
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    customer_email: session.customer_details?.email ?? null,
    status,
    total_cents: session.amount_total ?? 0,
    currency: (session.currency ?? "eur").toUpperCase(),
    items,
    metadata,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("orders")
    .upsert(payload, { onConflict: "stripe_session_id" });

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Falta la firma o la clave de webhook." },
        { status: 400 },
      );
    }

    const body = await request.text();
    const stripe = getStripeServerClient();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      await upsertOrderFromSession(
        event.data.object as Stripe.Checkout.Session,
        "paid",
      );
    }

    if (event.type === "checkout.session.expired") {
      await upsertOrderFromSession(
        event.data.object as Stripe.Checkout.Session,
        "expired",
      );
    }

    if (event.type === "checkout.session.async_payment_failed") {
      await upsertOrderFromSession(
        event.data.object as Stripe.Checkout.Session,
        "cancelled",
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo procesar el webhook",
      },
      { status: 400 },
    );
  }
}

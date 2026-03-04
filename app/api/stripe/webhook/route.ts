import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  generateDownloadCode,
  generateDownloadToken,
  getSiteUrl,
  hashDownloadCode,
  sendDigitalGuideEmail,
} from "@/lib/digital-delivery";
import {
  sendNewOrderNotificationEmail,
  sendPaymentFailedEmail,
} from "@/lib/email";
import { getStripeServerClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type OrderStatus = "pending" | "paid" | "cancelled" | "refunded" | "expired";
type SessionLineItem = {
  description: string;
  quantity: number;
  amount_total: number;
  currency: string;
};
type OrderDeliveryRow = {
  id: string;
  customer_email: string | null;
  metadata: unknown;
  download_token: string | null;
  download_code_hash: string | null;
  download_sent_at: string | null;
};

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

  const items: SessionLineItem[] = lineItems.data.map((item) => ({
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

  return { items, metadata };
}

async function decrementStockIfNeeded(
  session: Stripe.Checkout.Session,
  items: SessionLineItem[],
  metadata: Record<string, string>,
) {
  const productId =
    metadata.product_id ??
    (typeof session.metadata?.product_id === "string"
      ? session.metadata.product_id
      : "");

  if (!productId) return;

  const requestedQty = items.reduce(
    (acc, item) => acc + Math.max(1, Number(item.quantity ?? 1)),
    0,
  );
  const quantity = Math.max(1, requestedQty);

  const supabase = createSupabaseAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single();

  if (productError || !product) return;

  const currentStock = Number(product.stock ?? 0);
  if (currentStock <= 0) return;

  const nextStock = Math.max(0, currentStock - quantity);
  const { error: updateError } = await supabase
    .from("products")
    .update({ stock: nextStock, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

function readStringProperty(value: unknown, key: string) {
  if (!value || typeof value !== "object") return "";
  const entry = (value as Record<string, unknown>)[key];
  if (typeof entry !== "string") return "";
  return entry.trim();
}

async function ensureDigitalDelivery(
  session: Stripe.Checkout.Session,
  metadataFromSession: Record<string, string>,
) {
  const sessionId = String(session.id ?? "").trim();
  if (!sessionId) return;

  const supabase = createSupabaseAdminClient();
  const { data: orderRaw, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, customer_email, metadata, download_token, download_code_hash, download_sent_at",
    )
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (orderError || !orderRaw) return;
  const order = orderRaw as OrderDeliveryRow;

  const customerEmail = String(order.customer_email ?? "").trim();
  if (!customerEmail) return;

  let token = String(order.download_token ?? "").trim();
  let codeToSend: string | null = null;
  const hasHash = String(order.download_code_hash ?? "").trim() !== "";

  if (!token || !hasHash) {
    token = generateDownloadToken();
    codeToSend = generateDownloadCode();

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        download_token: token,
        download_code_hash: hashDownloadCode(codeToSend),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  if (order.download_sent_at) return;

  if (!codeToSend) {
    codeToSend = generateDownloadCode();
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        download_code_hash: hashDownloadCode(codeToSend),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  const siteUrl = getSiteUrl();
  if (!siteUrl) return;

  const productTitle =
    readStringProperty(order.metadata, "product_title") ||
    metadataFromSession.product_title ||
    "Guia digital";
  const downloadUrl = `${siteUrl}/descargar?token=${encodeURIComponent(token)}`;

  const sendResult = await sendDigitalGuideEmail({
    to: customerEmail,
    productTitle,
    downloadUrl,
    downloadCode: codeToSend,
    totalCents: session.amount_total ?? 0,
    currency: session.currency ?? "eur",
  });

  if (!sendResult.sent) return;

  const { error: sentError } = await supabase
    .from("orders")
    .update({
      download_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (sentError) {
    throw new Error(sentError.message);
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
      const session = event.data.object as Stripe.Checkout.Session;
      const supabase = createSupabaseAdminClient();
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("status")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      const { items, metadata } = (await upsertOrderFromSession(session, "paid")) ?? {
        items: [],
        metadata: {},
      };

      // Stripe puede reenviar el evento; evitamos descontar stock más de una vez.
      if (existingOrder?.status !== "paid") {
        await decrementStockIfNeeded(session, items, metadata);
      }

      await ensureDigitalDelivery(session, metadata);

      // Notify admin about the new order
      const customerEmail = session.customer_details?.email ?? "";
      if (customerEmail) {
        await sendNewOrderNotificationEmail({
          customerEmail,
          items,
          totalCents: session.amount_total ?? 0,
          currency: (session.currency ?? "eur").toUpperCase(),
          stripeSessionId: session.id,
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      await upsertOrderFromSession(
        event.data.object as Stripe.Checkout.Session,
        "expired",
      );
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const failedSession = event.data.object as Stripe.Checkout.Session;
      await upsertOrderFromSession(failedSession, "cancelled");

      const failedEmail = failedSession.customer_details?.email ?? "";
      if (failedEmail) {
        await sendPaymentFailedEmail({ to: failedEmail });
      }
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

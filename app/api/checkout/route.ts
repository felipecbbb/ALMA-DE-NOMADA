import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getStripeServerClient } from "@/lib/stripe";

export const runtime = "nodejs";

function getBaseUrl(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = String(body.productId ?? "").trim();
    const referralCode = String(body.referralCode ?? "")
      .trim()
      .slice(0, 40);

    if (!productId) {
      return NextResponse.json(
        { error: "Falta el producto para iniciar el checkout." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("active", true)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: "Producto no encontrado o inactivo." },
        { status: 404 },
      );
    }

    if (Number(product.stock ?? 0) <= 0) {
      return NextResponse.json(
        { error: "Este producto esta agotado en este momento." },
        { status: 400 },
      );
    }

    if (!String(product.digital_file_path ?? "").trim()) {
      return NextResponse.json(
        { error: "Esta guia todavia no tiene archivo digital disponible." },
        { status: 400 },
      );
    }

    const stripe = getStripeServerClient();
    const baseUrl = getBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel?product=${product.slug}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: String(product.currency ?? "EUR").toLowerCase(),
            unit_amount: Number(product.price_cents),
            product_data: {
              name: product.title,
              description: product.short_description ?? undefined,
              images: product.image_url ? [product.image_url] : undefined,
              metadata: {
                product_id: product.id,
                product_slug: product.slug,
              },
            },
          },
        },
      ],
      metadata: {
        product_id: product.id,
        product_slug: product.slug,
        product_title: product.title,
        ...(referralCode ? { referral_code: referralCode } : {}),
      },
      customer_creation: "always",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { isDownloadCodeValid } from "@/lib/digital-delivery";
import { getPrivateGuidesBucket } from "@/lib/storage-config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function readProductId(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return null;
  const candidate = (metadata as Record<string, unknown>).product_id;
  if (typeof candidate !== "string") return null;
  return candidate.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "").trim();
    const code = String(body.code ?? "").trim();

    if (!token || !code) {
      return NextResponse.json(
        { error: "Faltan token o codigo de descarga." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, metadata, download_code_hash, download_token")
      .eq("download_token", token)
      .maybeSingle();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    if (!order || order.status !== "paid") {
      return NextResponse.json(
        { error: "No se encontro una compra valida para este acceso." },
        { status: 404 },
      );
    }

    const expectedHash = String(order.download_code_hash ?? "");
    if (!expectedHash || !isDownloadCodeValid(code, expectedHash)) {
      return NextResponse.json(
        { error: "Codigo de descarga incorrecto." },
        { status: 401 },
      );
    }

    const productId = readProductId(order.metadata);
    if (!productId) {
      return NextResponse.json(
        { error: "No se pudo resolver el producto de este pedido." },
        { status: 500 },
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, title, digital_file_path")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Producto no encontrado para esta compra." },
        { status: 404 },
      );
    }

    const digitalPath = String(product.digital_file_path ?? "").trim();
    if (!digitalPath) {
      return NextResponse.json(
        { error: "Esta guia todavia no tiene archivo digital disponible." },
        { status: 400 },
      );
    }

    const bucket = getPrivateGuidesBucket();
    const { data: signed, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(digitalPath, 60 * 10);

    if (signedError || !signed?.signedUrl) {
      return NextResponse.json(
        { error: signedError?.message ?? "No se pudo generar la descarga." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      title: product.title,
      url: signed.signedUrl,
      expiresInSeconds: 60 * 10,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}


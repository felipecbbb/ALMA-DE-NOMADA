import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { isAdminRequest, requireAdminRequest } from "@/lib/admin-auth";
import { parseGalleryImages, slugify } from "@/lib/store-utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const url = new URL(request.url);
    const includeAll = url.searchParams.get("all") === "1";
    const slug = url.searchParams.get("slug");
    const adminMode = includeAll && isAdminRequest(request);

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!adminMode) {
      query = query.eq("active", true);
    }

    if (slug) {
      query = query.eq("slug", slug);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const digitalFilePath = String(body.digitalFilePath ?? "").trim();
    const priceCents = Number(body.priceCents ?? 0);
    const stock = Number(body.stock ?? 0);
    const currency = String(body.currency ?? "EUR").toUpperCase().trim();
    const shortDescription = String(body.shortDescription ?? "").trim();
    const description = String(body.description ?? "").trim();
    const galleryImages = parseGalleryImages(body.galleryImages);
    const active = Boolean(body.active ?? true);

    if (!title) {
      return NextResponse.json(
        { error: "El titulo es obligatorio." },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "La imagen principal es obligatoria." },
        { status: 400 },
      );
    }

    if (!digitalFilePath) {
      return NextResponse.json(
        { error: "Debes subir el archivo digital de la guia." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(priceCents) || priceCents <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser mayor que cero (en centimos)." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: "El stock debe ser un numero entero mayor o igual a cero." },
        { status: 400 },
      );
    }

    const slug =
      String(body.slug ?? "").trim() !== ""
        ? slugify(String(body.slug))
        : slugify(title);

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug,
        title,
        short_description: shortDescription || null,
        description: description || null,
        image_url: imageUrl,
        digital_file_path: digitalFilePath,
        gallery_images: galleryImages,
        price_cents: Math.round(priceCents),
        currency,
        stock,
        active,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

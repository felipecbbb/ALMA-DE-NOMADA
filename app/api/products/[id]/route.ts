import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { parseGalleryImages, slugify } from "@/lib/store-utils";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const payload: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = String(body.title ?? "").trim();
      if (!title) {
        return NextResponse.json(
          { error: "El titulo no puede quedar vacio." },
          { status: 400 },
        );
      }
      payload.title = title;
      if (body.slug === undefined) {
        payload.slug = slugify(title);
      }
    }

    if (body.slug !== undefined) {
      payload.slug = slugify(String(body.slug ?? ""));
    }

    if (body.shortDescription !== undefined) {
      payload.short_description = String(body.shortDescription ?? "").trim() || null;
    }

    if (body.description !== undefined) {
      payload.description = String(body.description ?? "").trim() || null;
    }

    if (body.imageUrl !== undefined) {
      const imageUrl = String(body.imageUrl ?? "").trim();
      if (!imageUrl) {
        return NextResponse.json(
          { error: "La imagen principal no puede estar vacia." },
          { status: 400 },
        );
      }
      payload.image_url = imageUrl;
    }

    if (body.galleryImages !== undefined) {
      payload.gallery_images = parseGalleryImages(body.galleryImages);
    }

    if (body.priceCents !== undefined) {
      const priceCents = Number(body.priceCents);
      if (!Number.isFinite(priceCents) || priceCents <= 0) {
        return NextResponse.json(
          { error: "El precio debe ser mayor que cero (en centimos)." },
          { status: 400 },
        );
      }
      payload.price_cents = Math.round(priceCents);
    }

    if (body.currency !== undefined) {
      payload.currency = String(body.currency ?? "EUR").toUpperCase().trim();
    }

    if (body.active !== undefined) {
      payload.active = Boolean(body.active);
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar." },
        { status: 400 },
      );
    }

    payload.updated_at = new Date().toISOString();

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

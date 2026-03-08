import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getPrivateGuidesBucket, getPublicImagesBucket } from "@/lib/storage-config";

export const runtime = "nodejs";

type UploadKind = "image" | "guide";

const SIGNED_URL_EXPIRY = 600; // 10 minutes

function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const kind: UploadKind | null =
      body.kind === "image" || body.kind === "guide" ? body.kind : null;
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
    const contentType =
      typeof body.contentType === "string" ? body.contentType.trim() : "application/octet-stream";

    if (!kind) {
      return NextResponse.json({ error: "Tipo de subida no válido." }, { status: 400 });
    }
    if (!fileName) {
      return NextResponse.json({ error: "Nombre de archivo requerido." }, { status: 400 });
    }

    const safeName = sanitizeFileName(fileName);
    const objectPath = `${kind === "image" ? "products/images" : "products/guides"}/${crypto.randomUUID()}-${safeName}`;
    const bucket = kind === "image" ? getPublicImagesBucket() : getPrivateGuidesBucket();

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "No se pudo generar la URL de subida." },
        { status: 500 },
      );
    }

    let publicUrl: string | undefined;
    if (kind === "image") {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      publicUrl = urlData.publicUrl;
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: objectPath,
      bucket,
      publicUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

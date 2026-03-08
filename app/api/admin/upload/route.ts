import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getPrivateGuidesBucket, getPublicImagesBucket } from "@/lib/storage-config";

export const runtime = "nodejs";

type UploadKind = "image" | "guide";

const IMAGE_MAX_SIZE = 8 * 1024 * 1024;
const GUIDE_MAX_SIZE = 250 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function resolveKind(raw: FormDataEntryValue | null): UploadKind | null {
  const kind = String(raw ?? "").trim().toLowerCase();
  if (kind === "image" || kind === "guide") return kind;
  return null;
}

function validateFile(kind: UploadKind, file: File) {
  const maxSize = kind === "image" ? IMAGE_MAX_SIZE : GUIDE_MAX_SIZE;
  if (file.size > maxSize) {
    return `El archivo supera el limite de ${Math.round(maxSize / 1024 / 1024)}MB.`;
  }

  if (kind === "image" && !String(file.type).startsWith("image/")) {
    return "Debes subir una imagen valida.";
  }

  return null;
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const kind = resolveKind(formData.get("kind"));
    const fileValue = formData.get("file");

    if (!kind) {
      return NextResponse.json(
        { error: "Tipo de subida no valido." },
        { status: 400 },
      );
    }

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        { error: "No se recibio ningun archivo." },
        { status: 400 },
      );
    }

    const validationError = validateFile(kind, fileValue);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const fileName = sanitizeFileName(fileValue.name || "archivo");
    const objectPath = `${kind === "image" ? "products/images" : "products/guides"}/${
      crypto.randomUUID()
    }-${fileName}`;
    const contentType =
      String(fileValue.type ?? "").trim() || "application/octet-stream";

    const buffer = Buffer.from(await fileValue.arrayBuffer());
    const bucket =
      kind === "image" ? getPublicImagesBucket() : getPrivateGuidesBucket();

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (kind === "image") {
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      return NextResponse.json({
        kind,
        bucket,
        path: objectPath,
        url: data.publicUrl,
      });
    }

    return NextResponse.json({
      kind,
      bucket,
      path: objectPath,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}


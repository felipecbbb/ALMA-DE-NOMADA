import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdminRequest } from "@/lib/admin-auth";

const VALID_STATUSES = new Set([
  "pending",
  "paid",
  "cancelled",
  "refunded",
  "expired",
]);

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
    const status = String(body.status ?? "").trim().toLowerCase();

    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Estado invalido." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

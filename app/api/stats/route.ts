import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { DashboardStats, OrderRecord, ProductRecord } from "@/lib/store-types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const supabase = createSupabaseAdminClient();

    const [{ data: orders, error: ordersError }, { data: products, error: productsError }] =
      await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("products").select("*"),
      ]);

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const typedOrders = (orders ?? []) as OrderRecord[];
    const typedProducts = (products ?? []) as ProductRecord[];

    const paidOrders = typedOrders.filter((order) => order.status === "paid");
    const totalRevenueCents = paidOrders.reduce(
      (acc, order) => acc + (order.total_cents ?? 0),
      0,
    );

    const stats: DashboardStats = {
      totalRevenueCents,
      totalOrders: typedOrders.length,
      paidOrders: paidOrders.length,
      averageOrderValueCents:
        paidOrders.length > 0 ? Math.round(totalRevenueCents / paidOrders.length) : 0,
      totalProducts: typedProducts.length,
      activeProducts: typedProducts.filter((product) => product.active).length,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

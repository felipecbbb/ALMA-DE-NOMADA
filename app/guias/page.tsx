import Link from "next/link";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ProductRecord } from "@/lib/store-types";
import { formatPrice } from "@/lib/store-utils";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  let guides: ProductRecord[] = [];

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    guides = (data ?? []) as ProductRecord[];
  } catch {
    guides = [];
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="px-6 pb-20 pt-28 md:px-12 md:pt-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Tienda
          </p>
          <h1 className="mt-3 text-4xl font-semibold uppercase text-foreground md:text-5xl">
            Nuestras guías
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Elige tu guía y compra en un checkout seguro. Todo pensado para que
            prepares tu viaje sin perder tiempo.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guias/${guide.slug}`}
              className={`group block ${guide.stock <= 0 ? "opacity-80" : ""}`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
                <img
                  src={guide.image_url}
                  alt={guide.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="py-4">
                <h2 className="text-base font-semibold text-foreground">{guide.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {guide.short_description}
                </p>
                {guide.stock <= 0 && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    Agotado
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {formatPrice(guide.price_cents, guide.currency)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {guides.length === 0 ? (
          <p className="mx-auto mt-8 max-w-6xl text-sm text-muted-foreground">
            No hay guías disponibles todavía.
          </p>
        ) : null}
      </section>
      <FooterSection />
    </main>
  );
}

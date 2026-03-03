"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FadeImage } from "@/components/fade-image";
import { ProductRecord } from "@/lib/store-types";
import { formatPrice } from "@/lib/store-utils";

export function CollectionSection() {
  const [guides, setGuides] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGuides = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) return;
        if (!mounted) return;
        setGuides((payload.products as ProductRecord[]) ?? []);
      } catch {
        if (!mounted) return;
        setGuides([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadGuides();
    return () => {
      mounted = false;
    };
  }, []);

  const items = guides;

  return (
    <section id="guias" className="bg-background">
      <div className="px-6 py-12 md:px-12 md:py-10 lg:px-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Guías digitales
        </h2>
      </div>

      <div className="pb-14 md:pb-24">
        <div className="grid grid-cols-2 gap-4 px-6 md:gap-8 md:px-12 lg:px-20">
          {items.map((guide) => (
            <Link
              key={guide.id}
              href={`/guias/${guide.slug}`}
              className={`group ${guide.stock <= 0 ? "opacity-80" : ""}`}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={guide.image_url || "/placeholder.svg"}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              <div className="py-3 md:py-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium leading-snug text-foreground md:text-lg">
                      {guide.title}
                    </h3>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block">
                      {guide.short_description}
                    </p>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        guide.stock > 0 ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {guide.stock > 0 ? `Stock: ${guide.stock}` : "Agotado"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-foreground md:text-2xl">
                    {formatPrice(guide.price_cents, guide.currency)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {loading ? (
          <p className="px-6 pt-4 text-sm text-muted-foreground md:px-12 lg:px-20">
            Cargando guías...
          </p>
        ) : null}
        {!loading && items.length === 0 ? (
          <p className="px-6 pt-4 text-sm text-muted-foreground md:px-12 lg:px-20">
            No hay guías publicadas todavía. Sube productos desde el panel admin.
          </p>
        ) : null}
      </div>
    </section>
  );
}

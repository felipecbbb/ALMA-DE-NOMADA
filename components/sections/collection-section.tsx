"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FadeImage } from "@/components/fade-image";
import { ProductRecord } from "@/lib/store-types";
import { formatPrice } from "@/lib/store-utils";

const fallbackGuides = [
  {
    id: "fallback-bali",
    slug: "guia-bali",
    title: "GUÍA DE BALI",
    short_description:
      "Itinerario por zonas, transporte, presupuesto y recomendaciones prácticas.",
    image_url:
      "https://almadenomada.com/cdn/shop/t/5/assets/GUIA%20BALI.jpeg?v=165168668847227153021769101751",
    price_cents: 1300,
    currency: "EUR",
  },
  {
    id: "fallback-australia",
    slug: "guia-australia",
    title: "GUÍA DE AUSTRALIA",
    short_description:
      "Guía práctica para planificar tu llegada, visado y primeros trámites.",
    image_url:
      "https://almadenomada.com/cdn/shop/t/5/assets/GUIA%20AUSTRALIA.jpeg?v=21027950027759913761769101750",
    price_cents: 1300,
    currency: "EUR",
  },
];

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
        // Keep fallback guides when API fails.
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadGuides();
    return () => {
      mounted = false;
    };
  }, []);

  const items = guides.length > 0 ? guides : fallbackGuides;

  return (
    <section id="guias" className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-10 lg:px-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Guías digitales
        </h2>
      </div>

      <div className="pb-24">
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {items.map((guide) => (
            <Link
              key={guide.id}
              href={`/guias/${guide.slug}`}
              className="group w-[75vw] flex-shrink-0 snap-center"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={guide.image_url || "/placeholder.svg"}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {guide.short_description}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {formatPrice(guide.price_cents, guide.currency)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden gap-8 md:grid md:grid-cols-2 md:px-12 lg:px-20">
          {items.map((guide) => (
            <Link key={guide.id} href={`/guias/${guide.slug}`} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={guide.image_url || "/placeholder.svg"}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {guide.short_description}
                    </p>
                  </div>
                  <span className="text-2xl font-medium text-foreground">
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
      </div>
    </section>
  );
}

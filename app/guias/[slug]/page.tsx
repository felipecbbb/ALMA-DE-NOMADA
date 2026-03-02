import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { GuideCheckoutButton } from "@/components/guide-checkout-button";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/store-utils";

export const dynamic = "force-dynamic";

type Params = {
  slug: string;
};

async function getGuide(slug: string) {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return {
      title: "Guía no encontrada | ALMA DE NÓMADA",
    };
  }

  return {
    title: `${guide.title} | ALMA DE NÓMADA`,
    description:
      guide.short_description ??
      "Guía digital para planificar tu viaje de forma clara y accionable.",
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    notFound();
  }

  const galleryImages = Array.isArray(guide.gallery_images)
    ? guide.gallery_images.filter((entry: unknown): entry is string => typeof entry === "string")
    : [];
  const stock = Number(guide.stock ?? 0);
  const isOutOfStock = stock <= 0;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pb-16 pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted">
              <img
                src={guide.image_url}
                alt={guide.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Guía digital
            </p>
            <h1 className="mt-3 text-4xl font-semibold uppercase leading-[0.95] text-foreground md:text-5xl">
              {guide.title}
            </h1>
            {guide.short_description ? (
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {guide.short_description}
              </p>
            ) : null}
            <p className="mt-6 text-3xl font-semibold text-foreground">
              {formatPrice(guide.price_cents, guide.currency)}
            </p>
            <p
              className={`mt-3 text-sm font-medium ${
                isOutOfStock ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {isOutOfStock ? "Agotado" : `Stock disponible: ${stock}`}
            </p>
            <div className="mt-8">
              <GuideCheckoutButton
                productId={guide.id}
                label="Comprar guía"
                disabled={isOutOfStock}
              />
            </div>
            {isOutOfStock ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Esta guía no tiene stock ahora mismo. Puedes revisarla más tarde.
              </p>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Pago seguro con Stripe. Recibirás acceso inmediato tras la compra.
              </p>
            )}

            <div className="mt-8 border-t border-border pt-6">
              <Link
                href="/#guias"
                className="text-sm font-medium text-foreground underline underline-offset-4"
              >
                Volver a guías
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Qué incluye esta guía
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
            {guide.description ??
              "Itinerario detallado, presupuesto orientativo, apps recomendadas, consejos locales y pasos accionables para organizar tu viaje con claridad."}
          </p>
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <section className="px-6 pb-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Galería de la guía
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {galleryImages.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
                >
                  <img
                    src={image}
                    alt={`${guide.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FooterSection />
    </main>
  );
}

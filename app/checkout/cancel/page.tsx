import Link from "next/link";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center px-6 pt-28 md:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center md:p-12">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Pago cancelado
          </p>
          <h1 className="mt-3 text-4xl font-semibold uppercase text-foreground md:text-5xl">
            No se completó la compra
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            No te preocupes, no se ha realizado ningún cargo. Puedes volver a la
            guía cuando quieras y finalizar el pago más tarde.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guias"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Volver a guías
            </Link>
            <Link
              href="/"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}

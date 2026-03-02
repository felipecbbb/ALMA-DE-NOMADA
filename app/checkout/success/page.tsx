import Link from "next/link";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center px-6 pt-28 md:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center md:p-12">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Pago confirmado
          </p>
          <h1 className="mt-3 text-4xl font-semibold uppercase text-foreground md:text-5xl">
            Gracias por tu compra
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Tu pedido se ha procesado correctamente. Te enviaremos por correo un
            enlace y un codigo de descarga para tu guia digital. Si tienes
            cualquier duda, escribenos a{" "}
            <a className="underline" href="mailto:almadenomad@gmail.com">
              almadenomad@gmail.com
            </a>
            .
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guias"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Ver más guías
            </Link>
            <Link
              href="/descargar"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground"
            >
              Descargar compra
            </Link>
            <Link
              href="/"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}

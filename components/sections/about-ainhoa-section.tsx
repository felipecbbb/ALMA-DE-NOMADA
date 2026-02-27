"use client";

export function AboutAinhoaSection() {
  return (
    <section id="quienes-somos" className="bg-background px-6 py-24 md:px-12 md:py-28 lg:px-20 lg:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl md:mx-0 md:max-w-md">
          <img
            src="/about-ainhoa-whatsapp-2026-02-27.jpg"
            alt="Ainhoa García - Alma de Nómada"
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quiénes somos</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Hola, soy Ainhoa.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Soy travel coach y fundadora de Alma de Nómada. Después de vivir mi propia experiencia migrando y
            viajando, acompaño a personas que quieren organizar su próxima aventura con un plan realista y claro.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Mi enfoque combina estrategia práctica y acompañamiento cercano: destino ideal, trámites, presupuesto y
            preparación mental para que tomes decisiones con seguridad y confianza.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://calendly.com/ainhhgarcia"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-secondary"
            >
              Reserva una llamada
            </a>
            <a
              href="https://www.instagram.com/almadenomad/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-muted"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

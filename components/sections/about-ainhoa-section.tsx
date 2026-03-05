"use client";

export function AboutAinhoaSection() {
  return (
    <section id="quienes-somos" className="bg-background px-6 py-14 md:px-12 md:py-28 lg:px-20 lg:py-32">
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
          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            Hola, soy Ainhoa: viajar me cambió la vida.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Y ahora ayudo a otras personas a diseñar la suya en cualquier parte del mundo.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Soy travel coach y fundadora de Alma de Nómada. Después de vivir mi propia experiencia migrando y
            viajando, entendí que no se trata solo de elegir un destino, sino de crear una etapa que tenga sentido.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Acompaño a personas que sienten que quieren algo más: una temporada fuera, un cambio, una aventura con
            propósito. Juntas transformamos la idea en un plan claro, estratégico y alineado contigo.
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Porque viajar no es escapar. Es expandirte.
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

export function NewsletterSection() {
  return (
    <section id="newsletter" className="bg-secondary px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-4xl">
          Únete a la comunidad
        </h2>
        <p className="mt-4 text-base text-white/70">
          Recibe consejos de viaje, destinos nuevos y ofertas exclusivas directamente en tu bandeja de entrada.
        </p>

        <form
          method="POST"
          action="https://panel.kujme.es/api/public/subscribe"
          className="mx-auto mt-10 flex max-w-md flex-col gap-4"
        >
          <input type="hidden" name="tenant" value="ainhoooagarcia28" />
          <input type="hidden" name="project" value="alma-de-nomada" />
          <input type="hidden" name="source" value="newsletter-home" />
          <input
            type="email"
            name="email"
            required
            placeholder="Tu email"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="text"
            name="first_name"
            placeholder="Tu nombre (opcional)"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}

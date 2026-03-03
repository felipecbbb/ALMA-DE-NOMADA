"use client";

const partners = [
  {
    name: "IATI SEGUROS",
    logo: "https://almadenomada.com/cdn/shop/t/5/assets/logo-iati-flat-orange.svg?v=103646652425050645201769101746",
    href: "https://www.iatiseguros.com/?r=46492105736708",
    discount: "10 % dto.",
    description: "Seguro de viaje recomendado para moverte con más tranquilidad.",
  },
  {
    name: "HOLAFLY",
    logo: "https://almadenomada.com/cdn/shop/t/5/assets/holafly_principal.svg?v=95146794696988832201769101753",
    href: "https://esim.holafly.com/?irclickid=3A5QomSSfxycUzgxaS1LvWC5UkpSUH1HlxBEU80&discount=ainhhgarcia&utm_source=affiliate&utm_medium=Ainhoa%20Garcia%20Rey&utm_campaign=6841836&irgwc=1&afsrc=1&tw_source=impact&tw_campaign=6841836&tw_term=2006335",
    discount: "5 % dto.",
    description: "eSIM internacional con descuento para viajar conectado desde el primer día.",
  },
];

export function EditorialSection() {
  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Partners
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
          Descuentos exclusivos con nuestros partners
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Ahorra en tu seguro de viaje y conectividad con partners que usamos y recomendamos.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-muted p-2">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">{partner.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {partner.discount}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{partner.description}</p>
              </div>
              <span className="hidden flex-shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 md:block">
                &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

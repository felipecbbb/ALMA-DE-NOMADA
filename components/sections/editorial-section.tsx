"use client";

const partners = [
  {
    name: "HOLAFLY",
    logo: "https://almadenomada.com/cdn/shop/t/5/assets/holafly_principal.svg?v=95146794696988832201769101753",
    href: "https://esim.holafly.com/?irclickid=3A5QomSSfxycUzgxaS1LvWC5UkpSUH1HlxBEU80&discount=ainhhgarcia&utm_source=affiliate&utm_medium=Ainhoa%20Garcia%20Rey&utm_campaign=6841836&irgwc=1&afsrc=1&tw_source=impact&tw_campaign=6841836&tw_term=2006335",
    description: "eSIM internacional con descuento para viajar conectado desde el primer dia.",
  },
  {
    name: "IATI SEGUROS",
    logo: "https://almadenomada.com/cdn/shop/t/5/assets/logo-iati-flat-orange.svg?v=103646652425050645201769101746",
    href: "https://www.iatiseguros.com/?r=46492105736708",
    description: "Seguro de viaje recomendado para moverte con mas tranquilidad.",
  },
];

export function EditorialSection() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="px-6 py-20 text-center md:px-12 md:py-24 lg:px-20">
        <h2 className="text-4xl font-medium uppercase tracking-wider text-primary md:text-6xl">
          Descuentos exclusivos
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-secondary-foreground/85">
          Ahorra en tu seguro de viaje y conectividad con partners recomendados.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {partners.map((partner) => (
            <article
              key={partner.name}
              className="rounded-2xl bg-white p-6 text-center text-foreground shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mx-auto flex h-20 w-full items-center justify-center md:h-24">
                <img src={partner.logo} alt={partner.name} className="h-full w-full object-contain" loading="lazy" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold">{partner.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
              <a
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-secondary"
              >
                Ver descuentos
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://almadenomada.com/cdn/shop/videos/c/vp/b04b9e96f33a42878b3d61ea1e7ec3d0/b04b9e96f33a42878b3d61ea1e7ec3d0.HD-1080p-7.2Mbps-67097679.mp4?v=0"
        />
      </div>
    </section>
  );
}

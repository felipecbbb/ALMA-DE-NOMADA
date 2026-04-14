"use client";

import Image from "next/image";

type Partner = {
  name: string;
  logo?: string;
  href: string;
  discount: string;
  description: string;
};

const partners: Partner[] = [
  {
    name: "IATI SEGUROS",
    logo: "/logos/logo-iati-flat-orange.svg",
    href: "https://www.iatiseguros.com/?r=46492105736708",
    discount: "10 % dto.",
    description: "Seguro de viaje recomendado para moverte con más tranquilidad.",
  },
  {
    name: "HOLAFLY",
    logo: "/logos/holafly_principal.svg",
    href: "https://esim.holafly.com/?irclickid=3A5QomSSfxycUzgxaS1LvWC5UkpSUH1HlxBEU80&discount=ainhhgarcia&utm_source=affiliate&utm_medium=Ainhoa%20Garcia%20Rey&utm_campaign=6841836&irgwc=1&afsrc=1&tw_source=impact&tw_campaign=6841836&tw_term=2006335",
    discount: "5 % dto.",
    description: "eSIM internacional con descuento para viajar conectado desde el primer día.",
  },
  {
    name: "CHAPKA",
    logo: "/logos/chapka.png",
    href: "https://www.chapkadirect.es/index.php?action=produit&id=941&app=pablocarmona",
    discount: "Dto. exclusivo",
    description: "Seguro de viaje con coberturas amplias para estancias largas y mochileros.",
  },
  {
    name: "HEYMONDO",
    logo: "/logos/heymondo.svg",
    href: "https://heymondo.es/?utm_medium=Afiliado&utm_source=PABLOCARMONA&utm_campaign=PRINCIPAL&cod_descuento=PABLOCARMONA&ag_campaign=ENTRADA&agencia=8pCoM26RdmHRWf6yxnSRjZImoSk7puFo3RpaxUGJ",
    discount: "Dto. exclusivo",
    description: "Seguro de viaje con app 24/7 y asistencia médica en cualquier parte del mundo.",
  },
];

export function EditorialSection() {
  return (
    <section className="bg-secondary px-6 py-16 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Partners
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          Descuentos exclusivos con nuestros partners
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white/70">
          Ahorra en tu seguro de viaje y conectividad con partners que usamos y recomendamos.
        </p>

        {/* Featured discount banner */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 via-white/5 to-white/10 p-8 backdrop-blur-sm md:p-10">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-lg md:h-24 md:w-24">
              <Image
                src="/logo-alma.png"
                alt="Alma de Nómada"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col items-center gap-3 md:flex-row">
                <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white">
                  10 % descuento
                </span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-white md:text-2xl">
                Tu primera reserva con Alma de Nómada
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                Reserva tu primera asesoría personalizada y obtén un 10&nbsp;% de descuento.
                Empieza a planificar tu viaje o tu nueva vida con el acompañamiento que necesitas.
              </p>
              <a
                href="https://calendly.com/ainhhgarcia"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              >
                Reserva con descuento
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-center text-[0.65rem] font-bold uppercase tracking-tight text-primary">
                    {partner.name}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-white">{partner.name}</h3>
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                    {partner.discount}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/60">{partner.description}</p>
              </div>
              <span className="hidden flex-shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 md:block">
                &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

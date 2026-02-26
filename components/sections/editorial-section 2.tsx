"use client";

const specs = [
  {
    label: "Partner",
    value: "HOLAFLY",
    href: "https://esim.holafly.com/?irclickid=3A5QomSSfxycUzgxaS1LvWC5UkpSUH1HlxBEU80&discount=ainhhgarcia&utm_source=affiliate&utm_medium=Ainhoa%20Garcia%20Rey&utm_campaign=6841836&irgwc=1&afsrc=1&tw_source=impact&tw_campaign=6841836&tw_term=2006335",
  },
  {
    label: "Partner",
    value: "IATI SEGUROS",
    href: "https://www.iatiseguros.com/?r=46492105736708",
  },
  {
    label: "Reserva",
    value: "Calendly",
    href: "https://calendly.com/ainhhgarcia",
  },
  {
    label: "Comunidad",
    value: "@almadenomad",
    href: "https://www.instagram.com/almadenomad/",
  },
];

export function EditorialSection() {
  return (
    <section className="bg-background">
      {/* Heading */}
      <div className="px-6 pt-20 pb-12 text-center md:px-12 lg:px-20">
        <h2 className="text-4xl md:text-6xl font-medium uppercase tracking-wider text-primary">
          Descuentos exclusivos
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
          Ahorra en conectividad, seguros y recursos clave para organizar tu viaje.
        </p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="border-b border-r border-border p-8 text-center last:border-r-0 md:border-b-0"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {spec.label}
            </p>
            {spec.href ? (
              <a
                href={spec.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground text-2xl md:text-3xl hover:text-primary transition-colors"
              >
                {spec.value}
              </a>
            ) : (
              <p className="font-medium text-foreground text-2xl md:text-3xl">{spec.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Full-width Video */}
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

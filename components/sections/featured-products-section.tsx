"use client";

import { FadeImage } from "@/components/fade-image";

const features = [
  {
    title: "Thailand",
    description: "Playas y cultura",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/thailandia.jpeg?v=131009810260977809441769101746",
    summary: "Ruta equilibrada entre islas, norte y ciudad según tu estilo de viaje.",
  },
  {
    title: "Sri Lanka",
    description: "Naturaleza y surf",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/sir%20lanka.jpeg?v=60339183477933206391769101746",
    summary: "Itinerario flexible para combinar playas, montaña y presupuesto realista.",
  },
  {
    title: "Japan",
    description: "Urbano y tradicional",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/japon.jpeg?v=69856797805187058121769101746",
    summary: "Plan por zonas, transporte y tiempos para aprovechar al máximo cada etapa.",
  },
  {
    title: "Australia",
    description: "Working holiday",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/autralia.jpeg?v=95094110439352087451769101751",
    summary: "Estrategia para llegada, primeros trámites y adaptación a tu nueva rutina.",
  },
  {
    title: "New Zealand",
    description: "Roadtrip y naturaleza",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/new%20zealand.jpeg?v=23240636594380725261769101745",
    summary: "Recorrido pensado para distancias reales, clima y estacionalidad.",
  },
  {
    title: "Maldives",
    description: "Viaje premium",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/maldivas.jpeg?v=48811264592296444881769101747",
    summary: "Consejos para elegir isla, traslados y presupuesto sin sorpresas.",
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="destinos" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          ¿En qué destinos puedo ayudarte?
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground uppercase tracking-widest">
          Destinos
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3 className="text-foreground text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Link */}
      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20">
        
      </div>
    </section>
  );
}

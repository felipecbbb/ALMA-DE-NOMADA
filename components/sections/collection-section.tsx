"use client";

import { FadeImage } from "@/components/fade-image";

const guides = [
  {
    id: 1,
    name: "GUIA DE BALI",
    description: "Itinerario por zonas, transporte, presupuesto y recomendaciones practicas.",
    price: "13 EUR",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/GUIA%20BALI.jpeg?v=165168668847227153021769101751",
    href: "https://almadenomada.com/cart/46588947595458:1",
  },
  {
    id: 2,
    name: "GUIA DE AUSTRALIA",
    description: "Guia practica para planificar tu llegada, visado y primeros tramites.",
    price: "13 EUR",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/GUIA%20AUSTRALIA.jpeg?v=21027950027759913761769101750",
    href: "https://almadenomada.com/cart/46588947562690:1",
  },
];

export function CollectionSection() {
  return (
    <section id="guias" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Guias digitales
        </h2>
      </div>

      {/* Accessories Grid/Carousel */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {guides.map((guide) => (
            <a
              key={guide.id}
              href={guide.href}
              target="_blank"
              rel="noreferrer"
              className="group flex-shrink-0 w-[75vw] snap-center"
            >
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={guide.image || "/placeholder.svg"}
                  alt={guide.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {guide.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {guide.price}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 md:px-12 lg:px-20">
          {guides.map((guide) => (
            <a
              key={guide.id}
              href={guide.href}
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={guide.image || "/placeholder.svg"}
                  alt={guide.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {guide.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                  <span className="font-medium text-foreground text-2xl">
                    {guide.price}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { FadeImage } from "@/components/fade-image";

const features = [
  {
    title: "🇹🇭 Thailand",
    description: "Templos, selva y mar turquesa",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/thailandia.jpeg?v=131009810260977809441769101746",
    summary:
      "Viaja entre templos dorados, selvas y aguas turquesa en una ruta diseñada para que vivas la esencia de Tailandia con intención y libertad.",
  },
  {
    title: "🇱🇰 Sri Lanka",
    description: "Surf, selva y espiritualidad",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/sir%20lanka.jpeg?v=60339183477933206391769101746",
    summary:
      "Una isla donde el surf, la selva y la espiritualidad se encuentran. Descubre Sri Lanka a tu ritmo, con un itinerario que fluye contigo.",
  },
  {
    title: "🇯🇵 Japan",
    description: "Tradición y vanguardia",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/japon.jpeg?v=69856797805187058121769101746",
    summary:
      "Tradición y vanguardia en equilibrio perfecto. Explora Japón con un recorrido pensado para que cada día se sienta único e inolvidable.",
  },
  {
    title: "🇦🇺 Australia",
    description: "Nueva vida con estrategia",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/autralia.jpeg?v=95094110439352087451769101751",
    summary:
      "Empieza tu nueva vida al otro lado del mundo con claridad, confianza y una estrategia que te permita construir tu propio camino.",
  },
  {
    title: "🇳🇿 New Zealand",
    description: "Roadtrip consciente",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/new%20zealand.jpeg?v=23240636594380725261769101745",
    summary:
      "Carreteras infinitas, montañas dramáticas y lagos imposibles. Vive Nueva Zelanda como una aventura consciente y bien planificada.",
  },
  {
    title: "🇲🇻 Maldives",
    description: "Calma y paraíso",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/maldivas.jpeg?v=48811264592296444881769101747",
    summary:
      "Aguas cristalinas, arena blanca y calma absoluta. Organiza tu viaje a Maldivas para disfrutar el paraíso sin preocupación.",
  },
  {
    title: "🇻🇳 Vietnam",
    description: "Ruta cultural y naturaleza",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/vietnam.jpeg?v=35700450405453791711769101746",
    summary:
      "Descubre Vietnam entre arrozales, ciudades vibrantes y paisajes únicos con un recorrido pensado para viajar con intención.",
  },
  {
    title: "🇵🇭 Filipinas",
    description: "Islas, playas y aventura",
    image: "/IMG_1343.jpg",
    summary:
      "Vive Filipinas entre islas paradisíacas, mar cristalino y experiencias locales para una aventura auténtica y bien planificada.",
  },
  {
    title: "🇮🇩 Indonesia",
    description: "Templos, volcanes y océano",
    image: "https://almadenomada.com/cdn/shop/t/5/assets/lombok.jpeg?v=173855469035230574911769101747",
    summary:
      "Explora Indonesia a tu ritmo entre cultura, naturaleza y playas espectaculares con una guía clara para organizar cada etapa.",
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="destinos" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-14 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          ¿En qué destinos podemos ayudarte?
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
      <div className="flex justify-center px-6 pb-16 md:px-12 md:pb-28 lg:px-20">
        
      </div>
    </section>
  );
}

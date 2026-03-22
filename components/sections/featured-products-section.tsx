"use client";

import { FadeImage } from "@/components/fade-image";

const features = [
  {
    title: "🇹🇭 Tailandia",
    description: "Templos y selva",
    image: "/destinations/tailandia.jpg",
    objectPosition: "center 70%",
    summary:
      "Viaja entre templos dorados, selvas y aguas turquesa en una ruta diseñada para que vivas la esencia de Tailandia con intención y libertad.",
  },
  {
    title: "🇱🇰 Sri Lanka",
    description: "Surf, selva y espiritualidad",
    image: "/destinations/sri-lanka.jpg",
    summary:
      "Una isla donde el surf, la selva y la espiritualidad se encuentran. Descubre Sri Lanka a tu ritmo, con un itinerario que fluye contigo.",
  },
  {
    title: "🇯🇵 Japón",
    description: "Tradición y vanguardia",
    image: "/destinations/japon.jpg",
    summary:
      "Tradición y vanguardia en equilibrio perfecto. Explora Japón con un recorrido pensado para vivirlo desde dentro.",
  },
  {
    title: "🇦🇺 Australia",
    description: "Nueva vida con estrategia",
    image: "/destinations/australia.jpg",
    summary:
      "Empieza tu nueva vida al otro lado del mundo con claridad, confianza y una estrategia que te permita construir tu propio camino.",
  },
  {
    title: "🇳🇿 Nueva Zelanda",
    description: "Roadtrip consciente",
    image: "/destinations/new-zealand.jpg",
    summary:
      "Carreteras infinitas, montañas dramáticas y lagos imposibles. Vive Nueva Zelanda como una aventura consciente y bien planificada.",
  },
  {
    title: "🇲🇻 Maldivas",
    description: "Calma y paraíso",
    image: "/destinations/maldives.jpg",
    objectPosition: "center 70%",
    summary:
      "Aguas cristalinas, arena blanca y calma absoluta. Organiza tu viaje a Maldivas para disfrutar el paraíso sin preocupación.",
  },
  {
    title: "🇻🇳 Vietnam",
    description: "Ruta cultural y naturaleza",
    image: "/destinations/vietnam.jpg",
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
    image: "/destinations/lombok.jpg",
    objectPosition: "center 70%",
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
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-2 md:grid-cols-3 md:px-12 lg:grid-cols-3 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
                style={feature.objectPosition ? { objectPosition: feature.objectPosition } : undefined}
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

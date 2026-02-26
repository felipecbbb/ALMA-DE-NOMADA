"use client";

import Image from "next/image";

export function TestimonialsSection() {
  return (
    <section id="legal" className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Politica de privacidad, terminos y condiciones y aviso legal disponibles para que tomes decisiones con total
          transparencia. El servicio es informativo, orientativo y de acompanamiento. Responsable: Ainhoa Garcia.
          Contacto: almadenomad@gmail.com.
        </p>
      </div>

      {/* About Image */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src="https://almadenomada.com/cdn/shop/t/5/assets/autralia.jpeg?v=95094110439352087451769101751"
          alt="Australia landscape"
          fill
          className="object-cover"
        />
        {/* Fade gradient overlay - white at bottom fading to transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  );
}

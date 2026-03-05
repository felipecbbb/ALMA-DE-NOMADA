"use client";

import Image from "next/image";

export function TestimonialsSection() {
  return (
    <section id="legal" className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-14 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <p className="max-w-5xl text-left text-xl leading-relaxed text-foreground md:text-2xl lg:text-3xl lg:leading-snug">
          Política de privacidad, términos y condiciones y aviso legal disponibles para que tomes decisiones con total
          transparencia. El servicio es informativo, orientativo y de acompañamiento.
        </p>
        <p className="mt-4 max-w-5xl text-left text-sm leading-relaxed text-muted-foreground md:text-base">
          Responsable: Ainhoa García.<br />Contacto: almadenomad@gmail.com.
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

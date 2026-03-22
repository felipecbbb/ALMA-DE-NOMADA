"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function PhilosophySection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100);
  const [forestTranslateX, setForestTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    if (isMobile) {
      setAlpineTranslateX(0);
      setForestTranslateX(0);
      setTitleOpacity(1);
      return;
    }
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    // Calculate progress based on scroll position
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    // Alpine comes from left (-100% to 0%)
    setAlpineTranslateX((1 - progress) * -100);
    
    // Forest comes from right (100% to 0%)
    setForestTranslateX((1 - progress) * 100);
    
    // Title fades out as blocks come together
    setTitleOpacity(1 - progress);
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransforms]);

  return (
    <section id="australia" className="bg-background">
      {/* Scroll-Animated Product Grid */}
      <div ref={sectionRef} className="relative" style={{ height: isMobile ? "125vh" : "200vh" }}>
        <div className="sticky top-0 flex h-[88svh] items-center justify-center md:h-screen">
          <div className="relative w-full">
            {/* Title - static on mobile, animated overlay on desktop */}
            <h2
              className="mb-6 px-6 text-center text-[8vw] font-medium leading-[0.95] tracking-tighter text-foreground md:hidden"
            >
              ¿Cómo venir a Australia?
            </h2>
            <div
              className="absolute inset-0 hidden items-center justify-center pointer-events-none z-0 md:flex"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-[8.8vw] font-medium leading-[0.95] tracking-tighter text-foreground lg:text-[6.8vw] text-center px-6">
                ¿Cómo venir a Australia?
              </h2>
            </div>

            {/* Product Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Alpine Image - comes from left */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${alpineTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${alpineTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src="/destinations/australia.jpg"
                  alt="Australia"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Forest Image - comes from right */}
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${forestTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${forestTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src="/tramites-claros-ainhoa.jpg"
                  alt="Asesoría personalizada"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-14 md:px-12 md:py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Asesoría personalizada para Australia
          </p>
          <p className="mt-6 text-justify text-xl leading-relaxed text-muted-foreground md:mt-8 md:text-3xl">
            Gracias a mi experiencia viviendo en Australia, transformaremos tus dudas en un plan personalizado con una
            acción clara. Acompañándote a dar tus primeros pasos: ciudad, trámites y visados para darte seguridad,
            confianza y sin estrés.
          </p>
          <a
            href="https://calendly.com/ainhhgarcia/nueva-reunion?back=1&month=2026-01"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-secondary"
          >
            Reserva tu asesoría
          </a>
        </div>
      </div>
    </section>
  );
}

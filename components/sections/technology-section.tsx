"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function ScrollRevealText({ text, fullyVisible = false }: { text: string; fullyVisible?: boolean }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (fullyVisible) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.1;

      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;

      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fullyVisible]);

  const words = text.split(" ");

  return (
    <p
      ref={containerRef}
      className="text-justify text-base font-semibold leading-relaxed sm:text-lg md:text-xl lg:text-2xl"
    >
      {words.map((word, index) => {
        const wordProgress = index / words.length;
        const isRevealed = progress > wordProgress;
        const isItalic = word.startsWith("*") || word.endsWith("*");
        const cleanWord = word.replace(/\*/g, "");

        return (
          <span
            key={index}
            className="transition-colors duration-150"
            style={{
              color: isRevealed ? "var(--foreground)" : "#c9beaa",
              fontStyle: isItalic ? "italic" : undefined,
            }}
          >
            {cleanWord}{index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

export function TechnologySection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textProgress, setTextProgress] = useState(0);

  const descriptionText =
    "Cambiar de país o planear una nueva aventura requiere algo más que motivación, *requiere *claridad. Esta asesoría te ayuda a ordenar ideas, tomar decisiones con seguridad y construir un plan sólido que te permita disfrutar el proceso desde el inicio. Porque cuando tienes dirección, todo fluye diferente.";
  const planningSteps = [
    {
      id: "01",
      title: "DESTINO IDEAL",
      description: "Te ayudamos a encontrar tu destino y tipo de experiencia que mejor encaje contigo y tu momento de vida.",
    },
    {
      id: "02",
      title: "TRÁMITES CLAROS",
      description: "Resuelve tus dudas sobre visados, documentación y planificación sin estrés ni confusión.",
    },
    {
      id: "03",
      title: "MENTALIDAD",
      description: "Prepárate para el cambio, gestiona tus miedos y da el salto con seguridad y confianza.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * (isMobile ? 0.5 : 1);
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      setScrollProgress(progress);
      if (isMobile) {
        setTextProgress(1);
        return;
      }

      if (textSectionRef.current) {
        const textRect = textSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const startOffset = windowHeight * 0.9;
        const endOffset = windowHeight * 0.1;

        const totalDistance = startOffset - endOffset;
        const currentPosition = startOffset - textRect.top;

        const newTextProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
        setTextProgress(newTextProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  const grayscaleAmount = Math.round((1 - textProgress) * 100);

  return (
    <section ref={sectionRef} id="planeando" className="relative bg-secondary">
      {/* Static full-bleed image with fading title */}
      <div className="relative h-[72svh] overflow-hidden md:sticky md:top-0 md:h-screen">
        <Image
          src="/IMG_1343.jpg"
          alt="Plan de viaje"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-secondary/45" />

        {/* Title Text - Fades out word by word with blur */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-white md:text-5xl lg:text-7xl">
            {["¿Estás", "planeando", "viajar?"].map((word, index) => {
              const wordFadeStart = isMobile ? 999 : index * 0.08;
              const wordFadeEnd = wordFadeStart + 0.08;
              const wordProgress = Math.max(0, Math.min(1, (scrollProgress - wordFadeStart) / (wordFadeEnd - wordFadeStart)));
              const wordOpacity = 1 - wordProgress;
              const wordBlur = wordProgress * 10;

              return (
                <span
                  key={index}
                  className="inline-block"
                  style={{
                    opacity: wordOpacity,
                    filter: `blur(${wordBlur}px)`,
                    transition: 'opacity 0.1s linear, filter 0.1s linear',
                    marginRight: index < 2 ? '0.3em' : '0',
                  }}
                >
                  {word}
                  {index === 1 && <br />}
                </span>
              );
            })}
          </h2>
        </div>
      </div>

      {/* Scroll space for the fade animation */}
      <div style={{ height: isMobile ? "0" : "100vh" }} />

      {/* Description Section with Background Image and Scroll Reveal */}
      <div
        ref={textSectionRef}
        className="relative overflow-hidden bg-background px-6 py-14 md:px-12 md:py-32 lg:px-20 lg:py-40"
      >
        <div
          className="absolute inset-0"
          style={{
            filter: `grayscale(${grayscaleAmount}%)`,
            transition: "filter 0.3s ease-out",
          }}
        >
          <Image
            src="https://almadenomada.com/cdn/shop/t/5/assets/new%20zealand.jpeg?v=23240636594380725261769101745"
            alt="Aventura"
            fill
            className="object-cover opacity-10"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollRevealText text={descriptionText} fullyVisible={isMobile} />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {planningSteps.map((step) => (
              <article
                key={step.id}
                className="flex h-full flex-col items-start rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="text-5xl font-medium leading-none text-primary/20">{step.id}</p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <a
              href="https://calendly.com/ainhhgarcia/30min?back=1&month=2026-01"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-secondary"
            >
              Reserva tu asesoría
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

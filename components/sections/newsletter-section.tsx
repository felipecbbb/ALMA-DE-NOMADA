"use client";

import { useEffect, useRef } from "react";

export function NewsletterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Avoid duplicate scripts
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://panel.kujme.es/api/public/widget.js?v=20260226&success=Te+has+suscrito+correctamente.&exists=Este+email+ya+esta+registrado+en+la+newsletter.&error=No+se+pudo+completar+la+suscripcion.";
    script.setAttribute("data-endpoint", "https://panel.kujme.es/api/public/subscribe");
    script.setAttribute("data-tenant", "feseoo");
    script.setAttribute("data-project", "entre-olas-surf-school");
    script.setAttribute("data-source", "newsletter-home");
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return (
    <section id="newsletter" className="bg-secondary px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-4xl">
          Únete a la comunidad
        </h2>
        <p className="mt-4 text-base text-white/70">
          Recibe consejos de viaje, destinos nuevos y ofertas exclusivas directamente en tu bandeja de entrada.
        </p>

        {/* Widget container */}
        <div ref={containerRef} className="mt-10 [&_form]:mx-auto [&_form]:flex [&_form]:max-w-md [&_form]:flex-col [&_form]:gap-4 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:px-4 [&_input]:py-3 [&_input]:text-sm [&_input]:text-white [&_input]:placeholder-white/50 [&_input]:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-white/30 [&_button]:w-full [&_button]:rounded-full [&_button]:bg-primary [&_button]:py-4 [&_button]:text-sm [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-widest [&_button]:text-white [&_button]:transition-opacity [&_button]:hover:opacity-90 [&_.success]:mt-4 [&_.success]:text-sm [&_.success]:text-emerald-300 [&_.error]:mt-4 [&_.error]:text-sm [&_.error]:text-red-300" />
      </div>
    </section>
  );
}

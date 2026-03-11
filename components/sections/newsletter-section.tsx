"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "exists" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const body = new URLSearchParams({
        tenant: "ainhoooagarcia28",
        project: "alma-de-nomada",
        source: "newsletter-home",
        email,
        first_name: name,
      });

      const res = await fetch("https://panel.kujme.es/api/public/subscribe", {
        method: "POST",
        body,
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
      } else if (res.status === 409) {
        setStatus("exists");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="newsletter" className="bg-secondary px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-4xl">
          Únete a la comunidad
        </h2>
        <p className="mt-4 text-base text-white/70">
          Recibe consejos de viaje, destinos nuevos y ofertas exclusivas directamente en tu bandeja de entrada.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? "Enviando..." : "Suscribirme"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-emerald-300">Te has suscrito correctamente.</p>
        )}
        {status === "exists" && (
          <p className="mt-4 text-sm text-amber-300">Este email ya está registrado en la newsletter.</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-300">No se pudo completar la suscripción. Inténtalo de nuevo.</p>
        )}
      </div>
    </section>
  );
}

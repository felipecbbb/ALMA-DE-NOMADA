"use client";

import { useRef, useState } from "react";

export function NewsletterSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setMsg(null);
    setSending(true);

    try {
      const r = await fetch("https://panel.kujme.es/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: "alma-de-nomada",
          tenant: "ainhoooagarcia28",
          source: "newsletter-home",
          email: (f.elements.namedItem("email") as HTMLInputElement).value,
          first_name: (f.elements.namedItem("first_name") as HTMLInputElement).value,
        }),
      });

      const data = await r.json();

      if (r.ok && data.ok) {
        setMsg({ text: "Te has suscrito correctamente.", color: "text-emerald-300" });
        f.reset();
      } else if (r.status === 409) {
        setMsg({ text: data.message || "Este email ya está registrado.", color: "text-amber-300" });
      } else {
        setMsg({ text: data.error || "Error al suscribirse.", color: "text-red-300" });
      }
    } catch {
      setMsg({ text: "Error de conexión.", color: "text-red-300" });
    } finally {
      setSending(false);
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

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-md flex-col gap-4"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Tu email"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="text"
            name="first_name"
            placeholder="Tu nombre (opcional)"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Enviando..." : "Suscribirme"}
          </button>

          {msg && <p className={`mt-1 text-sm ${msg.color}`}>{msg.text}</p>}
        </form>
      </div>
    </section>
  );
}

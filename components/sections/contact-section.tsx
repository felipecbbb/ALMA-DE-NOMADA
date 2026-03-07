"use client";

import { useState } from "react";
import { Mail, Instagram, MapPin } from "lucide-react";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error");
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contacto" className="bg-background px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left column */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold uppercase leading-tight tracking-tight text-secondary md:text-5xl">
            Hablemos de tu próximo viaje
          </h2>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            ¿Tienes dudas o quieres un paquete a medida? Nuestro equipo de
            expertos está listo para ayudarte.
          </p>

          <hr className="my-10 border-border" />

          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Correo electrónico
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  almadenomad@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Instagram size={18} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Instagram
                </p>
                <p className="mt-1 text-sm text-muted-foreground">@almadenomad</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <MapPin size={18} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Oficinas
                </p>
                <p className="mt-1 text-sm text-muted-foreground">España / Australia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — form card */}
        <div className="rounded-2xl bg-card p-8 shadow-lg md:p-10">
          <h3 className="text-xl font-extrabold uppercase tracking-tight text-foreground">
            Envíanos un mensaje
          </h3>

          {sent ? (
            <p className="mt-6 text-sm text-emerald-700">
              ¡Mensaje enviado! Te responderemos lo antes posible.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              {error && (
                <p className="text-sm text-red-600">
                  Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.
                </p>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+34 600..."
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Hola, me gustaría información sobre el viaje a Tailandia..."
                  className="w-full resize-y rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

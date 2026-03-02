"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";

export default function DescargarPage() {
  const searchParams = useSearchParams();
  const initialToken = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams],
  );

  const [token, setToken] = useState(initialToken);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token && initialToken) {
      setToken(initialToken);
    }
  }, [initialToken, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token.trim() || !code.trim()) {
      setError("Introduce el enlace/token y el codigo de descarga.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/download/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: token.trim(), code: code.trim() }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo validar la descarga.");
      }

      const url = String(payload.url ?? "").trim();
      if (!url) {
        throw new Error("No se pudo obtener el enlace de descarga.");
      }

      setSuccessMessage("Codigo validado. Iniciando descarga...");
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="flex min-h-[72vh] items-center justify-center px-6 pt-28 md:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Descarga de guia
          </p>
          <h1 className="mt-3 text-3xl font-semibold uppercase text-foreground md:text-4xl">
            Accede a tu compra
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Introduce el token del enlace y el codigo que recibiste por correo
            para descargar tu guia digital.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Token de acceso
              </label>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Pega aqui tu token"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Codigo de descarga
              </label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Ejemplo: 123456"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Validando..." : "Descargar guia"}
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {successMessage ? (
            <p className="mt-4 text-sm text-emerald-700">{successMessage}</p>
          ) : null}
        </div>
      </section>
      <FooterSection />
    </main>
  );
}

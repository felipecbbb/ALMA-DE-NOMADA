"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CookieConsent,
  readCookieConsent,
  saveCookieConsent,
} from "@/lib/cookie-consent";

function buildConsent(
  analytics: boolean,
  marketing: boolean,
  choice: CookieConsent["choice"],
): CookieConsent {
  return {
    essential: true,
    analytics,
    marketing,
    choice,
    updatedAt: new Date().toISOString(),
  };
}

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readCookieConsent();
    if (!existing) {
      setIsOpen(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }

    const handleOpen = () => {
      const consent = readCookieConsent();
      if (consent) {
        setAnalytics(consent.analytics);
        setMarketing(consent.marketing);
      }
      setIsOpen(true);
      setShowPreferences(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpen);
    return () =>
      window.removeEventListener("open-cookie-preferences", handleOpen);
  }, []);

  const commitConsent = (consent: CookieConsent) => {
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
    saveCookieConsent(consent);
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: consent }),
    );
    setIsOpen(false);
    setShowPreferences(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[80] mx-auto w-auto max-w-3xl rounded-3xl border border-border bg-background/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm md:inset-x-6 md:p-6">
      <p className="text-base font-semibold text-foreground">
        Gestionamos cookies para ofrecerte una experiencia segura y personalizada.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Usamos cookies necesarias para el funcionamiento del sitio y, con tu
        permiso, cookies de analítica y marketing. Consulta la{" "}
        <Link href="/legal#cookies" className="font-medium text-foreground underline">
          Política de Cookies
        </Link>
        .
      </p>

      {showPreferences && (
        <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Cookies necesarias</p>
              <p className="text-xs text-muted-foreground">
                Imprescindibles para el funcionamiento del sitio.
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Siempre activas
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Cookies de analítica</p>
              <p className="text-xs text-muted-foreground">
                Nos ayudan a medir uso y mejorar contenidos.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={analytics}
              onClick={() => setAnalytics((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                analytics
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {analytics ? "Activas" : "Inactivas"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Cookies de marketing</p>
              <p className="text-xs text-muted-foreground">
                Permiten mostrar contenido y campañas personalizadas.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={marketing}
              onClick={() => setMarketing((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                marketing
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {marketing ? "Activas" : "Inactivas"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => commitConsent(buildConsent(true, true, "all"))}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Aceptar todas
        </button>
        <button
          type="button"
          onClick={() => commitConsent(buildConsent(false, false, "necessary"))}
          className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Rechazar opcionales
        </button>
        {showPreferences ? (
          <button
            type="button"
            onClick={() => commitConsent(buildConsent(analytics, marketing, "custom"))}
            className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Guardar preferencias
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowPreferences(true)}
            className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Configurar
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

type GuideCheckoutButtonProps = {
  productId: string;
  className?: string;
  label?: string;
  disabled?: boolean;
};

export function GuideCheckoutButton({
  productId,
  className,
  label = "Comprar ahora",
  disabled = false,
}: GuideCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo iniciar el checkout.");
      }

      if (!payload.url) {
        throw new Error("Stripe no devolvio URL de checkout.");
      }

      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || disabled}
        className={
          className ??
          "inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        }
      >
        {loading ? "Redirigiendo..." : disabled ? "Agotado" : label}
      </button>
      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

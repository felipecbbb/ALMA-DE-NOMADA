"use client";

import { useState } from "react";

type GuideCheckoutButtonProps = {
  productId: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  showReferralCode?: boolean;
};

export function GuideCheckoutButton({
  productId,
  className,
  label = "Comprar ahora",
  disabled = false,
  showReferralCode = false,
}: GuideCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productId,
          referralCode: referralCode.trim() || undefined,
        }),
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
      {showReferralCode ? (
        <div className="mb-4">
          <label
            htmlFor="referral-code"
            className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            ¿Te ha recomendado alguien? (opcional)
          </label>
          <input
            id="referral-code"
            type="text"
            value={referralCode}
            onChange={(event) => setReferralCode(event.target.value)}
            placeholder="Código de referido"
            className="mt-2 w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoComplete="off"
            maxLength={40}
          />
        </div>
      ) : null}
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

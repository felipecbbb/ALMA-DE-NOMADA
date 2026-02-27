"use client";

type OpenCookiePreferencesButtonProps = {
  className?: string;
  label?: string;
};

export function OpenCookiePreferencesButton({
  className,
  label = "Configurar cookies",
}: OpenCookiePreferencesButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
    >
      {label}
    </button>
  );
}

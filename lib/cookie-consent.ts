export const CONSENT_STORAGE_KEY = "alma_cookie_consent";
export const CONSENT_COOKIE_NAME = "alma_cookie_consent";
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  choice: "all" | "necessary" | "custom";
  updatedAt: string;
};

function isCookieConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.essential === true &&
    typeof candidate.analytics === "boolean" &&
    typeof candidate.marketing === "boolean" &&
    (candidate.choice === "all" ||
      candidate.choice === "necessary" ||
      candidate.choice === "custom") &&
    typeof candidate.updatedAt === "string"
  );
}

function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return isCookieConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : null;
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  const storageConsent = parseConsent(
    window.localStorage.getItem(CONSENT_STORAGE_KEY),
  );

  if (storageConsent) {
    return storageConsent;
  }

  return parseConsent(getCookieValue(CONSENT_COOKIE_NAME));
}

export function saveCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(consent);
  window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    serialized,
  )}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

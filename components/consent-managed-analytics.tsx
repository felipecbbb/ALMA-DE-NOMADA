"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { readCookieConsent } from "@/lib/cookie-consent";

export function ConsentManagedAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const consent = readCookieConsent();
      setEnabled(Boolean(consent?.analytics));
    };

    syncConsent();
    window.addEventListener("cookie-consent-updated", syncConsent);

    return () => {
      window.removeEventListener("cookie-consent-updated", syncConsent);
    };
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}

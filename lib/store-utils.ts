export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatPrice(cents: number, currency = "EUR", locale = "es-ES") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parseGalleryImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof raw === "string") {
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
}

import crypto from "node:crypto";

type SendDigitalGuideEmailParams = {
  to: string;
  productTitle: string;
  downloadUrl: string;
  downloadCode: string;
};

export function getSiteUrl() {
  return String(process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "");
}

export function generateDownloadCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function generateDownloadToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function hashDownloadCode(code: string) {
  const secret = String(process.env.DOWNLOAD_CODE_SECRET ?? "").trim();
  return crypto
    .createHash("sha256")
    .update(`${secret}:${code}`)
    .digest("hex");
}

export function isDownloadCodeValid(code: string, expectedHash: string) {
  const hash = hashDownloadCode(code);
  const left = Buffer.from(hash, "utf8");
  const right = Buffer.from(expectedHash, "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export async function sendDigitalGuideEmail({
  to,
  productTitle,
  downloadUrl,
  downloadCode,
}: SendDigitalGuideEmailParams) {
  const apiKey = String(process.env.RESEND_API_KEY ?? "").trim();
  if (!apiKey) {
    return { sent: false, skipped: true as const };
  }

  const from =
    String(process.env.ORDER_EMAIL_FROM ?? "").trim() ||
    "ALMA DE NOMADA <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Tu guia digital: ${productTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
          <h2 style="margin:0 0 12px">Gracias por tu compra</h2>
          <p>Tu guia digital ya esta lista para descargar.</p>
          <p><strong>Codigo de descarga:</strong> ${downloadCode}</p>
          <p>
            Entra aqui para descargar:
            <a href="${downloadUrl}" style="color:#0f766e">${downloadUrl}</a>
          </p>
          <p>Por seguridad, el enlace de descarga es temporal.</p>
        </div>
      `,
      text: [
        "Gracias por tu compra.",
        `Tu guia digital "${productTitle}" ya esta lista para descargar.`,
        `Codigo de descarga: ${downloadCode}`,
        `Descarga aqui: ${downloadUrl}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`No se pudo enviar el email de entrega: ${body}`);
  }

  return { sent: true as const, skipped: false as const };
}


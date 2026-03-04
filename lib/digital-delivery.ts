import crypto from "node:crypto";
import { sendOrderConfirmationEmail } from "./email";

type SendDigitalGuideEmailParams = {
  to: string;
  productTitle: string;
  downloadUrl: string;
  downloadCode: string;
  totalCents?: number;
  currency?: string;
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
  totalCents = 0,
  currency = "EUR",
}: SendDigitalGuideEmailParams) {
  const smtpUser = String(process.env.SMTP_USER ?? "").trim();
  if (!smtpUser) {
    return { sent: false, skipped: true as const };
  }

  await sendOrderConfirmationEmail({
    to,
    productTitle,
    downloadUrl,
    downloadCode,
    totalCents,
    currency,
  });

  return { sent: true as const, skipped: false as const };
}


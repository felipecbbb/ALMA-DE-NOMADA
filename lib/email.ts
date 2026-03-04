import nodemailer from "nodemailer";
import {
  orderConfirmationHtml,
  orderConfirmationText,
  newOrderNotificationHtml,
  newOrderNotificationText,
  paymentFailedHtml,
  paymentFailedText,
} from "./email-templates";

// ─── Transporter (lazy singleton) ────────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.ionos.es",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // STARTTLS on port 587
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });

  return _transporter;
}

// ─── Generic send ────────────────────────────────────────────────────────────

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const from =
    process.env.SMTP_FROM?.replace(/^"|"$/g, "") ??
    "ALMA DE NÓMADA <info@almadenomada.com>";

  const transporter = getTransporter();

  await transporter.sendMail({
    from,
    to,
    replyTo: "info@almadenomada.com",
    subject,
    html,
    ...(text ? { text } : {}),
    headers: {
      "X-Mailer": "ALMA DE NOMADA Transactional",
    },
  });

  return { sent: true as const };
}

// ─── 1. Confirmación de pedido + descarga (al cliente) ───────────────────────

type OrderConfirmationEmailParams = {
  to: string;
  productTitle: string;
  downloadUrl: string;
  downloadCode: string;
  totalCents: number;
  currency: string;
};

export async function sendOrderConfirmationEmail({
  to,
  productTitle,
  downloadUrl,
  downloadCode,
  totalCents,
  currency,
}: OrderConfirmationEmailParams) {
  const totalFormatted = `${(totalCents / 100).toFixed(2)} ${currency.toUpperCase()}`;

  return sendEmail({
    to,
    subject: `Confirmación de pedido — ${productTitle}`,
    html: orderConfirmationHtml({ productTitle, downloadUrl, downloadCode, totalFormatted }),
    text: orderConfirmationText({ productTitle, downloadUrl, downloadCode, totalFormatted }),
  });
}

// ─── 2. Notificación de nuevo pedido (al admin) ─────────────────────────────

type NewOrderNotificationEmailParams = {
  customerEmail: string;
  items: { description: string; quantity: number; amount_total: number; currency: string }[];
  totalCents: number;
  currency: string;
  stripeSessionId: string;
};

export async function sendNewOrderNotificationEmail({
  customerEmail,
  items,
  totalCents,
  currency,
  stripeSessionId,
}: NewOrderNotificationEmailParams) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "almadenomad@gmail.com";
  const totalFormatted = `${(totalCents / 100).toFixed(2)} ${currency.toUpperCase()}`;

  return sendEmail({
    to: adminEmail,
    subject: `Nuevo pedido de ${customerEmail}`,
    html: newOrderNotificationHtml({ customerEmail, items, totalFormatted, stripeSessionId }),
    text: newOrderNotificationText({ customerEmail, items, totalFormatted, stripeSessionId }),
  });
}

// ─── 3. Pago fallido (al cliente) ────────────────────────────────────────────

type PaymentFailedEmailParams = {
  to: string;
};

export async function sendPaymentFailedEmail({ to }: PaymentFailedEmailParams) {
  return sendEmail({
    to,
    subject: "Problema con tu pago — ALMA DE NÓMADA",
    html: paymentFailedHtml({ customerEmail: to }),
    text: paymentFailedText({ customerEmail: to }),
  });
}

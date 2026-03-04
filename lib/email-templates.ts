// Brand colors: verde oscuro #184038, terracota #D3623B, crema #FAF6E8

const BRAND = {
  green: "#184038",
  terracotta: "#D3623B",
  cream: "#FAF6E8",
  textDark: "#1f2937",
  textLight: "#6b7280",
} as const;

function layout(body: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ALMA DE NÓMADA</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:Arial,Helvetica,sans-serif;color:${BRAND.textDark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.green};padding:24px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:2px;">ALMA DE NÓMADA</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;text-align:center;font-size:12px;color:${BRAND.textLight};border-top:1px solid #e5e7eb;">
              &copy; ${new Date().getFullYear()} ALMA DE NÓMADA &mdash; Todos los derechos reservados.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── 1. Confirmación de pedido + descarga (al cliente) ────────────────────────

type OrderConfirmationParams = {
  productTitle: string;
  downloadUrl: string;
  downloadCode: string;
  totalFormatted: string;
};

export function orderConfirmationHtml({
  productTitle,
  downloadUrl,
  downloadCode,
  totalFormatted,
}: OrderConfirmationParams) {
  return layout(`
    <h2 style="margin:0 0 8px;color:${BRAND.green};">¡Gracias por tu compra!</h2>
    <p style="margin:0 0 20px;color:${BRAND.textLight};">Tu pedido ha sido confirmado.</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.cream};border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND.textLight};">Producto</p>
          <p style="margin:0 0 12px;font-weight:bold;">${productTitle}</p>
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND.textLight};">Total</p>
          <p style="margin:0;font-weight:bold;">${totalFormatted}</p>
        </td>
      </tr>
    </table>

    <h3 style="margin:0 0 12px;color:${BRAND.green};">Descarga tu guía digital</h3>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.cream};border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND.textLight};">Código de descarga</p>
          <p style="margin:0;font-size:24px;font-weight:bold;letter-spacing:4px;color:${BRAND.terracotta};">${downloadCode}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:${BRAND.terracotta};border-radius:6px;">
          <a href="${downloadUrl}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:bold;text-decoration:none;font-size:15px;">
            Descargar guía
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:${BRAND.textLight};">Por seguridad, el enlace de descarga es temporal. Si tienes algún problema, responde a este email.</p>
  `);
}

export function orderConfirmationText({
  productTitle,
  downloadUrl,
  downloadCode,
  totalFormatted,
}: OrderConfirmationParams) {
  return [
    "¡Gracias por tu compra en ALMA DE NÓMADA!",
    "",
    `Producto: ${productTitle}`,
    `Total: ${totalFormatted}`,
    "",
    "--- Descarga tu guía digital ---",
    `Código de descarga: ${downloadCode}`,
    `Enlace: ${downloadUrl}`,
    "",
    "Por seguridad, el enlace de descarga es temporal.",
    "Si tienes algún problema, responde a este email.",
  ].join("\n");
}

// ─── 2. Notificación de nuevo pedido (al admin) ──────────────────────────────

type NewOrderNotificationParams = {
  customerEmail: string;
  items: { description: string; quantity: number; amount_total: number; currency: string }[];
  totalFormatted: string;
  stripeSessionId: string;
};

export function newOrderNotificationHtml({
  customerEmail,
  items,
  totalFormatted,
  stripeSessionId,
}: NewOrderNotificationParams) {
  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.description}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${(item.amount_total / 100).toFixed(2)} ${item.currency}</td>
        </tr>`,
    )
    .join("");

  return layout(`
    <h2 style="margin:0 0 8px;color:${BRAND.green};">Nuevo pedido recibido</h2>
    <p style="margin:0 0 20px;color:${BRAND.textLight};">Se ha completado un nuevo pedido en la tienda.</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.cream};border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND.textLight};">Cliente</p>
          <p style="margin:0 0 12px;font-weight:bold;">${customerEmail}</p>
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND.textLight};">ID de sesión Stripe</p>
          <p style="margin:0;font-size:12px;word-break:break-all;">${stripeSessionId}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:6px;margin-bottom:16px;">
      <tr style="background-color:${BRAND.green};color:#ffffff;">
        <th style="padding:10px 12px;text-align:left;font-size:13px;">Producto</th>
        <th style="padding:10px 12px;text-align:center;font-size:13px;">Cant.</th>
        <th style="padding:10px 12px;text-align:right;font-size:13px;">Importe</th>
      </tr>
      ${itemRows}
    </table>

    <p style="margin:0;text-align:right;font-weight:bold;font-size:16px;">Total: ${totalFormatted}</p>
  `);
}

export function newOrderNotificationText({
  customerEmail,
  items,
  totalFormatted,
  stripeSessionId,
}: NewOrderNotificationParams) {
  const itemLines = items.map(
    (item) =>
      `  - ${item.description} x${item.quantity} — ${(item.amount_total / 100).toFixed(2)} ${item.currency}`,
  );

  return [
    "NUEVO PEDIDO RECIBIDO — ALMA DE NÓMADA",
    "",
    `Cliente: ${customerEmail}`,
    `Sesión Stripe: ${stripeSessionId}`,
    "",
    "Productos:",
    ...itemLines,
    "",
    `Total: ${totalFormatted}`,
  ].join("\n");
}

// ─── 3. Pago fallido (al cliente) ────────────────────────────────────────────

type PaymentFailedParams = {
  customerEmail: string;
};

export function paymentFailedHtml({ customerEmail }: PaymentFailedParams) {
  return layout(`
    <h2 style="margin:0 0 8px;color:${BRAND.terracotta};">Problema con tu pago</h2>
    <p style="margin:0 0 20px;">Hola,</p>
    <p style="margin:0 0 16px;">Lamentamos informarte de que el pago asociado a tu pedido en <strong>ALMA DE NÓMADA</strong> no se ha podido completar.</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.cream};border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND.textLight};">Email de la cuenta</p>
          <p style="margin:0;font-weight:bold;">${customerEmail}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;">Te sugerimos:</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:${BRAND.textDark};">
      <li style="margin-bottom:8px;">Verificar los datos de tu tarjeta o método de pago.</li>
      <li style="margin-bottom:8px;">Intentar de nuevo con otro método de pago.</li>
      <li>Contactarnos si el problema persiste.</li>
    </ul>

    <p style="margin:0;font-size:13px;color:${BRAND.textLight};">Si necesitas ayuda, responde a este email y te atenderemos lo antes posible.</p>
  `);
}

export function paymentFailedText({ customerEmail }: PaymentFailedParams) {
  return [
    "PROBLEMA CON TU PAGO — ALMA DE NÓMADA",
    "",
    `Hola (${customerEmail}),`,
    "",
    "Lamentamos informarte de que el pago asociado a tu pedido no se ha podido completar.",
    "",
    "Te sugerimos:",
    "  - Verificar los datos de tu tarjeta o método de pago.",
    "  - Intentar de nuevo con otro método de pago.",
    "  - Contactarnos si el problema persiste.",
    "",
    "Responde a este email si necesitas ayuda.",
  ].join("\n");
}

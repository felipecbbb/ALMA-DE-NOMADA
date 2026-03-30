import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import {
  sendOrderConfirmationEmail,
  sendNewOrderNotificationEmail,
  sendPaymentFailedEmail,
} from "./lib/email";

async function main() {
  const to = "felipegestion03@gmail.com";

  console.log("1/3 — Enviando confirmacion de pedido al cliente...");
  await sendOrderConfirmationEmail({
    to,
    productTitle: "Guia de Marruecos — ALMA DE NOMADA",
    downloadUrl: "https://almadenomada.com/descargar?token=TEST123",
    downloadCode: "482910",
    totalCents: 1990,
    currency: "EUR",
  });
  console.log("    OK");

  console.log("2/3 — Enviando notificacion de nuevo pedido al admin...");
  await sendNewOrderNotificationEmail({
    customerEmail: to,
    items: [
      {
        description: "Guia de Marruecos — ALMA DE NOMADA",
        quantity: 1,
        amount_total: 1990,
        currency: "EUR",
      },
    ],
    totalCents: 1990,
    currency: "EUR",
    stripeSessionId: "cs_test_FAKE_SESSION_ID",
  });
  console.log("    OK");

  console.log("3/3 — Enviando email de pago fallido...");
  await sendPaymentFailedEmail({ to });
  console.log("    OK");

  console.log("\nTodos los emails enviados correctamente!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

import Stripe from "stripe";

function readRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

let stripeInstance: Stripe | null = null;

export function getStripeServerClient() {
  if (stripeInstance) return stripeInstance;

  const secretKey = readRequiredEnv("STRIPE_SECRET_KEY");
  stripeInstance = new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover",
  });
  return stripeInstance;
}

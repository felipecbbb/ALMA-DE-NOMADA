export type ProductRecord = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  image_url: string;
  digital_file_path: string | null;
  gallery_images: string[] | null;
  price_cents: number;
  currency: string;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderRecord = {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  customer_email: string | null;
  status: "pending" | "paid" | "cancelled" | "refunded" | "expired";
  total_cents: number;
  currency: string;
  items: Array<{
    description: string;
    quantity: number;
    amount_total: number;
    currency: string;
  }> | null;
  metadata: Record<string, string> | null;
  download_token: string | null;
  download_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  totalRevenueCents: number;
  totalOrders: number;
  paidOrders: number;
  averageOrderValueCents: number;
  totalProducts: number;
  activeProducts: number;
};

# Setup tienda (Supabase + Stripe)

## 1) Variables de entorno (`.env.local`)

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:4173

NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

STRIPE_SECRET_KEY=sk_live_o_sk_test
STRIPE_WEBHOOK_SECRET=whsec_xxx

ADMIN_PANEL_KEY=tu_clave_admin_segura
```

## 2) Base de datos en Supabase

1. Abre el SQL Editor.
2. Ejecuta el script:
   - `supabase/schema.sql`

## 3) Stripe Webhook

En Stripe Dashboard, añade endpoint:

- URL producción: `https://tu-dominio.com/api/stripe/webhook`
- URL local (Stripe CLI): `http://localhost:4173/api/stripe/webhook`

Eventos mínimos:
- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`

## 4) Flujo final

1. Entra en `/admin`.
2. Accede con `ADMIN_PANEL_KEY`.
3. Crea productos (guías) y márcalos activos.
4. Verás las guías automáticamente en frontend:
   - Home sección guías (`/#guias`)
   - Listing: `/guias`
   - Detalle: `/guias/[slug]`
5. Al pagar, Stripe redirige a success/cancel y webhook guarda pedido en Supabase.

# Setup tienda (Supabase + Stripe + SMTP)

**Última actualización:** 4 de marzo de 2026

---

## 1) Variables de entorno (`.env.local`)

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:4173

NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

STRIPE_SECRET_KEY=sk_live_o_sk_test
STRIPE_WEBHOOK_SECRET=whsec_xxx

ADMIN_PANEL_KEY=tu_clave_admin_segura

# SMTP (emails transaccionales)
SMTP_HOST=smtp.ionos.es
SMTP_PORT=587
SMTP_USER=info@almadenomada.com
SMTP_PASS=Nomada:73Web
SMTP_FROM=ALMA DE NÓMADA <info@almadenomada.com>
ADMIN_EMAIL=almadenomad@gmail.com
```

> Estas mismas variables deben configurarse en **Vercel > Settings > Environment Variables** para producción.

---

## 2) Base de datos en Supabase

1. Abre el SQL Editor.
2. Ejecuta `supabase/schema.sql`
3. Crea buckets en Storage:
   - `alma-public` (public) — imágenes
   - `alma-guides` (private) — archivos de guías digitales

---

## 3) Stripe Webhook

En Stripe Dashboard, añade endpoint:

- URL producción: `https://tu-dominio.com/api/stripe/webhook`
- URL local (Stripe CLI): `http://localhost:4173/api/stripe/webhook`

Eventos mínimos:
- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`

---

## 4) Flujo final

1. Entra en `/admin` con `ADMIN_PANEL_KEY`
2. Crea productos (guías) y márcalos activos
3. Las guías aparecen en: Home (`/#guias`), `/guias`, `/guias/[slug]`
4. Al pagar, Stripe webhook guarda pedido en Supabase
5. Webhook genera código + token y envía email de descarga al cliente
6. Admin recibe notificación de nuevo pedido en `almadenomad@gmail.com`
7. Formulario de contacto envía a `almadenomad@gmail.com` con diseño branded

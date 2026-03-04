# Migración a emails transaccionales con SMTP (IONOS)

**Fecha:** 3 de marzo de 2026

---

## Objetivo

Reemplazar el envío de emails vía API de Resend por SMTP propio de IONOS (`smtp.ionos.es`) y añadir todos los emails transaccionales necesarios para la tienda.

---

## Emails implementados

| # | Email | Destinatario | Trigger (Stripe webhook) |
|---|-------|-------------|--------------------------|
| 1 | Confirmación de pedido + descarga | Cliente | `checkout.session.completed` |
| 2 | Notificación de nuevo pedido | Admin (info@almadenomada.com) | `checkout.session.completed` |
| 3 | Pago fallido | Cliente | `checkout.session.async_payment_failed` |

---

## Cambios realizados

### 1. Dependencias instaladas

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

También se instaló `dotenv` como dev dependency para el script de prueba.

### 2. Variables de entorno añadidas (`.env.local`)

```
SMTP_HOST=smtp.ionos.es
SMTP_PORT=587
SMTP_USER=info@almadenomada.com
SMTP_PASS=Nomada:73Web
SMTP_FROM="ALMA DE NÓMADA <info@almadenomada.com>"
ADMIN_EMAIL=info@almadenomada.com
```

> **Importante:** Estas mismas variables deben configurarse en Vercel (Settings → Environment Variables) para que funcionen en producción.

### 3. Archivos creados

#### `lib/email.ts`
- Transporte SMTP con Nodemailer (IONOS, STARTTLS puerto 587)
- Singleton lazy del transporter para reutilizar conexiones
- Función genérica `sendEmail({ to, subject, html, text })`
- Cabeceras `replyTo` y `X-Mailer` para mejorar entregabilidad
- Tres funciones específicas:
  - `sendOrderConfirmationEmail()` — al cliente, con código y enlace de descarga
  - `sendNewOrderNotificationEmail()` — al admin, con detalles del pedido
  - `sendPaymentFailedEmail()` — al cliente

#### `lib/email-templates.ts`
- Templates HTML responsive, compatibles con clientes de email
- Diseño branded con colores de ALMA DE NÓMADA:
  - Verde oscuro: `#184038`
  - Terracota: `#D3623B`
  - Crema: `#FAF6E8`
- Función `layout()` compartida (header con logo + footer con copyright)
- Cada template tiene versión HTML y texto plano:
  - `orderConfirmationHtml()` / `orderConfirmationText()`
  - `newOrderNotificationHtml()` / `newOrderNotificationText()`
  - `paymentFailedHtml()` / `paymentFailedText()`

#### `test-email.ts` (script de prueba, borrable)
- Envía los 3 emails de prueba a una dirección especificada
- Usa `dotenv` para cargar `.env.local`

### 4. Archivos modificados

#### `lib/digital-delivery.ts`
- Eliminada la dependencia de la API de Resend (`fetch` a `api.resend.com`)
- `sendDigitalGuideEmail()` ahora delega en `sendOrderConfirmationEmail()` vía SMTP
- Añadidos parámetros opcionales `totalCents` y `currency`
- Todas las funciones de token/hash se mantienen intactas

#### `app/api/stripe/webhook/route.ts`
- Añadido import de `sendNewOrderNotificationEmail` y `sendPaymentFailedEmail`
- En `checkout.session.completed`:
  - Se pasan `totalCents` y `currency` a `sendDigitalGuideEmail`
  - Se añade llamada a `sendNewOrderNotificationEmail()` para notificar al admin
- En `checkout.session.async_payment_failed`:
  - Se añade llamada a `sendPaymentFailedEmail()` al cliente

---

## Estado DNS del dominio

Verificado el 3 de marzo de 2026:

| Registro | Estado | Valor |
|----------|--------|-------|
| SPF | OK | `v=spf1 include:_spf-eu.ionos.com ~all` |
| DMARC | Parcial | Redirige a `dmarc.ionos.es` con `p=none` |
| DKIM | **No configurado** | Sin registro encontrado |

### Acciones pendientes para evitar spam

1. **Activar DKIM en IONOS** (panel de control → Email → Autenticación de email / DKIM)
2. **Mejorar DMARC** — Editar el registro TXT de `_dmarc.almadenomada.com` a:
   ```
   v=DMARC1; p=quarantine; rua=mailto:info@almadenomada.com
   ```
3. Tras activar DKIM, probar de nuevo el envío — los emails deberían llegar a bandeja principal.

---

## Variables necesarias en Vercel

Para que funcione en producción, añadir en Vercel → Settings → Environment Variables:

```
SMTP_HOST=smtp.ionos.es
SMTP_PORT=587
SMTP_USER=info@almadenomada.com
SMTP_PASS=Nomada:73Web
SMTP_FROM=ALMA DE NÓMADA <info@almadenomada.com>
ADMIN_EMAIL=info@almadenomada.com
```

---

## Verificación

- Build (`npx next build`): **OK, sin errores**
- Envío de prueba SMTP: **OK, 3/3 emails enviados** (llegaron a spam por falta de DKIM)

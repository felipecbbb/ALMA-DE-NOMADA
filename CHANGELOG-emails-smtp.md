# Sistema de emails transaccionales — SMTP (IONOS)

**Última actualización:** 4 de marzo de 2026

---

## Configuración SMTP

- **Proveedor:** IONOS (`smtp.ionos.es`, STARTTLS, puerto 587)
- **Cuenta:** `info@almadenomada.com`
- **Librería:** Nodemailer (singleton lazy)
- **Destino formulario de contacto:** `almadenomad@gmail.com`

---

## Emails implementados

| # | Email | Destinatario | Trigger |
|---|-------|-------------|---------|
| 1 | Confirmación de pedido + descarga | Cliente | Stripe `checkout.session.completed` |
| 2 | Notificación de nuevo pedido | Admin (`almadenomad@gmail.com`) | Stripe `checkout.session.completed` |
| 3 | Pago fallido | Cliente | Stripe `checkout.session.async_payment_failed` |
| 4 | Formulario de contacto | Admin (`almadenomad@gmail.com`) | POST `/api/contact` |

---

## Archivos clave

| Archivo | Descripción |
|---------|-------------|
| `lib/email.ts` | Transporter SMTP + funciones de envío |
| `lib/email-templates.ts` | Templates HTML/texto con branding (layout compartido) |
| `app/api/contact/route.ts` | API del formulario de contacto |
| `app/api/stripe/webhook/route.ts` | Webhook Stripe (pedidos + emails) |
| `lib/digital-delivery.ts` | Entrega digital de guías |

---

## Branding de emails

- Verde oscuro: `#184038`
- Terracota: `#D3623B`
- Crema: `#FAF6E8`
- Layout compartido: header "ALMA DE NÓMADA" + footer copyright
- Todos los emails tienen versión HTML y texto plano

---

## Variables de entorno necesarias

```
SMTP_HOST=smtp.ionos.es
SMTP_PORT=587
SMTP_USER=info@almadenomada.com
SMTP_PASS=Nomada:73Web
SMTP_FROM=ALMA DE NÓMADA <info@almadenomada.com>
ADMIN_EMAIL=almadenomad@gmail.com
```

> Estas variables deben estar en `.env.local` (local) y en **Vercel > Settings > Environment Variables** (producción).

---

## Estado DNS

| Registro | Estado |
|----------|--------|
| SPF | OK (`v=spf1 include:_spf-eu.ionos.com ~all`) |
| DMARC | Parcial (redirige a `dmarc.ionos.es`, `p=none`) |
| DKIM | **No configurado** — activar en panel IONOS para evitar spam |

---

## Historial de cambios

### 4 de marzo de 2026
- Email de contacto redirigido a `almadenomad@gmail.com`
- Formulario de contacto usa plantilla branded (`contactFormHtml`) con layout compartido
- Añadido error logging en `/api/contact` (`console.error`)
- Frontend muestra mensaje de error si el envío falla
- Ocultado número de stock en frontend (solo muestra "Agotado" si stock = 0)
- Texto "Reserva tu asesoría 1:1" → "Reserva tu asesoría"
- Título sección Ainhoa: negrita + más pequeño en móvil (`text-2xl font-bold`)

### 3 de marzo de 2026
- Migración de Resend API a SMTP IONOS (Nodemailer)
- Implementados 3 emails transaccionales (confirmación, notificación admin, pago fallido)
- Templates HTML responsive con branding ALMA DE NÓMADA
- Build verificado OK, envío de prueba OK (spam por falta de DKIM)

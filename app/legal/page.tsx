import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { OpenCookiePreferencesButton } from "@/components/open-cookie-preferences-button";

const updateDate = "27 de febrero de 2026";

export const metadata: Metadata = {
  title: "ALMA DE NÓMADA | Legal",
  description:
    "Aviso legal, política de privacidad, política de cookies y términos de contratación de ALMA DE NÓMADA.",
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pb-16 pt-32 md:px-12 md:pb-20 md:pt-36 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Información legal
          </p>
          <h1 className="mt-4 text-4xl font-semibold uppercase leading-tight text-foreground md:text-5xl">
            Textos legales
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Aviso legal, términos y condiciones disponibles con total transparencia.
            Nuestros servicios son informativos, personalizados y de acompañamiento.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Responsable: ALMA DE NÓMADA. Contacto:{" "}
            <a className="font-medium text-foreground underline" href="mailto:almadenomad@gmail.com">
              almadenomad@gmail.com
            </a>
            {" "}e Instagram{" "}
            <a
              className="font-medium text-foreground underline"
              href="https://www.instagram.com/almadenomad/"
              target="_blank"
              rel="noreferrer"
            >
              @almadenomad
            </a>
            .
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {updateDate}
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-24 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-border bg-card p-5 lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              Índice
            </p>
            <nav className="mt-4 space-y-2">
              <Link href="#aviso-legal" className="block text-sm text-muted-foreground hover:text-foreground">
                1. Aviso legal
              </Link>
              <Link href="#privacidad" className="block text-sm text-muted-foreground hover:text-foreground">
                2. Política de privacidad
              </Link>
              <Link href="#cookies" className="block text-sm text-muted-foreground hover:text-foreground">
                3. Política de cookies
              </Link>
              <Link href="#terminos" className="block text-sm text-muted-foreground hover:text-foreground">
                4. Términos y condiciones
              </Link>
              <Link href="#viajes" className="block text-sm text-muted-foreground hover:text-foreground">
                5. Política de contratación y viajes
              </Link>
            </nav>
          </aside>

          <div className="space-y-8">
            <article id="aviso-legal" className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">1. Aviso legal</h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  Titular del sitio: ALMA DE NÓMADA. Actividad principal: contenidos,
                  guías digitales y asesoría de viajes personalizada.
                </p>
                <p>
                  Contacto:{" "}
                  <a className="font-medium text-foreground underline" href="mailto:almadenomad@gmail.com">
                    almadenomad@gmail.com
                  </a>
                  {" "}y perfil oficial de Instagram{" "}
                  <a
                    className="font-medium text-foreground underline"
                    href="https://www.instagram.com/almadenomad/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @almadenomad
                  </a>
                  .
                </p>
                <p>
                  El acceso y navegación por esta web atribuye la condición de usuario e
                  implica la aceptación de las condiciones vigentes en cada momento. El
                  usuario se compromete a realizar un uso lícito del sitio, sin causar
                  daños, interferencias o usos fraudulentos.
                </p>
                <p>
                  Los contenidos, diseños, textos, imágenes, vídeos, marcas y demás
                  elementos están protegidos por la normativa de propiedad intelectual e
                  industrial. Queda prohibida su reproducción, distribución o comunicación
                  pública sin autorización expresa de ALMA DE NÓMADA.
                </p>
                <p>
                  ALMA DE NÓMADA puede actualizar, modificar o eliminar contenidos del
                  sitio y de estas condiciones legales sin previo aviso para adaptarlas a
                  cambios normativos o del servicio.
                </p>
              </div>
            </article>

            <article id="privacidad" className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                2. Política de privacidad
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  Responsable del tratamiento: ALMA DE NÓMADA. Finalidad: responder
                  consultas, gestionar reservas, enviar información solicitada y prestar
                  los servicios contratados.
                </p>
                <p>
                  Base jurídica: consentimiento del interesado, ejecución de relación
                  precontractual/contractual y cumplimiento de obligaciones legales.
                </p>
                <p>
                  Categorías de datos: identificación y contacto (nombre, email, teléfono
                  si procede), información necesaria para la asesoría y datos de
                  navegación cuando se aceptan cookies analíticas.
                </p>
                <p>
                  Conservación: los datos se conservan durante el tiempo necesario para la
                  finalidad para la que fueron recabados y, posteriormente, durante los
                  plazos legales aplicables.
                </p>
                <p>
                  Destinatarios: proveedores tecnológicos indispensables para operar la
                  web y los servicios (hosting, analítica, correo, reservas y pagos), con
                  contratos y garantías de confidencialidad.
                </p>
                <p>
                  Derechos: puedes solicitar acceso, rectificación, supresión, oposición,
                  limitación y portabilidad enviando un email a{" "}
                  <a className="font-medium text-foreground underline" href="mailto:almadenomad@gmail.com">
                    almadenomad@gmail.com
                  </a>
                  . Si consideras que no se ha atendido correctamente tu solicitud, puedes
                  presentar reclamación ante la autoridad de control competente.
                </p>
                <p>
                  Seguridad: se aplican medidas técnicas y organizativas razonables para
                  proteger los datos personales frente a accesos no autorizados, pérdida o
                  alteración.
                </p>
              </div>
            </article>

            <article id="cookies" className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                3. Política de cookies
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  Esta web utiliza cookies propias y de terceros para garantizar su
                  funcionamiento y, si se acepta, para medición analítica y personalización.
                </p>
                <p>
                  Tipos de cookies utilizadas:
                  {" "}cookies técnicas necesarias, cookies de analítica (medición de uso y
                  rendimiento) y cookies de marketing (personalización de campañas y
                  contenidos promocionales).
                </p>
                <p>
                  Puedes aceptar todas las cookies, rechazar las opcionales o configurar
                  tus preferencias desde el banner. El consentimiento puede retirarse o
                  modificarse en cualquier momento.
                </p>
                <p>
                  Además, puedes bloquear o eliminar cookies desde la configuración de tu
                  navegador, aunque esto puede afectar al funcionamiento de algunas partes
                  del sitio.
                </p>
                <div className="pt-2">
                  <OpenCookiePreferencesButton className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90" />
                </div>
              </div>
            </article>

            <article id="terminos" className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                4. Términos y condiciones
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  Los servicios y productos digitales (guías, asesorías y contenidos) se
                  describen en cada sección de la web. El usuario debe revisar cada ficha
                  antes de reservar o comprar.
                </p>
                <p>
                  Precios: se muestran en la moneda indicada en el momento de la compra y
                  pueden actualizarse sin previo aviso. El precio aplicable será el
                  publicado en el momento de confirmar el pedido o la reserva.
                </p>
                <p>
                  Productos digitales: por su naturaleza de contenido digital de acceso
                  inmediato, no admiten devolución una vez facilitado el acceso o la
                  descarga, salvo incidencia técnica demostrable.
                </p>
                <p>
                  Asesorías y sesiones: la contratación implica que el cliente facilita
                  información veraz y completa para personalizar recomendaciones. ALMA DE
                  NÓMADA presta acompañamiento y orientación, pero no garantiza resultados
                  concretos ajenos a su control (visados, decisiones de terceros,
                  disponibilidad de vuelos u otros servicios externos).
                </p>
                <p>
                  Enlaces de afiliación: la web puede incluir enlaces de terceros
                  (por ejemplo seguros o eSIM). El usuario contrata directamente con la
                  empresa final y debe revisar sus condiciones particulares.
                </p>
              </div>
            </article>

            <article id="viajes" className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                5. Política de contratación y viajes
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  Reservas: las sesiones se gestionan mediante calendario online y quedan
                  confirmadas una vez completado el proceso de reserva y pago cuando
                  corresponda.
                </p>
                <p>
                  Cambios y cancelaciones por parte del cliente: deben solicitarse con la
                  máxima antelación posible. Cuando proceda, se ofrecerá reprogramación
                  según disponibilidad. Las condiciones concretas de cada servicio se
                  informarán antes de contratar.
                </p>
                <p>
                  Cambios por parte de ALMA DE NÓMADA: en caso de fuerza mayor o motivos
                  organizativos justificados, podrá proponerse nueva fecha u opción
                  equivalente para prestar el servicio.
                </p>
                <p>
                  Responsabilidad del viajero: cada persona es responsable de su
                  documentación, visado, vacunación, seguros, requisitos de entrada y
                  cumplimiento normativo del país de destino.
                </p>
                <p>
                  Recomendación esencial: contratar seguro de viaje con coberturas acordes
                  al destino y duración. La información ofrecida en esta web es orientativa
                  y no sustituye asesoramiento legal, migratorio ni sanitario profesional.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

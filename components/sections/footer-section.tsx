"use client";

import Link from "next/link";
import { OpenCookiePreferencesButton } from "@/components/open-cookie-preferences-button";

const footerLinks = {
  explore: [
    { label: "Inicio", href: "/#inicio" },
    { label: "Australia", href: "/#australia" },
    { label: "Destinos", href: "/#destinos" },
    { label: "Guías", href: "/#guias" },
  ],
  about: [
    { label: "Contacto", href: "https://almadenomada.com/pages/contact" },
    { label: "Instagram", href: "https://www.instagram.com/almadenomad/" },
    { label: "Reservas", href: "https://calendly.com/ainhhgarcia" },
    { label: "Email", href: "mailto:almadenomad@gmail.com" },
  ],
  service: [
    { label: "Privacidad", href: "/legal#privacidad" },
    { label: "Términos y Condiciones", href: "/legal#terminos" },
    { label: "Política de Viaje", href: "/legal#viajes" },
    { label: "Aviso Legal", href: "/legal#aviso-legal" },
  ],
};

export function FooterSection() {
  return (
    <footer id="contacto" className="bg-background">
      {/* Main Footer Content */}
      <div className="border-t border-border px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="text-lg font-medium text-foreground">
              ALMA DE NÓMADA
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Descubre el mundo con nosotros. Experiencias únicas, destinos inolvidables y la mejor compañía para tu próxima aventura.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Explora</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Contacto</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <OpenCookiePreferencesButton className="mt-4 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 Alma de Nómada. Todos los derechos reservados.
          </p>

          

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://www.instagram.com/almadenomad/"
              target="_blank"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Instagram
            </Link>
            <Link
              href="https://calendly.com/ainhhgarcia"
              target="_blank"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Reservas
            </Link>
            <Link
              href="mailto:almadenomad@gmail.com"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

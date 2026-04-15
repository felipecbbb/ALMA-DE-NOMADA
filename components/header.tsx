"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1500px] transition-all duration-300 ${
        isMenuOpen
          ? "bg-background rounded-3xl shadow-xl"
          : isScrolled
            ? "bg-background/80 backdrop-blur-md rounded-full"
            : "bg-transparent"
      }`}
      style={{
        boxShadow:
          !isMenuOpen && isScrolled
            ? "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"
            : undefined,
      }}
    >
      <div className="flex items-center justify-between transition-all duration-300 px-3 py-2 md:px-5">
        {/* Logo */}
        <Link
          href="/#inicio"
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-tight transition-colors duration-300 md:text-base lg:text-lg ${
            isMenuOpen || isScrolled ? "text-primary" : "text-white"
          }`}
        >
          <Image
            src="/logo-alma.png"
            alt="Logo Alma de Nómada"
            width={30}
            height={30}
            className="h-[30px] w-[30px] rounded-full object-cover"
            priority
          />
          <span>ALMA DE NÓMADA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          <Link
            href="/#quienes-somos"
            className={`text-xs transition-colors md:text-sm ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
          >
            Sobre mí
          </Link>
          <Link
            href="/#destinos"
            className={`text-xs transition-colors md:text-sm ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
          >
            Destinos
          </Link>
          <Link
            href="/#guias"
            className={`text-xs transition-colors md:text-sm ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
          >
            Guías
          </Link>
          <Link
            href="/#descuentos"
            className={`text-xs transition-colors md:text-sm ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
          >
            Descuentos
          </Link>
          <Link
            href="/#contacto"
            className={`text-xs transition-colors md:text-sm ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
          >
            Contacto
          </Link>
          <a
            href="https://calendly.com/ainhhgarcia/nueva-reunion?back=1"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 md:text-[0.78rem]"
          >
            Australia
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`transition-colors md:hidden ${
            isMenuOpen || isScrolled ? "text-foreground" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="overflow-hidden rounded-b-3xl border-t border-border bg-background px-6 py-6 md:hidden">
          <nav className="flex flex-col">
            {[
              { href: "/#quienes-somos", label: "Sobre mí" },
              { href: "/#destinos", label: "Destinos" },
              { href: "/#guias", label: "Guías" },
              { href: "/#descuentos", label: "Descuentos" },
              { href: "/#contacto", label: "Contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-border/60 py-4 text-base font-medium text-foreground transition-colors last:border-b-0 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://calendly.com/ainhhgarcia/nueva-reunion?back=1"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              Australia
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

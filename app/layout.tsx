import React from "react"
import type { Metadata } from 'next'
import { Changa, Poppins } from 'next/font/google'
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import { ConsentManagedAnalytics } from "@/components/consent-managed-analytics"
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
});

const changa = Changa({
  subsets: ["latin"],
  variable: '--font-changa',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ALMA DE NÓMADA | Inicio',
  description: 'Asesorías personalizadas para viajar con claridad, confianza y tranquilidad.',
  generator: 'v0.app',
  icons: {
    icon: '/logo-alma.png',
    shortcut: '/logo-alma.png',
    apple: '/logo-alma.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${changa.variable} font-sans antialiased`}>
        {children}
        <CookieConsentBanner />
        <ConsentManagedAnalytics />
      </body>
    </html>
  )
}

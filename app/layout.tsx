import React from "react"
import type { Metadata } from 'next'
import { Changa, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
  title: 'ALMA DE NOMADA | Inicio',
  description: 'Asesorias personalizadas para viajar con claridad, confianza y tranquilidad.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
        <Analytics />
      </body>
    </html>
  )
}

import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../contexts/CartContext'
import { WishlistProvider } from '../contexts/WishlistContext'
import CartSidebar from '../components/features/CartSidebar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tupijama - Pijamas y ropa de dormir | Envíos en Colombia',
  description:
    'tupijama ofrece pijamas cómodas y de calidad para toda la familia. Descubre colecciones para mujer, hombre y niños con envío rápido en Colombia y garantía de satisfacción.',
  keywords:
    'pijamas, ropa de dormir, pijamas mujer, pijamas hombre, pijamas niños, pijama, Colombia, ropa cómoda, ropa de casa, pijama algodón',
  authors: [{ name: 'Equipo tupijama' }],
  creator: 'tupijama',
  publisher: 'tupijama',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://tupijama.com',
    title: 'tupijama - Pijamas y ropa de dormir',
    description:
      'Encuentra pijamas cómodas y diseños exclusivos para toda la familia. Compra fácil y recibe en Colombia con devolución sencilla.',
    siteName: 'tupijama',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tupijama - Pijamas y ropa de dormir',
    description: 'Pijamas cómodas y con estilo. Envíos rápidos en Colombia.',
    creator: '@tupijama',
  },
  generator: 'v0.dev',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F28C38',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://tupijama.com" />
        <meta name="format-detection" content="telephone=no" />
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#F28C38" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartSidebar />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}

import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../contexts/CartContext'
import CartSidebar from '../components/CartSidebar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:
    'tupijama - Premium Electronics Store | Latest Technology & Best Deals',
  description:
    'Discover the latest electronics and technology at tupijama. Shop smartphones, laptops, audio equipment, wearables, and accessories with free shipping on orders over $50.',
  keywords:
    'electronics, smartphones, laptops, audio, wearables, accessories, technology, gadgets, online store',
  authors: [{ name: 'tupijama Team' }],
  creator: 'tupijama',
  publisher: 'tupijama',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tupijama.com',
    title: 'tupijama - Premium Electronics Store',
    description:
      'Your trusted destination for the latest electronics and technology with competitive prices and exceptional service.',
    siteName: 'tupijama',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tupijama - Premium Electronics Store',
    description:
      'Discover the latest electronics and technology at competitive prices.',
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
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <CartSidebar />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}

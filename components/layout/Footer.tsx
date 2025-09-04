'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
    alert('¡Gracias por suscribirte a nuestro newsletter!')
  }

  const footerSections = {
    userNavigation: [
      { name: 'Mi Cuenta', href: '#' },
      { name: 'Historial de Pedidos', href: '#' },
      { name: 'Lista de Deseos', href: '#' },
      { name: 'Rastrear Pedido', href: '#' },
      { name: 'Devoluciones', href: '#' },
    ],
    categories: [
      { name: 'Seda Premium', href: '#' },
      { name: 'Algodón Orgánico', href: '#' },
      { name: 'Modal Bambú', href: '#' },
      { name: 'Satén Elegante', href: '#' },
      { name: 'Batas de Lujo', href: '#' },
    ],
    company: [
      { name: 'Acerca de Nosotros', href: '#' },
      { name: 'Contacto', href: '#' },
      { name: 'Trabajos', href: '#' },
      { name: 'Prensa', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    support: [
      { name: 'Centro de Ayuda', href: '/soporte#faq' },
      { name: 'Información de Envío', href: '/soporte#envios' },
      { name: 'Política de Devoluciones', href: '/soporte#devoluciones' },
      { name: 'Política de Privacidad', href: '/soporte#privacidad' },
      { name: 'Términos de Servicio', href: '/soporte#terminos' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ]

  return (
    <footer className="bg-gray-800 text-white" role="contentinfo">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {/* Reemplazar texto por logotipo enlazado al home (mismo logo que en Header) */}
              <div className="mb-4">
                <Link href="/" aria-label="Ir al inicio">
                  <img
                    src="/logotipo/logo_pijamacandy_sinfondo.png"
                    alt="PijamaCandy Logo"
                    className="block w-40 h-auto object-contain"
                    style={{
                      background: 'transparent',
                      // Suave contorno / glow blanco
                      filter:
                        'drop-shadow(0 0 6px rgba(255,255,255,0.45)) drop-shadow(0 0 10px rgba(255,255,255,0.25))',
                      WebkitFilter:
                        'drop-shadow(0 0 6px rgba(255,255,255,0.45)) drop-shadow(0 0 10px rgba(255,255,255,0.25))',
                    }}
                  />
                </Link>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Tu destino de confianza para las pijamas más cómodas y
                elegantes. Ofrecemos productos premium diseñados especialmente
                para el descanso perfecto de la familia moderna.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary-500" />
                <span className="text-gray-300">+57 (300) 309-4854</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary-500" />
                <span className="text-gray-300">soporte@pijamacandy.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary-500" />
                <span className="text-gray-300">
                  Cra 3 # 72A70, Cali, Valle del Cauca
                </span>
              </div>
            </div>
          </div>

          {/* User Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-500">
              Mi Cuenta
            </h4>
            <nav aria-label="User account navigation">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    Mi Perfil
                  </Link>
                </li>

                <li>
                  <Link
                    href="/orders"
                    className="text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    Historial de Pedidos
                  </Link>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      // Disparar evento para abrir el modal de wishlist en Header
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('openWishlist'))
                      }
                    }}
                    className="text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    Lista de Deseos
                  </a>
                </li>

                {/* Resto de items como Rastrear Pedido, Devoluciones */}
                {footerSections.userNavigation.slice(3).map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-primary-500 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Categories
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-500">
              Categorías
            </h4>
            <nav aria-label="Product categories">
              <ul className="space-y-2">
                {footerSections.categories.map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-primary-500 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>*/}

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-500">
              Soporte
            </h4>
            <nav aria-label="Support links">
              <ul className="space-y-2">
                {footerSections.support.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-primary-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4 text-primary-500">
              Mantente Actualizada
            </h4>
            <p className="text-gray-300 mb-4">
              Suscríbete para recibir las últimas ofertas y novedades de
              productos.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Suscribirse ✨
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 PijamaCandy by @BasabeCode All rights reserved
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map(social => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

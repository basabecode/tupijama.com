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
      { name: 'Centro de Ayuda', href: '#' },
      { name: 'Información de Envío', href: '#' },
      { name: 'Política de Devoluciones', href: '#' },
      { name: 'Política de Privacidad', href: '#' },
      { name: 'Términos de Servicio', href: '#' },
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
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-primary-500">✨ Dream</span>Wear
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Tu destino de confianza para las pijamas más cómodas y
                elegantes. Ofrecemos productos premium diseñados especialmente
                para el descanso perfecto de la mujer moderna.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary-500" />
                <span className="text-gray-300">soporte@dreamwear.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary-500" />
                <span className="text-gray-300">
                  123 Tech Street, Digital City, DC 12345
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
                {footerSections.userNavigation.map(item => (
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

          {/* Categories */}
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
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-500">
              Soporte
            </h4>
            <nav aria-label="Support links">
              <ul className="space-y-2">
                {footerSections.support.map(item => (
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
              © 2024 tupijama. All rights reserved.
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

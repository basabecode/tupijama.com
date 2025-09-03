'use client'

import type React from 'react'

import { useState } from 'react'
import { Phone, MapPin, Clock, Send } from 'lucide-react'

// Icono de WhatsApp optimizado con mejor visual
const WhatsappIcon = ({
  size = 24,
  className = '',
}: {
  size?: number
  className?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-transform hover:scale-110 ${className}`}
    aria-label="WhatsApp"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.064 3.488" />
  </svg>
)

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Llámanos',
      details: ['+57 (300) 309-4854', 'Lun-Vie 9AM-5PM EST'],
      href: 'tel:+573003094854',
      color: 'text-blue-500',
    },
    {
      icon: WhatsappIcon,
      title: 'WhatsApp',
      details: ['+57 (300) 309-4854', 'Escríbenos por WhatsApp'],
      color: 'text-green-500',
      href: 'https://wa.me/573003094854',
    },
    {
      icon: MapPin,
      title: 'Somos Tienda Virtual',
      details: ['Cra 3 #72A70', 'Cali, Valle del Cauca'],
      color: 'text-red-500',
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      details: ['Lun-Vie: 9AM-5PM', 'Sab-Dom: 10AM-4PM'],
      color: 'text-purple-500',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ponte en Contacto con Nosotros
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes preguntas sobre nuestros productos o necesitas soporte?
            ¡Estamos aquí para ayudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8">
              Información de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-md"
                  >
                    <div className={`${info.color} mb-4`}>
                      {info.href ? (
                        info.href.startsWith('tel:') ? (
                          <a
                            href={info.href}
                            aria-label={`Llamar a ${info.title}`}
                            className="inline-block transition-transform hover:scale-110"
                          >
                            <Icon size={32} className="cursor-pointer" />
                          </a>
                        ) : (
                          <a
                            href={info.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Abrir ${info.title} en nueva ventana`}
                            className="inline-block transition-transform hover:scale-110"
                          >
                            <Icon size={32} className="cursor-pointer" />
                          </a>
                        )
                      ) : (
                        <Icon size={32} />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {info.title}
                    </h4>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-800 mb-4">
                Preguntas Frecuentes
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">
                    ¿Cuánto tiempo tarda el envío?
                  </p>
                  <p className="text-sm text-gray-600">
                    Envío otros departamentos: 3-6 días hábiles, Express en
                    Cali: 1-2 días hábiles
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    ¿Cuál es la política de devolución?
                  </p>
                  <p className="text-sm text-gray-600">
                    15 días de devolución sin complicaciones en todos los
                    productos, debe estar en su estado original.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    ¿Ofrecen garantía?
                  </p>
                  <p className="text-sm text-gray-600">
                    Sí, todos los productos vienen con garantía del fabricante.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Envíanos un Mensaje
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre y Apellido:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Correo Electrónico:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Dirigido al área de:
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un área</option>
                    <option value="product-inquiry">
                      Consulta de Producto
                    </option>
                    <option value="order-support">Soporte de Pedido</option>
                    <option value="returns">Devoluciones y Reembolsos</option>
                    <option value="general">Pregunta General</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Escribe tu mensaje:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

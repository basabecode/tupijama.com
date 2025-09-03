'use client'

import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Laura Gomez',
      role: '',
      rating: 5,
      comment:
        'Me encanta la pijama, es super comoda y esta fabricada en Colombia. Definitivamente me quedo con marcas nacionales.',
      avatar: '',
    },
    {
      id: 2,
      name: 'Sofia Martinez',
      role: '',
      rating: 5,
      comment:
        'las Pijamas Colombianas son mi combinacion perfecta de confort y estilo. Me siento muy a gusto usandolas',
      avatar: '',
    },
    {
      id: 3,
      name: 'Catalina Lopez',
      role: '',
      rating: 5,
      comment:
        'Apoyo lo hecho en colombia y esta pijama es un claro ejemplo de calidad. Se las recomiendo a todos',
      avatar: '',
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }
      />
    ))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Lo que dicen nuestros Clientes
          </h2>
          <p className="text-lg text-gray-600">
            "Cada costura cuenta una historia de tradición textil colombiana.
            Lleva contigo una pijama que combina estilo y confort."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote size={24} className="text-orange-500 mb-4" />

              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

              <p className="text-gray-700 mb-6 italic">
                "{testimonial.comment}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar || '/placeholder.svg'}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-orange-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Damos la bienvenida a nuestros clientes
            </h3>
            <p className="text-gray-600 mb-6">
              Experimente la diferencia de comprar en nuestra tienda electrónica
              y disfruta de un servicio excepcional. Nuestra meta es:
            </p>
            <div className="flex justify-center items-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-500">4.9/5</div>
                <div className="text-sm text-gray-600">
                  Calificación Promedio
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500">50K+</div>
                <div className="text-sm text-gray-600">Clientes Felices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500">99%</div>
                <div className="text-sm text-gray-600">
                  Tasa de Satisfacción
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

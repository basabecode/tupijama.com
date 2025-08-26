'use client'

import {
  Heart,
  Moon,
  Sun,
  Flower,
  Sparkles,
  Wind,
  Baby,
  Crown,
} from 'lucide-react'

export default function Categories() {
  const categories = [
    {
      name: 'Seda Premium',
      icon: Crown,
      count: '15+ productos',
      image:
        'https://via.placeholder.com/300x200/ec4899/FFFFFF?text=Seda+Premium',
      color: 'bg-primary-500',
      description: 'Lujo y elegancia en cada prenda',
    },
    {
      name: 'Algodón Orgánico',
      icon: Flower,
      count: '20+ productos',
      image:
        'https://via.placeholder.com/300x200/f472b6/FFFFFF?text=Algodón+Orgánico',
      color: 'bg-primary-400',
      description: 'Natural y respetuoso con tu piel',
    },
    {
      name: 'Modal Bambú',
      icon: Wind,
      count: '12+ productos',
      image:
        'https://via.placeholder.com/300x200/94a3b8/FFFFFF?text=Modal+Bambú',
      color: 'bg-secondary-400',
      description: 'Súper suave y termorregulador',
    },
    {
      name: 'Satén Elegante',
      icon: Sparkles,
      count: '8+ productos',
      image:
        'https://via.placeholder.com/300x200/facc15/FFFFFF?text=Satén+Elegante',
      color: 'bg-accent-400',
      description: 'Para ocasiones especiales',
    },
    {
      name: 'Térmica Invierno',
      icon: Moon,
      count: '10+ productos',
      image:
        'https://via.placeholder.com/300x200/db2777/FFFFFF?text=Térmica+Invierno',
      color: 'bg-primary-600',
      description: 'Calidez para noches frías',
    },
    {
      name: 'Verano Fresco',
      icon: Sun,
      count: '18+ productos',
      image:
        'https://via.placeholder.com/300x200/cbd5e1/FFFFFF?text=Verano+Fresco',
      color: 'bg-secondary-300',
      description: 'Ligeras y transpirables',
    },
    {
      name: 'Maternidad',
      icon: Baby,
      count: '6+ productos',
      image:
        'https://via.placeholder.com/300x200/f9a8d4/FFFFFF?text=Maternidad',
      color: 'bg-primary-300',
      description: 'Comodidad para mamás',
    },
    {
      name: 'Batas de Lujo',
      icon: Heart,
      count: '5+ productos',
      image:
        'https://via.placeholder.com/300x200/475569/FFFFFF?text=Batas+Lujo',
      color: 'bg-secondary-500',
      description: 'Spa en tu hogar',
    },
  ]

  return (
    <section className="py-16 bg-white" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            id="categories-heading"
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            💖 Explora por Categorías ✨
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra el estilo perfecto para cada momento. Desde sedas
            elegantes hasta algodones suaves, tenemos la pijama ideal para cada
            preferencia y estación del año.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <article
                key={index}
                className="group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-primary-100 hover:border-primary-300"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <span className="text-primary-600 font-medium text-sm">
                    {category.count}
                  </span>

                  {/* Hover Image Preview */}
                  <div className="mt-4 relative overflow-hidden rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <img
                      src={category.image}
                      alt={`Categoría ${category.name}`}
                      className="w-full h-24 object-cover rounded-lg transform scale-95 group-hover:scale-100 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Ver Toda la Colección ✨
          </button>
        </div>
      </div>
    </section>
  )
}

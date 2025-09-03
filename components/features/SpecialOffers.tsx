'use client'

import { Clock, Zap, Gift } from 'lucide-react'

export default function SpecialOffers() {
  const offers = [
    {
      id: 1,
      title: '💖 Super Oferta en Pijamas',
      description: 'Hasta 20% OFF en pijamas de la mejor calidad',
      discount: '20%',
      timeLeft: '2 días restantes',
      icon: Zap,
      bgColor: 'bg-primary-500',
      textColor: 'text-primary-500',
    },
    {
      id: 2,
      title: '✨ Combo Dulces Sueños',
      description:
        'Compra 2 pijamas por el precio de 1 en producto seleccionado',
      discount: '2x1 GRATIS',
      timeLeft: 'Tiempo limitado',
      icon: Gift,
      bgColor: 'bg-accent-500',
      textColor: 'text-accent-500',
    },
    {
      id: 3,
      title: '🌙 Oferta de Trasnocho',
      description: '10% extra con código DULCESSUEÑOS en algunos productos',
      discount: '10%',
      timeLeft: 'Solo este fin de semana',
      icon: Clock,
      bgColor: 'bg-secondary-500',
      textColor: 'text-secondary-500',
    },
  ]

  return (
    <section
      id="specialoffers"
      className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50 scroll-mt-28"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ofertas Especiales
          </h2>
          <p className="text-lg text-gray-600">
            ¡Increíbles ofertas! Solo por tiempo limitado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map(offer => {
            const Icon = offer.icon
            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-transparent hover:border-primary-200"
              >
                <div className={`${offer.bgColor} text-white p-4 text-center`}>
                  <Icon size={32} className="mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                </div>

                <div className="p-6 text-center">
                  <div className={`text-3xl font-bold ${offer.textColor} mb-2`}>
                    {offer.discount}
                  </div>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-1">
                    <Clock size={16} />
                    {offer.timeLeft}
                  </div>
                  <button className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                    Comprar Ahora ✨
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

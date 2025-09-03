import {
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  CreditCard,
} from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: 'Pago Seguro',
      description: '100% transacciones seguras',
    },
    {
      icon: Truck,
      title: 'Envío a todo el país',
      description: 'Haz tu pedido hoy',
    },
    {
      icon: RotateCcw,
      title: 'Devoluciones Fáciles',
      description: 'Política de 30 días',
    },
    {
      icon: Headphones,
      title: 'Soporte 24/7',
      description: 'Atención al cliente',
    },
    {
      icon: Award,
      title: 'Garantía de Calidad',
      description: 'Solo productos premium',
    },
    {
      icon: CreditCard,
      title: 'Pago Flexible',
      description: 'Múltiples opciones de pago',
    },
  ]

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div key={index} className="text-center group">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-colors">
                  <Icon size={24} className="text-primary-500" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

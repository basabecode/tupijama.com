'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'

export default function SoportePage() {
  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      {/* Header con todas sus funcionalidades */}
      <Header />

      {/* Spacer para compensar el header sticky (aumentado) */}
      <div className="h-32 lg:h-36" aria-hidden />

      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-12">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Soporte y Ayuda
          </h1>
          <p className="text-gray-600">
            Encuentra respuestas rápidas sobre envíos, devoluciones y formas de
            pago.
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          Bienvenido al Centro de Soporte de PijamaCandy. Aquí encontrarás
          información útil sobre envíos, devoluciones, métodos de pago y
          preguntas frecuentes (FAQ) pensadas para tiendas de ropa en Colombia.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            id="envios"
            className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-28 lg:scroll-mt-32"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary-500">
              Envíos
            </h2>
            <p className="text-gray-600 mb-2">
              Ofrecemos envíos a todo el territorio nacional. Los tiempos de
              entrega estimados son:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-3">
              <li>Bogotá: 1-3 días hábiles</li>
              <li>Ciudades principales: 2-5 días hábiles</li>
              <li>Zonas rurales: 4-8 días hábiles</li>
            </ul>
            <p className="text-gray-600">
              Los costos de envío se calculan en la página de checkout según la
              dirección y el peso. Para envíos urgentes, contáctanos y haremos
              lo posible por priorizar tu pedido.
            </p>
          </div>

          <div
            id="devoluciones"
            className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-28 lg:scroll-mt-32"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary-500">
              Devoluciones y Cambios
            </h2>
            <p className="text-gray-600 mb-2">
              Aceptamos devoluciones dentro de los 15 días siguientes a la
              entrega. Para ser elegible, el producto debe estar en su empaque
              original y sin uso. Sigue estos pasos:
            </p>
            <ol className="list-decimal list-inside text-gray-600 mb-3">
              <li>Solicita la devolución desde tu cuenta o contáctanos.</li>
              <li>Empaqueta el producto y adjunta el comprobante de compra.</li>
              <li>
                Coordina la recolección o envíanos el paquete a la dirección
                indicada.
              </li>
            </ol>
            <p className="text-gray-600">
              Reembolsos: El reembolso se procesa en 5-10 días hábiles una vez
              recibido el producto en nuestro centro de devoluciones.
            </p>
          </div>

          <div
            id="pagos"
            className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-28 lg:scroll-mt-32"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary-500">
              Métodos de Pago
            </h2>
            <p className="text-gray-600 mb-2">
              Aceptamos tarjetas débito/crédito, transferencias y pago contra
              entrega (en algunas ciudades). Para tarjetas emitidas fuera de
              Colombia, consulta con tu banco si aplica alguna comisión.
            </p>
            <p className="text-gray-600">
              Pagos seguros con encriptación y 3DS.
            </p>
          </div>

          <div
            id="faq"
            className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-28 lg:scroll-mt-32"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary-500">
              Preguntas Frecuentes (FAQ)
            </h2>
            <div className="space-y-2">
              <details className="p-3 bg-gray-50 rounded">
                <summary className="font-medium">
                  ¿Cómo rastreo mi pedido?
                </summary>
                <p className="text-gray-600 mt-2">
                  Ingresa a "Mis Pedidos" en tu cuenta y selecciona el pedido
                  para ver el estado y número de guía.
                </p>
              </details>

              <details className="p-3 bg-gray-50 rounded">
                <summary className="font-medium">
                  ¿Cuánto tarda un reembolso?
                </summary>
                <p className="text-gray-600 mt-2">
                  Los reembolsos suelen tardar entre 5 y 10 días hábiles
                  dependiendo del método de pago.
                </p>
              </details>

              <details className="p-3 bg-gray-50 rounded">
                <summary className="font-medium">
                  ¿Puedo cambiar la dirección después de comprar?
                </summary>
                <p className="text-gray-600 mt-2">
                  Si el pedido aún no ha sido despachado, podemos intentar
                  cambiar la dirección. Contáctanos con el número de pedido.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Privacidad y Términos se colocan abajo para anclas desde el footer */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            id="privacidad"
            className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-28 lg:scroll-mt-32"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary-500">
              Política de Privacidad
            </h2>
            <p className="text-gray-600">
              En PijamaCandy respetamos tu privacidad. Recopilamos los datos
              necesarios para procesar pedidos y mejorar la experiencia de
              compra. Nunca compartiremos tu información con terceros sin tu
              consentimiento salvo cuando sea necesario para la entrega o por
              requerimiento legal.
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-3">
              <li>
                Datos que recopilamos: nombre, dirección, email y teléfono.
              </li>
              <li>
                Uso de datos: gestión de pedidos, facturación y comunicación.
              </li>
              <li>
                Derechos ARCO: solicíta acceso, rectificación o supresión.
              </li>
            </ul>
          </div>

          <div
            id="terminos"
            className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-28 lg:scroll-mt-32"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary-500">
              Términos de Servicio
            </h2>
            <p className="text-gray-600">
              Estos términos regulan el uso de la tienda y la compra de
              productos. Al realizar una compra aceptas nuestras políticas de
              pago, envío y devoluciones. Consulta las condiciones específicas
              en cada proceso de compra.
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-3">
              <li>Precios sujetos a disponibilidad y cambios.</li>
              <li>
                Los envíos se gestionan según la dirección proporcionada por el
                cliente.
              </li>
              <li>
                Para reclamaciones, utiliza el formulario de contacto o la
                sección de soporte.
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/contact" className="text-primary-500 font-semibold">
            ¿Necesitas más ayuda? Contáctanos
          </Link>
        </div>
      </main>
    </div>
  )
}

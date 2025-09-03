'use client'

import { useState, useEffect } from 'react'

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const featuredProducts = [
    {
      id: 1,
      image: '/piyamas/tela_chalis_crepe.jpg',
      alt: 'Pijama de Seda Rosa Premium',
    },
    {
      id: 2,
      image: '/piyamas/levantadora_img3.jpg',
      alt: 'Conjunto Algodón Floral Elegante',
    },
    {
      id: 3,
      image: '/piyamas/tela_chalis_3.jpg',
      alt: 'Modal Bambú Premium Comfort',
    },
    {
      id: 4,
      image: '/piyamas/pantalon_buso_satin_img1.jpg',
      alt: 'Colección Satén Luxury',
    },
    {
      id: 5,
      image: '/piyamas/pijama_termica_img1.jpg',
      alt: 'Pijama Algodón Orgánico',
    },
    {
      id: 6,
      image: '/piyamas/short_tira_duzano_img13.jpg',
      alt: 'Conjunto Algodón Floral Elegante',
    },
  ]

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredProducts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredProducts.length])

  return (
    <section className="relative min-h-[75vh] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-r from-rose-300/40 to-pink-400/40 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[65vh]">
          {/* Left Content - Fashion Brand Style - Ubicación y estilo original */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold rounded-full shadow-lg tracking-wide">
                  NUEVA COLECCIÓN 2025
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-gray-900 mb-2">Elegancia</span>
                <span className="block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  & Confort
                </span>
                <span className="block text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-600 font-light mt-4">
                  Para cada momento
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed mx-auto lg:mx-0">
                Descubre nuestra exclusiva colección de pijamas premium.
                Diseñadas para la mujer moderna que valora el lujo y la
                comodidad.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="group bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
                onClick={() => {
                  const productsSection =
                    document.getElementById('products-heading')
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Comprar Ahora
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                className="group border-2 border-rose-300 text-rose-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={() => {
                  const collectionSection =
                    document.getElementById('collection-heading')
                  if (collectionSection) {
                    collectionSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                Ver Colección
              </button>
            </div>
          </div>

          {/* Right Side - Vertical Image Carousel con separación mejorada */}
          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-2xl h-[500px] md:h-[600px] lg:h-[700px] overflow-visible">
              {/* Image Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {featuredProducts.map((product, index) => {
                  const isActive = index === currentSlide
                  const isPrev =
                    index ===
                    (currentSlide - 1 + featuredProducts.length) %
                      featuredProducts.length
                  const isNext =
                    index === (currentSlide + 1) % featuredProducts.length
                  const isVisible = isActive || isPrev || isNext

                  if (!isVisible) return null

                  return (
                    <div
                      key={product.id}
                      className={`absolute transition-all duration-700 ease-in-out ${
                        isActive
                          ? 'z-30 scale-100 opacity-100'
                          : 'z-10 scale-85 opacity-50'
                      }`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) ${
                          isPrev
                            ? 'translateX(-60%) scale(0.8)'
                            : isNext
                            ? 'translateX(60%) scale(0.8)'
                            : ''
                        }`,
                      }}
                    >
                      {/* Clean Vertical Image Card - Bien separadas */}
                      <div className="relative w-[330px] md:w-[380px] lg:w-[420px] aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl group cursor-pointer">
                        {/* Image sin efectos que afecten nitidez */}
                        <img
                          src={product.image}
                          alt={product.alt}
                          className="w-full h-full object-cover object-center rounded-3xl transition-transform duration-700"
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                          draggable={false}
                        />

                        {/* Hover overlay solo en imagen activa */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-end justify-center pb-8 z-20">
                            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
                              <span className="text-gray-800 font-semibold text-sm">
                                Ver Producto
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-pink-300/40 to-rose-400/40 rounded-full animate-float blur-sm"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-300/40 to-pink-400/40 rounded-full animate-bounce blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

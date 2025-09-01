import { Header, Banner, Footer } from '@/components/layout'
import { ProductGridDynamic } from '@/components/products'
import { Testimonials, SpecialOffers, TrustBadges } from '@/components/features'
import Categories from '@/components/Categories'
import Contact from '@/components/Contact'
import LatestCollections from '@/components/LatestCollections'
import { supabase } from '@/lib/supabaseClient'

async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    console.log('Fetched products:', data?.length || 0, 'products')
    return data || []
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

export default async function Home() {
  let featuredProducts: any[] = []

  try {
    featuredProducts = await getFeaturedProducts()
  } catch (error) {
    console.error('Error loading featured products:', error)
    // Productos mock como fallback
    featuredProducts = []
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section id="home">
          <Banner />
          <TrustBadges />
        </section>

        {/* 🌟 Últimas Colecciones - Nueva sección atractiva */}
        <LatestCollections />

        {/* Productos Destacados desde la base de datos */}
        <section className="py-8 bg-gray-50">
          <div className="w-full">
            {featuredProducts.length > 0 ? (
              <ProductGridDynamic products={featuredProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">
                    No hay productos en la base de datos
                  </h3>
                  <p className="text-yellow-700">
                    Agrega productos desde el panel de administración para que
                    aparezcan aquí.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* Ofertas Especiales */}
        <SpecialOffers />

        <section id="categories">
          <Categories />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  )
}

import Header from '@/components/Header'
import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'
import ProductGridDatabase from '@/components/ProductGridDatabase'
import Categories from '@/components/Categories'
import Testimonials from '@/components/Testimonials'
import SpecialOffers from '@/components/SpecialOffers'
import TrustBadges from '@/components/TrustBadges'
import Brands from '@/components/Brands'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .limit(8)
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
          <SpecialOffers />
        </section>

        {/* Productos Destacados desde la base de datos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Productos Destacados
            </h2>
            {featuredProducts.length > 0 ? (
              <ProductGridDatabase products={featuredProducts} />
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

        <section id="shop">
          <ProductGrid />
          <Testimonials />
        </section>
        <section id="categories">
          <Categories />
          <Brands />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  )
}

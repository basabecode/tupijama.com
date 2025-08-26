import { createClient } from '@supabase/supabase-js'

// Verificar que tenemos las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabase() {
  console.log('🔍 Verificando estado de la base de datos...\n')

  try {
    // 1. Verificar conexión
    console.log('1. Probando conexión a Supabase...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })

    if (healthError) {
      console.error('❌ Error de conexión:', healthError.message)
      return
    }
    console.log('✅ Conexión exitosa')

    // 2. Contar productos
    console.log('\n2. Contando productos...')
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error al contar productos:', countError.message)
      return
    }

    console.log(`📦 Total de productos: ${count || 0}`)

    // 3. Obtener algunos productos de ejemplo
    if (count && count > 0) {
      console.log('\n3. Productos de ejemplo:')
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, status, images')
        .limit(5)

      if (productsError) {
        console.error('❌ Error al obtener productos:', productsError.message)
        return
      }

      products?.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - $${product.price}`)
        console.log(`      ID: ${product.id}`)
        console.log(`      Estado: ${product.status}`)
        console.log(
          `      Imágenes: ${
            Array.isArray(product.images) ? product.images.length : 0
          } imagen(es)`
        )
        if (Array.isArray(product.images) && product.images.length > 0) {
          console.log(`      Primera imagen: ${product.images[0]}`)
        }
        console.log('')
      })
    } else {
      console.log('📭 No hay productos en la base de datos')
      console.log('\n💡 Para agregar productos:')
      console.log('   1. Ve a http://localhost:3005/admin')
      console.log('   2. Haz clic en "Productos"')
      console.log('   3. Haz clic en "Nuevo Producto"')
    }

    // 4. Verificar bucket de imágenes
    console.log('\n4. Verificando storage de imágenes...')
    try {
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets()

      if (bucketsError) {
        console.log('⚠️  No se pudo verificar buckets:', bucketsError.message)
      } else {
        const productImagesBucket = buckets?.find(
          b => b.name === 'product-images'
        )
        if (productImagesBucket) {
          console.log('✅ Bucket "product-images" existe')
        } else {
          console.log('⚠️  Bucket "product-images" no encontrado')
          console.log('   Crea el bucket desde el dashboard de Supabase')
        }
      }
    } catch (storageError) {
      console.log('⚠️  Error verificando storage:', storageError)
    }
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

checkDatabase()

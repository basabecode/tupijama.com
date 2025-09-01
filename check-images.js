const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Leer variables de entorno del archivo .env.local
const envPath = '.env.local'
const envContent = fs.readFileSync(envPath, 'utf8')

const getEnvVar = name => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'))
  return match ? match[1] : null
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProductImages() {
  console.log('🖼️ Verificando imágenes de productos...\n')

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3) // Solo los primeros 3 para ver la estructura

    if (error) {
      console.error('❌ Error obteniendo productos:', error)
      return
    }

    console.log(`📊 Analizando ${products.length} productos:\n`)

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Images field type: ${typeof product.images}`)
      console.log(`   Images content:`, product.images)

      if (Array.isArray(product.images)) {
        console.log(`   📸 Tiene ${product.images.length} imágenes:`)
        product.images.forEach((img, imgIndex) => {
          console.log(`      ${imgIndex + 1}. ${img}`)
        })
      } else {
        console.log(`   ⚠️  Images no es un array`)
      }
      console.log('   ' + '-'.repeat(50))
    })
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

checkProductImages()

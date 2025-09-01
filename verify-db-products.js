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

async function verifyProducts() {
  console.log('🔍 Verificando productos en la base de datos...\n')

  try {
    // Obtener todos los productos
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, status, stock, created_at')
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('❌ Error obteniendo todos los productos:', allError)
      return
    }

    console.log(`📊 Total de productos en la DB: ${allProducts.length}`)

    // Mostrar todos los productos
    allProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - Status: ${product.status} - Stock: ${
          product.stock
        }`
      )
    })

    console.log('\n' + '='.repeat(50) + '\n')

    // Obtener solo productos activos
    const { data: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('id, name, status, stock')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (activeError) {
      console.error('❌ Error obteniendo productos activos:', activeError)
      return
    }

    console.log(`✅ Productos con status 'active': ${activeProducts.length}`)

    activeProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Stock: ${product.stock}`)
    })
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

verifyProducts()

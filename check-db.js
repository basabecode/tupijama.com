console.log('Iniciando verificación de la base de datos...')

// Simulación de verificación básica
const fs = require('fs')
const path = require('path')

// Verificar si existe un archivo de configuración de Supabase
const envPath = path.join(process.cwd(), '.env.local')

if (fs.existsSync(envPath)) {
  console.log('✓ Archivo .env.local encontrado')

  const envContent = fs.readFileSync(envPath, 'utf8')

  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    console.log('✓ NEXT_PUBLIC_SUPABASE_URL configurado')
  } else {
    console.log('✗ NEXT_PUBLIC_SUPABASE_URL no encontrado')
  }

  if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    console.log('✓ NEXT_PUBLIC_SUPABASE_ANON_KEY configurado')
  } else {
    console.log('✗ NEXT_PUBLIC_SUPABASE_ANON_KEY no encontrado')
  }

  if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log('✓ SUPABASE_SERVICE_ROLE_KEY configurado')
  } else {
    console.log('✗ SUPABASE_SERVICE_ROLE_KEY no encontrado')
  }
} else {
  console.log('✗ Archivo .env.local no encontrado')
}

// Verificar productos en el archivo JSON de datos
const productsPath = path.join(process.cwd(), 'data', 'products.json')

if (fs.existsSync(productsPath)) {
  console.log('✓ Archivo data/products.json encontrado')

  try {
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    const products = productsData.products || []
    console.log(`✓ ${products.length} productos encontrados en el archivo JSON`)

    products.forEach((product, index) => {
      console.log(
        `  ${index + 1}. ${product.name} - ${
          product.images?.length || 0
        } imágenes`
      )
    })
  } catch (error) {
    console.log('✗ Error al leer productos:', error.message)
  }
} else {
  console.log('✗ Archivo data/products.json no encontrado')
}

console.log('\nVerificación completada.')
console.log('\nPara verificar la base de datos Supabase, visita:')
console.log('http://localhost:3005/api/products')
console.log(
  'http://localhost:3005/api/products?includeAll=true (requiere admin)'
)

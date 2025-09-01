import { supabaseBrowser } from '../lib/supabaseBrowser'

async function checkDatabaseImages() {
  const supabase = supabaseBrowser()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, images')
    .eq('status', 'active')
    .limit(5)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('=== PRODUCTOS EN BASE DE DATOS ===')
  products?.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.name}`)
    console.log(`   ID: ${product.id}`)
    console.log(`   Images:`, product.images)
    console.log(`   Type:`, typeof product.images)
    console.log(`   Is Array:`, Array.isArray(product.images))
    if (Array.isArray(product.images)) {
      product.images.forEach((img, i) => {
        console.log(`     Imagen ${i + 1}: ${img}`)
      })
    }
  })
}

// Ejecutar función si es llamada directamente
if (typeof window !== 'undefined') {
  checkDatabaseImages()
}

export { checkDatabaseImages }

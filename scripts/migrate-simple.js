// Script simple para migrar productos usando fetch
import fs from 'fs'
import path from 'path'

async function migrateProducts() {
  try {
    console.log('🚀 Iniciando migración de productos...')
    
    // Leer productos del JSON
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    console.log(`📦 Encontrados ${productsData.length} productos para migrar`)
    
    // Migrar cada producto usando la API
    for (const product of productsData) {
      try {
        const response = await fetch('http://localhost:3000/api/products-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: product.name,
            slug: product.slug,
            description: product.description,
            long_description: product.longDescription || '',
            price: product.price,
            compare_at: product.compareAt || null,
            category: product.category,
            sizes: product.sizes,
            colors: product.colors,
            images: product.images,
            tags: product.tags,
            stock: product.stock,
            featured: product.featured,
            sku: product.sku
          })
        })
        
        if (response.ok) {
          console.log(`✅ Producto migrado: ${product.name}`)
        } else {
          console.log(`⚠️ Producto ya existe: ${product.name}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando producto ${product.name}:`, error.message)
      }
    }
    
    console.log('🎉 ¡Migración completada!')
    
    // Verificar migración
    const response = await fetch('http://localhost:3000/api/products-db')
    const products = await response.json()
    console.log(`📊 Total de productos en la base de datos: ${products.length}`)
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  }
}

migrateProducts()

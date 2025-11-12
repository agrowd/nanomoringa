// Script para quitar promociones de todos los productos

async function removePromotions() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dripcore.vercel.app'
    
    console.log('Obteniendo todos los productos...')
    const response = await fetch(`${baseUrl}/api/products`)
    
    if (!response.ok) {
      throw new Error(`Error getting products: ${response.status}`)
    }
    
    const products = await response.json()
    console.log(`Encontrados ${products.length} productos`)
    
    for (const product of products) {
      console.log(`Actualizando producto: ${product.name}`)
      
      const updateResponse = await fetch(`${baseUrl}/api/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: product.id,
          is_on_sale: false,
          sale_price: null,
          sale_start_date: null,
          sale_end_date: null,
          sale_duration_days: 7
        })
      })
      
      if (updateResponse.ok) {
        console.log(`✓ Producto ${product.name} actualizado`)
      } else {
        const errorData = await updateResponse.json()
        console.error(`✗ Error actualizando ${product.name}:`, errorData)
      }
    }
    
    console.log('\n¡Promociones eliminadas exitosamente!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

removePromotions()


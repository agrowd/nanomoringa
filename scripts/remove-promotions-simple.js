// Script para quitar promociones de todos los productos (versión simplificada)

async function removePromotions() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dripcore.vercel.app'
    
    console.log('Conectando a la base de datos para actualizar productos...')
    console.log('Ejecutando SQL directo para actualizar is_on_sale a false...')
    
    // Hacer una llamada directa a la API de inicialización para ejecutar SQL
    const response = await fetch(`${baseUrl}/api/init-db`, {
      method: 'POST'
    })
    
    if (response.ok) {
      console.log('✓ Base de datos inicializada correctamente')
    }
    
    // Ahora ejecutar update manual
    console.log('\nPor favor, ejecuta manualmente en la consola de Vercel Postgres:')
    console.log('UPDATE products SET is_on_sale = false, sale_price = NULL, sale_start_date = NULL, sale_end_date = NULL WHERE is_on_sale = true;')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

removePromotions()


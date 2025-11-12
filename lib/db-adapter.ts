import type { Product } from './types'

// Función para adaptar los datos de la base de datos al formato del frontend
export function adaptProductFromDB(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description,
    longDescription: dbProduct.long_description || dbProduct.longDescription,
    long_description: dbProduct.long_description,
    price: dbProduct.price,
    compareAt: dbProduct.compare_at || dbProduct.compareAt,
    compare_at: dbProduct.compare_at,
    category: dbProduct.category,
    sizes: dbProduct.sizes || [],
    colors: dbProduct.colors || [],
    images: dbProduct.images || [],
    videos: dbProduct.videos || [],
    tags: dbProduct.tags || [],
    stock: dbProduct.stock || 0,
    featured: dbProduct.featured || false,
    sku: dbProduct.sku || '',
    createdAt: dbProduct.created_at || dbProduct.createdAt,
    created_at: dbProduct.created_at,
    // Campos de oferta
    is_on_sale: dbProduct.is_on_sale || false,
    sale_price: dbProduct.sale_price,
    sale_start_date: dbProduct.sale_start_date,
    sale_end_date: dbProduct.sale_end_date,
    sale_duration_days: dbProduct.sale_duration_days || 7
  }
}

// Función para adaptar los datos del frontend al formato de la base de datos
export function adaptProductToDB(frontendProduct: Partial<Product>): any {
  return {
    id: frontendProduct.id,
    name: frontendProduct.name,
    slug: frontendProduct.slug,
    description: frontendProduct.description,
    long_description: frontendProduct.longDescription || frontendProduct.long_description,
    price: frontendProduct.price,
    compare_at: frontendProduct.compareAt || frontendProduct.compare_at,
    category: frontendProduct.category,
    sizes: frontendProduct.sizes,
    colors: frontendProduct.colors,
    images: frontendProduct.images,
    videos: frontendProduct.videos,
    tags: frontendProduct.tags,
    stock: frontendProduct.stock,
    featured: frontendProduct.featured,
    sku: frontendProduct.sku,
    created_at: frontendProduct.createdAt || frontendProduct.created_at,
    // Campos de oferta
    is_on_sale: frontendProduct.is_on_sale,
    sale_price: frontendProduct.sale_price,
    sale_start_date: frontendProduct.sale_start_date,
    sale_end_date: frontendProduct.sale_end_date,
    sale_duration_days: frontendProduct.sale_duration_days
  }
}

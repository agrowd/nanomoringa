import { sql } from '@vercel/postgres'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  long_description?: string
  price: number
  compare_at?: number
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  videos?: string[]
  tags: string[]
  stock: number
  featured: boolean
  sku: string
  created_at: string
  // Campos para ofertas
  is_on_sale: boolean
  sale_price?: number
  sale_start_date?: string
  sale_end_date?: string
  sale_duration_days?: number
}

// Función para inicializar la tabla
export async function initDatabase() {
  try {
    await sql`
           CREATE TABLE IF NOT EXISTS products (
             id VARCHAR PRIMARY KEY,
             name VARCHAR NOT NULL,
             slug VARCHAR UNIQUE NOT NULL,
             description TEXT NOT NULL,
             long_description TEXT,
             price INTEGER NOT NULL,
             compare_at INTEGER,
             category VARCHAR NOT NULL,
             sizes TEXT[] NOT NULL DEFAULT '{}',
             colors TEXT[] NOT NULL DEFAULT '{}',
             images TEXT[] NOT NULL DEFAULT '{}',
             videos TEXT[] DEFAULT '{}',
             tags TEXT[] NOT NULL DEFAULT '{}',
             stock INTEGER NOT NULL DEFAULT 0,
             featured BOOLEAN NOT NULL DEFAULT false,
             sku VARCHAR NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             is_on_sale BOOLEAN NOT NULL DEFAULT false,
             sale_price INTEGER,
             sale_start_date TIMESTAMP,
             sale_end_date TIMESTAMP,
             sale_duration_days INTEGER DEFAULT 7
           )
    `
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
  }
}

// Obtener todos los productos
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`
    return rows as Product[]
  } catch (error) {
    console.error('Error getting products:', error)
    return []
  }
}

// Obtener producto por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`
    return (rows[0] as Product) || null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

// Crear producto
export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  try {
    const id = Date.now().toString()
    const createdAt = new Date().toISOString()
    
           const { rows } = await sql`
             INSERT INTO products (id, name, slug, description, long_description, price, compare_at, category, sizes, colors, images, videos, tags, stock, featured, sku, created_at)
             VALUES (${id}, ${product.name}, ${product.slug}, ${product.description}, ${product.long_description || ''}, ${product.price}, ${product.compare_at || null}, ${product.category}, ${product.sizes}, ${product.colors}, ${product.images}, ${product.videos || []}, ${product.tags}, ${product.stock}, ${product.featured}, ${product.sku}, ${createdAt})
             RETURNING *
           `
    
    return rows[0] as Product
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Actualizar producto
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at')
    
    if (fields.length === 0) {
      return await getProductById(id)
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
    const values = fields.map(key => updates[key as keyof Product])
    
    const { rows } = await sql`
      UPDATE products 
      SET ${sql.unsafe(setClause)}
      WHERE id = ${id}
      RETURNING *
    `
    
    return (rows[0] as Product) || null
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Eliminar producto
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { rowCount } = await sql`DELETE FROM products WHERE id = ${id}`
    return rowCount > 0
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

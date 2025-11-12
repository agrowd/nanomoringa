// Script para migrar productos de JSON a PostgreSQL
import { createClient } from '@vercel/postgres'
import fs from 'fs'
import path from 'path'

// Leer productos actuales
const productsPath = path.join(process.cwd(), 'data', 'products.json')
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

async function migrateProducts() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  })
  
  await client.connect()
  
  try {
    // Crear tabla si no existe
    await client.sql`
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
        tags TEXT[] NOT NULL DEFAULT '{}',
        stock INTEGER NOT NULL DEFAULT 0,
        featured BOOLEAN NOT NULL DEFAULT false,
        sku VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('✅ Tabla creada/verificada')
    
    // Migrar cada producto
    for (const product of productsData) {
      await client.sql`
        INSERT INTO products (
          id, name, slug, description, long_description, price, compare_at,
          category, sizes, colors, images, tags, stock, featured, sku, created_at
        ) VALUES (
          ${product.id},
          ${product.name},
          ${product.slug},
          ${product.description},
          ${product.longDescription || ''},
          ${product.price},
          ${product.compareAt || null},
          ${product.category},
          ${product.sizes},
          ${product.colors},
          ${product.images},
          ${product.tags},
          ${product.stock},
          ${product.featured},
          ${product.sku},
          ${product.createdAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          long_description = EXCLUDED.long_description,
          price = EXCLUDED.price,
          compare_at = EXCLUDED.compare_at,
          category = EXCLUDED.category,
          sizes = EXCLUDED.sizes,
          colors = EXCLUDED.colors,
          images = EXCLUDED.images,
          tags = EXCLUDED.tags,
          stock = EXCLUDED.stock,
          featured = EXCLUDED.featured,
          sku = EXCLUDED.sku
      `
      
      console.log(`✅ Producto migrado: ${product.name}`)
    }
    
    console.log('🎉 Migración completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await client.end()
  }
}

migrateProducts()

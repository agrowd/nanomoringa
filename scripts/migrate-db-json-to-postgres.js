/**
 * Script para migrar datos de db.json a PostgreSQL
 * 
 * Uso:
 * node scripts/migrate-db-json-to-postgres.js
 */

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

async function migrate() {
  try {
    console.log('🔄 Iniciando migración de db.json a PostgreSQL...')
    
    // Leer db.json
    const dbJsonPath = path.join(__dirname, '..', 'bot-nanomoringa', 'db.json')
    
    if (!fs.existsSync(dbJsonPath)) {
      console.log('⚠️  No se encontró db.json, saltando migración')
      return
    }
    
    const dbJson = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'))
    const phoneNumbers = Object.keys(dbJson).filter(key => key.includes('@c.us'))
    
    console.log(`📊 Encontrados ${phoneNumbers.length} números en db.json`)
    
    let migrated = 0
    let errors = 0
    
    for (const phone of phoneNumbers) {
      try {
        // Extraer número limpio (sin @c.us)
        const cleanPhone = phone.replace('@c.us', '')
        
        // Verificar si ya existe
        const existing = await pool.query(
          'SELECT id FROM whatsapp_conversations WHERE phone = $1',
          [phone]
        )
        
        if (existing.rows.length > 0) {
          console.log(`⏭️  ${phone} ya existe, saltando...`)
          continue
        }
        
        // Crear conversación
        await pool.query(
          `INSERT INTO whatsapp_conversations (phone, name, status, created_at, updated_at)
           VALUES ($1, $2, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT (phone) DO NOTHING`,
          [phone, `Usuario ${cleanPhone}`]
        )
        
        migrated++
        console.log(`✅ Migrado: ${phone}`)
      } catch (error) {
        console.error(`❌ Error migrando ${phone}:`, error.message)
        errors++
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 RESUMEN DE MIGRACIÓN:')
    console.log(`✅ Migrados: ${migrated}`)
    console.log(`❌ Errores: ${errors}`)
    console.log(`📊 Total: ${phoneNumbers.length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (error) {
    console.error('❌ Error en migración:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()


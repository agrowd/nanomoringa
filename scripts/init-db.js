// Script para inicializar la tabla de productos
import fs from 'fs'

async function initDatabase() {
  try {
    console.log('🚀 Inicializando base de datos...')
    
    const response = await fetch('http://localhost:3000/api/init-db', {
      method: 'POST'
    })
    
    if (response.ok) {
      console.log('✅ Base de datos inicializada correctamente')
    } else {
      console.log('⚠️ La base de datos ya existe o hubo un error')
    }
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error)
  }
}

initDatabase()

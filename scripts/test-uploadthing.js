// Script para verificar que Uploadthing esté configurado correctamente
const testUploadthing = async () => {
  console.log('🔍 Verificando configuración de Uploadthing...\n')

  // Verificar variables de entorno
  const secret = process.env.UPLOADTHING_SECRET
  const appId = process.env.UPLOADTHING_APP_ID

  console.log('📋 Variables de entorno:')
  console.log(`  UPLOADTHING_SECRET: ${secret ? '✅ Configurada' : '❌ FALTA'}`)
  console.log(`  UPLOADTHING_APP_ID: ${appId ? '✅ Configurada' : '❌ FALTA'}`)

  if (!secret || !appId) {
    console.log('\n❌ ERROR: Faltan variables de entorno')
    console.log('   Agrega UPLOADTHING_SECRET y UPLOADTHING_APP_ID a tu .env.local')
    process.exit(1)
  }

  // Verificar formato de la secret key
  if (!secret.startsWith('sk_live_') && !secret.startsWith('sk_test_')) {
    console.log('\n⚠️  ADVERTENCIA: La SECRET key no tiene el formato esperado')
    console.log('   Debería empezar con "sk_live_" o "sk_test_"')
  }

  // Verificar que el endpoint existe
  try {
    const fs = require('fs')
    const path = require('path')
    
    const corePath = path.join(process.cwd(), 'app', 'api', 'uploadthing', 'core.ts')
    const routePath = path.join(process.cwd(), 'app', 'api', 'uploadthing', 'route.ts')
    
    if (fs.existsSync(corePath) && fs.existsSync(routePath)) {
      console.log('\n✅ Archivos de Uploadthing encontrados:')
      console.log('   ✅ app/api/uploadthing/core.ts')
      console.log('   ✅ app/api/uploadthing/route.ts')
    } else {
      console.log('\n❌ ERROR: No se encontraron los archivos de Uploadthing')
      process.exit(1)
    }
  } catch (error) {
    console.log('\n⚠️  No se pudo verificar los archivos:', error.message)
  }

  console.log('\n✅ Configuración básica correcta')
  console.log('\n📝 Próximos pasos:')
  console.log('   1. Reinicia el servidor: pnpm dev')
  console.log('   2. Ve a /admin/productos/nuevo')
  console.log('   3. Intenta subir una imagen o video')
  console.log('   4. Verifica que se suba correctamente a Uploadthing')
}

testUploadthing()


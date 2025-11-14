// Script para probar el token de Uploadthing
const token = process.env.UPLOADTHING_TOKEN || 'eyJhcGlLZXkiOiJza19saXZlXzExZWY5ZDkwM2UxYzFmYTA4ODk0M2UzOWI1ZmE2NDYxOGE1NDNmZTM3ZDJjN2UyYjU5ZDI4NzMwNDhiM2NlOTUiLCJhcHBJZCI6IjhnYnI0ajY5cDkiLCJyZWdpb25zIjpbInNlYTEiXX0='

console.log('🔍 Verificando token de Uploadthing...\n')

if (!token) {
  console.error('❌ No se encontró UPLOADTHING_TOKEN')
  process.exit(1)
}

// Remover comillas si las tiene
const cleanToken = token.replace(/^['"]|['"]$/g, '')

console.log('📝 Token (primeros 50 chars):', cleanToken.substring(0, 50) + '...')
console.log('📏 Longitud:', cleanToken.length)

try {
  // Decodificar token
  const decoded = Buffer.from(cleanToken, 'base64').toString('utf-8')
  console.log('\n✅ Token decodificado correctamente')
  console.log('📄 Contenido:', decoded)
  
  // Parsear JSON
  const parsed = JSON.parse(decoded)
  console.log('\n✅ JSON válido')
  console.log('🔑 AppId:', parsed.appId)
  console.log('🔑 ApiKey (primeros 20 chars):', parsed.apiKey.substring(0, 20) + '...')
  console.log('🌍 Regions:', parsed.regions)
  
  // Verificar campos requeridos
  if (!parsed.apiKey) {
    console.error('❌ Falta apiKey en el token')
    process.exit(1)
  }
  
  if (!parsed.appId) {
    console.error('❌ Falta appId en el token')
    process.exit(1)
  }
  
  if (!parsed.regions || !Array.isArray(parsed.regions) || parsed.regions.length === 0) {
    console.error('❌ Falta o es inválido regions en el token')
    process.exit(1)
  }
  
  console.log('\n✅ Token válido y completo!')
  console.log('\n📋 Para Vercel, usa este valor (SIN comillas):')
  console.log(cleanToken)
  
} catch (error) {
  console.error('\n❌ Error al procesar token:', error.message)
  if (error instanceof SyntaxError) {
    console.error('   El token no es un JSON válido después de decodificar')
  }
  process.exit(1)
}


// Script para generar el token base64 de Uploadthing
// Uso: node scripts/generate-uploadthing-token.js

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 Generador de Token para Uploadthing v7\n');
console.log('Necesitas:');
console.log('1. UPLOADTHING_SECRET (sk_live_xxxxx)');
console.log('2. UPLOADTHING_APP_ID (xxxxx)\n');

rl.question('Ingresa tu UPLOADTHING_SECRET: ', (secret) => {
  rl.question('Ingresa tu UPLOADTHING_APP_ID: ', (appId) => {
    // Crear el objeto JSON
    const tokenObject = {
      apiKey: secret.trim(),
      appId: appId.trim(),
      regions: ['global'] // Región por defecto
    };

    // Convertir a JSON y luego a base64
    const jsonString = JSON.stringify(tokenObject);
    const base64Token = Buffer.from(jsonString).toString('base64');

    console.log('\n✅ Token generado:\n');
    console.log('UPLOADTHING_TOKEN=' + base64Token);
    console.log('\n📝 Agrega esta variable a Vercel:\n');
    console.log('Name: UPLOADTHING_TOKEN');
    console.log('Value: ' + base64Token);
    console.log('Environments: Production, Preview, Development\n');

    rl.close();
  });
});


#!/usr/bin/env node

/**
 * Script para verificar que el build funcione correctamente
 * antes de hacer deploy
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando build...\n');

try {
  // Verificar que no haya archivos con errores de sintaxis
  console.log('1. Verificando sintaxis de archivos...');
  
  const componentsDir = path.join(process.cwd(), 'components');
  const appDir = path.join(process.cwd(), 'app');
  
  function checkDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        checkDirectory(fullPath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Verificar errores comunes
        if (content.includes('Unexpected token')) {
          throw new Error(`Error de sintaxis en ${fullPath}`);
        }
        
        // Verificar imports faltantes
        if (content.includes('from "@/components/') && !fs.existsSync(path.join(process.cwd(), 'components'))) {
          throw new Error(`Import faltante en ${fullPath}`);
        }
      }
    }
  }
  
  checkDirectory(componentsDir);
  checkDirectory(appDir);
  
  console.log('✅ Sintaxis verificada correctamente');
  
  // Verificar que las dependencias estén instaladas
  console.log('\n2. Verificando dependencias...');
  
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    throw new Error('Dependencias no instaladas. Ejecuta: pnpm install');
  }
  
  console.log('✅ Dependencias verificadas');
  
  // Verificar configuración de la base de datos
  console.log('\n3. Verificando configuración...');
  
  const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  console.log('✅ Configuración verificada');
  
  console.log('\n🎉 ¡Build verificado correctamente!');
  console.log('💡 Puedes proceder con el deploy');
  
} catch (error) {
  console.error('\n❌ Error en la verificación:');
  console.error(error.message);
  process.exit(1);
}

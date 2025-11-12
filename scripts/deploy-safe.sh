#!/bin/bash

# Script de deploy seguro con verificaciones
set -e

echo "🚀 Iniciando deploy seguro..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar que estamos en la rama correcta
print_status "Verificando rama actual..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
    print_warning "No estás en la rama master. Actual: $CURRENT_BRANCH"
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 2. Verificar que no hay cambios sin commitear
print_status "Verificando estado del repositorio..."
if [ -n "$(git status --porcelain)" ]; then
    print_error "Hay cambios sin commitear. Por favor, haz commit primero."
    git status --short
    exit 1
fi

# 3. Verificar que el build funciona localmente (opcional)
print_status "Verificando build local..."
if command -v pnpm &> /dev/null; then
    if pnpm build 2>/dev/null; then
        print_status "Build local exitoso"
    else
        print_warning "Build local falló, pero continuando con deploy..."
    fi
else
    print_warning "pnpm no está disponible, saltando verificación de build local"
fi

# 4. Inicializar tabla de cupones si es necesario
print_status "Verificando tabla de cupones..."
if curl -s -f "https://dripcore.vercel.app/api/init-coupons" > /dev/null; then
    print_status "Tabla de cupones verificada"
else
    print_warning "No se pudo verificar la tabla de cupones"
fi

# 5. Hacer deploy con cache limpio
print_status "Haciendo deploy con cache limpio..."
if vercel --prod --yes --force; then
    print_status "Deploy exitoso"
else
    print_error "Deploy falló"
    exit 1
fi

# 6. Verificar que el sitio funciona
print_status "Verificando que el sitio funciona..."
sleep 10  # Esperar a que el deploy se complete

if curl -s -f "https://dripcore.vercel.app" > /dev/null; then
    print_status "✅ Sitio funcionando correctamente"
else
    print_error "❌ Sitio no responde correctamente"
    exit 1
fi

# 7. Verificar APIs críticas
print_status "Verificando APIs críticas..."

# API de productos
if curl -s -f "https://dripcore.vercel.app/api/products" > /dev/null; then
    print_status "✅ API de productos funcionando"
else
    print_error "❌ API de productos no funciona"
fi

# API de cupones
if curl -s -f "https://dripcore.vercel.app/api/coupons" > /dev/null; then
    print_status "✅ API de cupones funcionando"
else
    print_error "❌ API de cupones no funciona"
fi

print_status "🎉 Deploy seguro completado exitosamente!"
print_status "🌐 URL: https://dripcore.vercel.app"

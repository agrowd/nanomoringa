#!/bin/bash

# Script para verificar especificaciones del VPS
# Medicina Natural E-commerce

echo "======================================"
echo "VERIFICACIÓN DE VPS - MEDICINA NATURAL"
echo "======================================"
echo ""

echo "🔐 Conectando a VPS..."
echo "Host: 149.50.128.73:5782"
echo "Usuario: root"
echo ""

# Nota: En Windows PowerShell, usar:
# ssh -p 5782 root@149.50.128.73

echo "📋 Comandos a ejecutar una vez conectado:"
echo ""
echo "1. Verificar RAM disponible:"
echo "   free -h"
echo ""
echo "2. Verificar CPU cores:"
echo "   nproc"
echo ""
echo "3. Verificar almacenamiento:"
echo "   df -h"
echo ""
echo "4. Verificar Docker instalado:"
echo "   docker --version"
echo "   docker-compose --version"
echo ""
echo "5. Verificar sistema operativo:"
echo "   cat /etc/os-release"
echo ""
echo "6. Verificar puertos disponibles:"
echo "   netstat -tulpn | grep LISTEN"
echo ""
echo "7. Verificar directorio actual:"
echo "   pwd"
echo "   ls -la"
echo ""

echo "======================================"
echo "Para conectar desde PowerShell:"
echo "ssh -p 5782 root@149.50.128.73"
echo "Password: FedeServer.2937"
echo "======================================"


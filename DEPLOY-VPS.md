# Guía de Despliegue en VPS - DripCore E-commerce

## 📦 Información de la Copia

Este proyecto ha sido optimizado para despliegue en VPS:

- **Tamaño original**: 1455.79 MB
- **Tamaño optimizado**: 17.02 MB
- **Ahorro**: 1438.77 MB (98.8%)

### Archivos/Directorios Excluidos

Los siguientes elementos fueron excluidos y deberán ser regenerados/reinstalados:

- ✅ `node_modules/` - Instalar con `pnpm install`
- ✅ `.next/` - Generar con `pnpm build`
- ✅ `.vercel/` - Datos específicos de Vercel (no necesarios)
- ✅ `.git/` - Historial de Git (opcional)
- ✅ `*.log` - Archivos de log

---

## 🚀 Pasos para Desplegar en VPS

### 1. Subir el Proyecto al VPS

```bash
# Desde tu máquina local (usando scp, rsync, o FTP)
scp -r dripcore-ecommerce-vps usuario@tu-servidor-vps:/ruta/destino/
```

O comprimir y subir:
```bash
# Comprimir localmente
tar -czf dripcore-vps.tar.gz dripcore-ecommerce-vps/

# Subir al VPS
scp dripcore-vps.tar.gz usuario@tu-servidor-vps:/ruta/destino/

# En el VPS, descomprimir
tar -xzf dripcore-vps.tar.gz
```

### 2. Instalar Node.js en el VPS (si no está instalado)

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm globalmente
npm install -g pnpm
```

### 3. Configurar Variables de Entorno

```bash
cd dripcore-ecommerce-vps

# Crear archivo .env.local (o .env)
nano .env.local
```

Agregar tus variables de entorno necesarias:
```env
# Base de datos
KV_REST_API_URL=tu_url_de_redis
KV_REST_API_TOKEN=tu_token

# Autenticación admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_seguro

# URLs
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com

# Otros...
```

### 4. Instalar Dependencias

```bash
pnpm install
```

### 5. Construir el Proyecto

```bash
pnpm build
```

### 6. Iniciar el Servidor

#### Modo Producción con PM2 (Recomendado)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start npm --name "dripcore" -- start

# Guardar configuración de PM2
pm2 save
pm2 startup
```

#### Modo Producción Simple

```bash
pnpm start
```

#### Modo Desarrollo

```bash
pnpm dev
```

---

## 🔧 Configuración Nginx (Opcional)

Si usas Nginx como proxy inverso:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Para habilitar HTTPS con Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 📋 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia el servidor de producción
- `pnpm lint` - Ejecuta el linter

---

## 🗄️ Inicialización de Base de Datos

Si necesitas inicializar la base de datos:

```bash
# Mediante API endpoints
curl http://localhost:3000/api/init-db
curl http://localhost:3000/api/init-coupons
```

---

## 📊 Monitoreo con PM2

```bash
# Ver estado de aplicaciones
pm2 status

# Ver logs en tiempo real
pm2 logs dripcore

# Reiniciar aplicación
pm2 restart dripcore

# Detener aplicación
pm2 stop dripcore

# Eliminar aplicación
pm2 delete dripcore
```

---

## 🔒 Seguridad

1. **Firewall**: Asegúrate de tener configurado el firewall (UFW en Ubuntu)
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

2. **Variables de entorno**: Nunca compartas tu archivo `.env.local`

3. **Contraseñas**: Usa contraseñas seguras para el admin

4. **Actualizaciones**: Mantén el sistema actualizado
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 🆘 Solución de Problemas

### Error de puerto en uso
```bash
# Ver qué proceso usa el puerto 3000
sudo lsof -i :3000

# Matar proceso
kill -9 PID
```

### Problemas con permisos
```bash
# Dar permisos al usuario actual
sudo chown -R $USER:$USER /ruta/al/proyecto
```

### Logs de errores
```bash
# Ver logs de PM2
pm2 logs dripcore --lines 100

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 Soporte

Para más información, consulta:
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de PM2](https://pm2.keymetrics.io/)
- Archivos `README.md` y `TROUBLESHOOTING.md` del proyecto


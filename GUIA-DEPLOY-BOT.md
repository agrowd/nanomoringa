# 🚀 GUÍA PASO A PASO - DEPLOY DEL BOT

## ✅ PASO 1: BASE DE DATOS INICIALIZADA

Ya tienes las tablas creadas en PostgreSQL:
- ✅ `whatsapp_sessions` - Estado del bot
- ✅ `whatsapp_conversations` - Conversaciones
- ✅ `whatsapp_messages` - Mensajes
- ✅ `whatsapp_bot_messages` - Cadena de mensajes

---

## 📋 PASO 2: CONFIGURAR VARIABLES EN VERCEL

### ¿Qué necesitas hacer?

1. **Ir a Vercel:**
   - Ve a https://vercel.com
   - Selecciona tu proyecto `nanomoringa`
   - Ve a **Settings** → **Environment Variables**

2. **Agregar variable:**
   - **Key:** `WHATSAPP_BOT_URL`
   - **Value:** `http://149.50.128.73:7002`
   - **Environments:** Marca todas (Production, Preview, Development)
   - Haz clic en **Save**

3. **Hacer nuevo deploy:**
   - Ve a **Deployments**
   - Haz clic en **Redeploy** en el último deployment
   - O simplemente espera a que Vercel detecte el cambio automáticamente

**⏱️ Tiempo estimado:** 5 minutos

---

## 📋 PASO 3: DEPLOYAR EL BOT EN EL VPS

### Opción A: Con Docker (Recomendado) 🐳

#### 3.1. Subir código al VPS

**Desde tu máquina local:**

```bash
# Asegúrate de estar en la carpeta del proyecto
cd C:\Users\Try Hard\Desktop\Nexte\medicinanatural-ecommerce-vps

# Subir carpeta del bot (reemplaza 'usuario' con tu usuario del VPS)
scp -P 5782 -r bot-nanomoringa/ usuario@149.50.128.73:/home/usuario/
```

**Si no tienes acceso SSH configurado:**
- Puedes usar FileZilla o similar
- O subir el código vía Git en el VPS

#### 3.2. Conectar al VPS

```bash
ssh -p 5782 usuario@149.50.128.73
```

#### 3.3. Instalar Docker

```bash
# Actualizar sistema
sudo apt update

# Instalar Docker
sudo apt install -y docker.io docker-compose

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión (salir y volver a entrar)
exit
ssh -p 5782 usuario@149.50.128.73
```

#### 3.4. Configurar variables de entorno

```bash
cd /home/usuario/bot-nanomoringa

# Crear archivo .env
nano .env
```

**Agregar estas líneas (usa la misma DATABASE_URL que está en Vercel):**

```env
DATABASE_URL=postgresql://usuario:password@ep-XXXX.region.neon.tech/neondb?sslmode=require
WEB_APP_URL=https://nanomoringa.vercel.app
PORT=7002
```

**Para guardar en nano:**
- Presiona `Ctrl + X`
- Presiona `Y` para confirmar
- Presiona `Enter` para guardar

#### 3.5. Construir y ejecutar

```bash
# Construir imagen
docker-compose build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f
```

**Para salir de los logs:** Presiona `Ctrl + C`

---

### Opción B: Sin Docker (Directo con Node.js) 📦

#### 3.1. Instalar Node.js

```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### 3.2. Instalar dependencias del sistema

```bash
sudo apt-get update
sudo apt-get install -y \
  wget gnupg ca-certificates fonts-liberation \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 \
  libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgbm1 libgcc1 \
  libglib2.0-0 libgtk-3-0 libnspr4 libnss3 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 \
  libxi6 libxrandr2 libxrender1 libxss1 \
  libxtst6 lsb-release xdg-utils
```

#### 3.3. Configurar variables de entorno

```bash
cd /home/usuario/bot-nanomoringa

# Crear archivo .env
nano .env
```

**Agregar:**
```env
DATABASE_URL=postgresql://usuario:password@ep-XXXX.region.neon.tech/neondb?sslmode=require
WEB_APP_URL=https://nanomoringa.vercel.app
PORT=7002
```

#### 3.4. Instalar dependencias y ejecutar

```bash
# Instalar dependencias
npm install

# Instalar PM2 (para que siga corriendo)
sudo npm install -g pm2

# Ejecutar con PM2
pm2 start server.js --name whatsapp-bot

# Guardar configuración
pm2 save

# Configurar para que inicie automáticamente
pm2 startup
# Copia y ejecuta el comando que te muestra

# Ver logs
pm2 logs whatsapp-bot
```

---

## 📋 PASO 4: CONFIGURAR FIREWALL

### Abrir puerto 7002

```bash
# Si usas UFW
sudo ufw allow 7002/tcp
sudo ufw reload

# Si usas iptables
sudo iptables -A INPUT -p tcp --dport 7002 -j ACCEPT
sudo iptables-save
```

---

## 📋 PASO 5: VERIFICAR QUE FUNCIONA

### 5.1. Verificar que el bot está corriendo

**Con Docker:**
```bash
docker-compose ps
# Deberías ver "whatsapp-bot" con estado "Up"
```

**Con PM2:**
```bash
pm2 status
# Deberías ver "whatsapp-bot" con estado "online"
```

### 5.2. Verificar que la API responde

```bash
curl http://149.50.128.73:7002/api/health
```

**Deberías ver:**
```json
{
  "status": "ok",
  "whatsapp_state": "DISCONNECTED" o "CONNECTED",
  "connected": false o true
}
```

### 5.3. Verificar QR code en la web

1. Ve a: `https://nanomoringa.vercel.app/admin/whatsapp-configuracion`
2. Deberías ver el QR code
3. Escanea el QR con WhatsApp
4. El bot debería conectarse

---

## 🧪 PASO 6: TESTING

### 6.1. Enviar mensaje de prueba

1. Envía un mensaje al número de WhatsApp conectado
2. Ve a: `https://nanomoringa.vercel.app/admin/whatsapp`
3. Deberías ver el mensaje en la lista de conversaciones

### 6.2. Responder desde la web

1. Selecciona una conversación
2. Envía un mensaje
3. Verifica que llegue a WhatsApp

### 6.3. Verificar threading

1. Responde a un mensaje específico
2. Verifica que aparezca como respuesta en WhatsApp

### 6.4. Verificar imágenes

1. Envía una imagen desde la web
2. Verifica que llegue a WhatsApp

---

## 🆘 TROUBLESHOOTING

### El bot no se conecta a PostgreSQL

**Verificar:**
- Que `DATABASE_URL` sea correcta (la misma que en Vercel)
- Que las tablas existan (ejecuta `/api/whatsapp/init-db` de nuevo)
- Que PostgreSQL acepte conexiones desde el VPS

**Logs:**
```bash
# Docker
docker-compose logs -f

# PM2
pm2 logs whatsapp-bot
```

### El bot no responde a `/api/health`

**Verificar:**
- Que el puerto 5000 esté abierto en el firewall
- Que el bot esté corriendo
- Que el puerto 5000 no esté siendo usado por otro proceso

**Comandos:**
```bash
# Verificar puerto
sudo netstat -tlnp | grep 7002

# Verificar firewall
sudo ufw status
```

### El QR code no aparece

**Verificar:**
- Que `WHATSAPP_BOT_URL` esté configurada en Vercel
- Que el bot esté corriendo y accesible
- Que el deploy en Vercel haya terminado

**Verificar logs:**
```bash
# Docker
docker-compose logs -f

# PM2
pm2 logs whatsapp-bot
```

### Los mensajes no se guardan

**Verificar:**
- Que las tablas existan en PostgreSQL
- Que la conexión a PostgreSQL funcione desde el bot
- Que `DATABASE_URL` sea correcta

**Probar conexión:**
```bash
# Desde el VPS
psql $DATABASE_URL -c "SELECT COUNT(*) FROM whatsapp_conversations;"
```

---

## ✅ CHECKLIST FINAL

- [ ] Variables de entorno configuradas en Vercel
- [ ] Bot desplegado en VPS
- [ ] Firewall configurado (puerto 7002 abierto)
- [ ] Bot corriendo y conectado a PostgreSQL
- [ ] API del bot respondiendo (`/api/health`)
- [ ] QR code visible en `/admin/whatsapp-configuracion`
- [ ] Bot conectado a WhatsApp (QR escaneado)
- [ ] Mensajes llegando desde WhatsApp
- [ ] Mensajes enviándose desde la web
- [ ] Threading funcionando
- [ ] Imágenes funcionando

---

## 📞 PRÓXIMOS PASOS

Una vez que el bot esté funcionando:

1. **Configurar monitoreo:**
   - Alertas si el bot se cae
   - Logs rotativos
   - Backups de la BD

2. **Optimizar:**
   - Auto-restart si el bot se cae
   - Límites de recursos
   - Rate limiting

3. **Configurar dominio (opcional):**
   - DNS A record apuntando a la IP del VPS
   - Nginx como reverse proxy
   - SSL con Let's Encrypt

---

**⏱️ Tiempo estimado total:** 1-2 horas

**Última actualización:** 2025-11-14
**Estado:** Base de datos inicializada ✅ - Listo para deploy del bot


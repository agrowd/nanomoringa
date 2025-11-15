# 🚀 SIGUIENTE PASO - DEPLOY DEL BOT

## ✅ COMPLETADO

1. ✅ **Base de datos inicializada** - Las tablas están creadas en PostgreSQL

## 📋 PRÓXIMOS PASOS

### PASO 1: Configurar Variables de Entorno en Vercel (5 min) ⚠️ PRIORITARIO

**Necesitas agregar la URL del bot en Vercel:**

1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega esta variable:
   ```
   WHATSAPP_BOT_URL=http://149.50.128.73:7002
   ```
3. Asegúrate de que esté configurada para **Production**, **Preview** y **Development**
4. Haz un nuevo deploy (Vercel lo hará automáticamente al detectar el cambio)

**Nota:** Necesitarás la IP del VPS y el puerto donde estará corriendo el bot (7002).

---

### PASO 2: Preparar el Bot en el VPS (30 min) ⚠️ PRIORITARIO

**Opciones para deployar el bot:**

#### Opción A: Usando Docker (Recomendado)

1. **Subir código al VPS:**
   ```bash
   # Desde tu máquina local
   scp -P 5782 -r bot-nanomoringa/ usuario@149.50.128.73:/home/usuario/bot-nanomoringa
   ```

2. **Conectar al VPS:**
   ```bash
   ssh -p 5782 usuario@149.50.128.73
   ```

3. **Instalar Docker (si no está instalado):**
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   # Reiniciar sesión SSH para que los cambios surtan efecto
   ```

4. **Configurar variables de entorno:**
   ```bash
   cd /home/usuario/bot-nanomoringa
   nano .env
   ```
   
   Agregar:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   WEB_APP_URL=https://nanomoringa.vercel.app
   PORT=7002
   ```
   
   **IMPORTANTE:** Usa la misma `DATABASE_URL` que está en Vercel (Neon PostgreSQL)

5. **Construir y ejecutar:**
   ```bash
   docker-compose up -d
   ```

6. **Verificar logs:**
   ```bash
   docker-compose logs -f
   ```

#### Opción B: Sin Docker (Directo con Node.js)

1. **Conectar al VPS:**
   ```bash
   ssh -p 5782 usuario@149.50.128.73
   ```

2. **Instalar Node.js (si no está instalado):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Instalar dependencias del sistema para Puppeteer:**
   ```bash
   sudo apt-get install -y \
     wget \
     gnupg \
     ca-certificates \
     fonts-liberation \
     libasound2 \
     libatk-bridge2.0-0 \
     libatk1.0-0 \
     libc6 \
     libcairo2 \
     libcups2 \
     libdbus-1-3 \
     libexpat1 \
     libfontconfig1 \
     libgbm1 \
     libgcc1 \
     libglib2.0-0 \
     libgtk-3-0 \
     libnspr4 \
     libnss3 \
     libpango-1.0-0 \
     libpangocairo-1.0-0 \
     libstdc++6 \
     libx11-6 \
     libx11-xcb1 \
     libxcb1 \
     libxcomposite1 \
     libxcursor1 \
     libxdamage1 \
     libxext6 \
     libxfixes3 \
     libxi6 \
     libxrandr2 \
     libxrender1 \
     libxss1 \
     libxtst6 \
     lsb-release \
     xdg-utils
   ```

4. **Configurar variables de entorno:**
   ```bash
   cd /home/usuario/bot-nanomoringa
   nano .env
   ```
   
   Agregar:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   WEB_APP_URL=https://nanomoringa.vercel.app
   PORT=7002
   ```

5. **Instalar dependencias:**
   ```bash
   npm install
   ```

6. **Ejecutar con PM2 (para que siga corriendo):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name whatsapp-bot
   pm2 save
   pm2 startup
   ```

---

### PASO 3: Configurar Firewall del VPS (5 min)

**Asegúrate de que el puerto 7002 esté abierto:**

```bash
# Si usas UFW
sudo ufw allow 7002/tcp
sudo ufw reload

# Si usas iptables
sudo iptables -A INPUT -p tcp --dport 7002 -j ACCEPT
sudo iptables-save
```

---

### PASO 4: Verificar que el Bot Funciona (10 min)

1. **Verificar que el bot está corriendo:**
   ```bash
   # Con Docker
   docker-compose ps
   docker-compose logs -f
   
   # Con PM2
   pm2 status
   pm2 logs whatsapp-bot
   ```

2. **Verificar que la API responde:**
   ```bash
   curl http://149.50.128.73:7002/api/health
   ```
   
   Deberías ver:
   ```json
   {
     "status": "ok",
     "whatsapp_state": "DISCONNECTED" o "CONNECTED",
     "connected": false o true
   }
   ```

3. **Verificar QR code en la web:**
   - Ve a `https://nanomoringa.vercel.app/admin/whatsapp-configuracion`
   - Deberías ver el QR code para escanear
   - Escanea el QR con WhatsApp
   - El bot debería conectarse

---

### PASO 5: Testing End-to-End (15 min)

1. **Enviar mensaje de prueba desde WhatsApp:**
   - Envía un mensaje al número de WhatsApp conectado
   - Verifica que el mensaje aparezca en `/admin/whatsapp`

2. **Responder desde la web:**
   - Ve a `/admin/whatsapp`
   - Selecciona una conversación
   - Envía un mensaje
   - Verifica que llegue a WhatsApp

3. **Verificar threading:**
   - Responde a un mensaje específico
   - Verifica que aparezca como respuesta en WhatsApp

4. **Verificar imágenes:**
   - Envía una imagen desde la web
   - Verifica que llegue a WhatsApp

---

## 📝 CHECKLIST FINAL

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

## 🆘 TROUBLESHOOTING

### El bot no se conecta a PostgreSQL
- Verifica que `DATABASE_URL` sea correcta
- Verifica que las tablas existan (ejecuta `/api/whatsapp/init-db` de nuevo)
- Verifica que PostgreSQL acepte conexiones desde el VPS

### El bot no responde a `/api/health`
- Verifica que el puerto 7002 esté abierto en el firewall
- Verifica que el bot esté corriendo: `docker-compose ps` o `pm2 status`
- Verifica los logs: `docker-compose logs -f` o `pm2 logs whatsapp-bot`

### El QR code no aparece
- Verifica que `WHATSAPP_BOT_URL` esté configurada en Vercel
- Verifica que el bot esté corriendo y accesible
- Verifica los logs del bot para ver errores

### Los mensajes no se guardan
- Verifica que las tablas existan en PostgreSQL
- Verifica la conexión a PostgreSQL desde el bot
- Verifica los logs del bot

---

## 📞 PRÓXIMOS PASOS DESPUÉS DEL DEPLOY

Una vez que el bot esté corriendo:

1. **Configurar dominio (opcional):**
   - Si quieres usar un dominio en lugar de IP
   - Configurar DNS A record apuntando a la IP del VPS
   - Configurar Nginx como reverse proxy
   - Configurar SSL con Let's Encrypt

2. **Configurar monitoreo:**
   - Configurar alertas si el bot se cae
   - Configurar logs rotativos
   - Configurar backups de la BD

3. **Optimizar:**
   - Configurar auto-restart si el bot se cae
   - Configurar límites de recursos
   - Configurar rate limiting

---

**Última actualización:** 2025-11-14
**Estado:** Base de datos inicializada ✅ - Listo para deploy del bot


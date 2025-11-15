# 🐳 GUÍA DEPLOY CON DOCKER DESDE GITHUB

## 📋 ACLARACIONES IMPORTANTES

### ✅ Puertos - NO HAY CONFLICTO

1. **Puerto 5782 (SSH):** 
   - Es solo para conectarte al servidor
   - Puedes usarlo para otros sistemas sin problema
   - NO se usa para el bot
   - Es solo para acceso SSH

2. **Puerto 7002 (Bot):**
   - Este es el puerto que el bot usará para su API
   - Es DIFERENTE al 5782
   - No hay conflicto con otros sistemas
   - Solo necesitas que esté abierto en el firewall

### 🎯 Resumen:
- **Puerto 5782:** SSH (acceso al servidor) ✅ Sin problema
- **Puerto 7002:** Bot API (comunicación con Vercel) ✅ Sin problema

---

## 🚀 OPCIÓN RECOMENDADA: DEPLOY DESDE GITHUB

### ✅ Ventajas de usar GitHub:
- ✅ Código versionado y actualizado
- ✅ Fácil de mantener y actualizar
- ✅ No necesitas subir archivos manualmente
- ✅ Más profesional y escalable
- ✅ Puedes hacer cambios y actualizar fácilmente

### 📦 ¿El código está en GitHub?
Sí, el código del bot está en el mismo repositorio. Solo necesitas clonarlo en el VPS.

---

## 📋 PASO A PASO - DEPLOY CON DOCKER DESDE GITHUB

### PASO 1: Conectar al VPS

```bash
ssh -p 5782 usuario@149.50.128.73
```

**Nota:** El puerto 5782 es solo para SSH, no hay problema si lo usas para otros sistemas.

---

### PASO 2: Instalar Docker (si no está instalado)

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

# Verificar instalación
docker --version
docker-compose --version

# Reiniciar sesión (salir y volver a entrar)
exit
ssh -p 5782 usuario@149.50.128.73
```

---

### PASO 3: Instalar Git (si no está instalado)

```bash
# Instalar Git
sudo apt install -y git

# Verificar instalación
git --version
```

---

### PASO 4: Clonar el Repositorio del Bot

```bash
# Crear carpeta para el proyecto
mkdir -p ~/projects
cd ~/projects

# Clonar el repositorio del bot (repositorio separado)
git clone git@github.com:agrowd/bot-nanomoringa.git

# O si prefieres usar HTTPS:
# git clone https://github.com/agrowd/bot-nanomoringa.git

# Ir a la carpeta del bot
cd bot-nanomoringa
```

**⚠️ IMPORTANTE:**
- El bot tiene su propio repositorio: `git@github.com:agrowd/bot-nanomoringa.git`
- Necesitas acceso a este repositorio (SSH keys configuradas o HTTPS con credenciales)
- Si usas SSH, asegúrate de que tus SSH keys estén configuradas en el VPS

---

### PASO 5: Configurar Variables de Entorno

```bash
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

**⚠️ IMPORTANTE:**
- Usa la misma `DATABASE_URL` que tienes en Vercel
- Esta es la conexión a PostgreSQL (Neon)
- No la compartas públicamente

---

### PASO 6: Configurar Firewall (Abrir Puerto 5000)

```bash
# Si usas UFW
sudo ufw allow 5000/tcp
sudo ufw reload

# Si usas iptables
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
sudo iptables-save

# Verificar que el puerto esté abierto
sudo ufw status
# o
sudo netstat -tlnp | grep 5000
```

---

### PASO 7: Construir y Ejecutar con Docker

```bash
# Asegúrate de estar en la carpeta del bot
cd ~/projects/bot-nanomoringa

# Construir la imagen Docker
docker-compose build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

**Para salir de los logs:** Presiona `Ctrl + C`

---

### PASO 8: Verificar que Funciona

```bash
# Verificar que el contenedor esté corriendo
docker-compose ps

# Deberías ver algo como:
# NAME           STATUS        PORTS
# whatsapp-bot   Up X minutes  0.0.0.0:7002->7002/tcp

# Verificar que la API responda
curl http://localhost:7002/api/health

# Deberías ver:
# {"status":"ok","whatsapp_state":"DISCONNECTED","connected":false}
```

---

### PASO 9: Verificar desde Fuera del VPS

```bash
# Desde tu máquina local, verificar que el puerto 7002 esté accesible
curl http://149.50.128.73:7002/api/health

# Deberías ver la misma respuesta
```

---

### PASO 10: Configurar Variables en Vercel

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

---

### PASO 11: Verificar QR Code en la Web

1. Ve a: `https://nanomoringa.vercel.app/admin/whatsapp-configuracion`
2. Deberías ver el QR code
3. Escanea el QR con WhatsApp
4. El bot debería conectarse

---

## 🔄 ACTUALIZAR EL BOT (Cuando hagas cambios)

```bash
# Conectar al VPS
ssh -p 5782 usuario@149.50.128.73

# Ir a la carpeta del bot
cd ~/projects/bot-nanomoringa

# Actualizar código desde GitHub
git pull origin master

# Reconstruir y reiniciar el contenedor
docker-compose down
docker-compose build
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🛠️ COMANDOS ÚTILES

### Ver logs del bot
```bash
docker-compose logs -f
```

### Reiniciar el bot
```bash
docker-compose restart
```

### Detener el bot
```bash
docker-compose down
```

### Ver estado del bot
```bash
docker-compose ps
```

### Ver uso de recursos
```bash
docker stats whatsapp-bot
```

### Entrar al contenedor (debugging)
```bash
docker-compose exec whatsapp-bot sh
```

---

## 🆘 TROUBLESHOOTING

### El bot no se conecta a PostgreSQL

**Verificar:**
```bash
# Ver logs
docker-compose logs -f

# Verificar que DATABASE_URL esté configurada
docker-compose exec whatsapp-bot env | grep DATABASE_URL
```

**Solución:**
- Verifica que `DATABASE_URL` sea correcta en el archivo `.env`
- Usa la misma `DATABASE_URL` que tienes en Vercel
- Verifica que PostgreSQL acepte conexiones desde el VPS

### El bot no responde a `/api/health`

**Verificar:**
```bash
# Ver si el contenedor está corriendo
docker-compose ps

# Ver logs
docker-compose logs -f

# Verificar que el puerto 7002 esté abierto
sudo netstat -tlnp | grep 7002
```

**Solución:**
- Verifica que el puerto 7002 esté abierto en el firewall
- Verifica que el contenedor esté corriendo
- Verifica los logs para ver errores

### El QR code no aparece

**Verificar:**
- Que `WHATSAPP_BOT_URL` esté configurada en Vercel
- Que el bot esté corriendo y accesible
- Que el deploy en Vercel haya terminado

**Probar:**
```bash
# Desde el VPS
curl http://localhost:7002/api/health

# Desde tu máquina local
curl http://149.50.128.73:7002/api/health
```

### Error al construir la imagen Docker

**Verificar:**
```bash
# Ver logs de construcción
docker-compose build --no-cache

# Verificar que Docker esté funcionando
docker ps
```

**Solución:**
- Verifica que Docker esté instalado correctamente
- Verifica que tengas espacio en disco
- Verifica los logs para ver errores específicos

---

## ✅ CHECKLIST FINAL

- [ ] Docker instalado y funcionando
- [ ] Git instalado
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Puerto 7002 abierto en el firewall
- [ ] Bot construido y corriendo (`docker-compose up -d`)
- [ ] API respondiendo (`/api/health`)
- [ ] Variables configuradas en Vercel (`WHATSAPP_BOT_URL`)
- [ ] QR code visible en `/admin/whatsapp-configuracion`
- [ ] Bot conectado a WhatsApp (QR escaneado)

---

## 📝 NOTAS IMPORTANTES

1. **Puerto 5782:** Solo para SSH, sin conflicto con otros sistemas ✅
2. **Puerto 7002:** Para el bot, debe estar abierto en el firewall ✅
3. **GitHub:** Mejor opción para mantener el código actualizado ✅
4. **Docker:** Aísla el bot y facilita el mantenimiento ✅
5. **Variables de entorno:** No compartir públicamente el `.env` ⚠️

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DEL DEPLOY

1. **Configurar monitoreo:**
   - Alertas si el bot se cae
   - Logs rotativos
   - Backups automáticos

2. **Optimizar:**
   - Auto-restart si el bot se cae
   - Límites de recursos
   - Rate limiting

3. **Configurar dominio (opcional):**
   - DNS A record apuntando a la IP del VPS
   - Nginx como reverse proxy
   - SSL con Let's Encrypt

---

**⏱️ Tiempo estimado:** 30-60 minutos

**Última actualización:** 2025-11-14
**Estado:** Listo para deploy con Docker desde GitHub


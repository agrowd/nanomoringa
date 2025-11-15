# 🚀 OPCIONES PARA DEPLOY DEL BOT

## ✅ ACLARACIONES IMPORTANTES

### 📌 Puertos - NO HAY CONFLICTO

1. **Puerto 5782 (SSH):**
   - ✅ Es SOLO para conectarte al servidor
   - ✅ Puedes usarlo para otros sistemas SIN PROBLEMA
   - ✅ NO se usa para el bot
   - ✅ Es solo para acceso SSH

2. **Puerto 7002 (Bot):**
   - ✅ Este es el puerto que el bot usará para su API
   - ✅ Es DIFERENTE al 5782
   - ✅ NO hay conflicto con otros sistemas
   - ✅ Solo necesitas que esté abierto en el firewall

**🎯 Resumen:**
- **Puerto 5782:** SSH (acceso al servidor) ✅ Sin problema
- **Puerto 7002:** Bot API (comunicación con Vercel) ✅ Sin problema

---

## 📋 OPCIONES PARA DEPLOY

### Opción 1: Desde GitHub (RECOMENDADO) ⭐

**Ventajas:**
- ✅ Código versionado y actualizado
- ✅ Fácil de mantener y actualizar
- ✅ No necesitas subir archivos manualmente
- ✅ Más profesional y escalable
- ✅ Puedes hacer cambios y actualizar fácilmente

**Cómo funciona:**
1. El código del bot está en GitHub
2. Clonas el repositorio en el VPS
3. Configuras variables de entorno
4. Ejecutas Docker
5. ¡Listo!

**Tiempo estimado:** 30-60 minutos

---

### Opción 2: Desde WinSCP (Alternativa)

**Ventajas:**
- ✅ Más simple si no tienes Git
- ✅ Control directo de archivos
- ✅ Útil para cambios rápidos

**Desventajas:**
- ❌ Más lento para actualizar
- ❌ No versiona cambios
- ❌ Menos profesional

**Cómo funciona:**
1. Subes la carpeta `bot-nanomoringa` con WinSCP
2. Configuras variables de entorno
3. Ejecutas Docker
4. ¡Listo!

**Tiempo estimado:** 20-40 minutos

---

## 🚀 RECOMENDACIÓN: OPCIÓN 1 (GitHub)

### ¿Por qué GitHub es mejor?

1. **Código actualizado:**
   - El código del bot está en el mismo repositorio
   - Puedes actualizar fácilmente con `git pull`
   - No necesitas subir archivos manualmente

2. **Mantenimiento fácil:**
   - Haces cambios en tu máquina
   - Haces `git push`
   - En el VPS haces `git pull` y `docker-compose restart`
   - ¡Listo!

3. **Más profesional:**
   - Código versionado
   - Historial de cambios
   - Fácil de colaborar

---

## 📋 GUÍA PASO A PASO - DEPLOY DESDE GITHUB

### PASO 1: Verificar que el código esté en GitHub

El código del bot está en el repositorio. Solo necesitas clonarlo en el VPS.

---

### PASO 2: Conectar al VPS

```bash
ssh -p 5782 usuario@149.50.128.73
```

**Nota:** El puerto 5782 es solo para SSH, no hay problema si lo usas para otros sistemas.

---

### PASO 3: Instalar Docker (si no está instalado)

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

### PASO 4: Instalar Git (si no está instalado)

```bash
# Instalar Git
sudo apt install -y git

# Verificar instalación
git --version
```

---

### PASO 5: Clonar el Repositorio del Bot

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

### PASO 6: Configurar Variables de Entorno

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

### PASO 7: Configurar Firewall (Abrir Puerto 7002)

```bash
# Si usas UFW
sudo ufw allow 7002/tcp
sudo ufw reload

# Si usas iptables
sudo iptables -A INPUT -p tcp --dport 7002 -j ACCEPT
sudo iptables-save

# Verificar que el puerto esté abierto
sudo ufw status
```

---

### PASO 8: Construir y Ejecutar con Docker

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

### PASO 9: Verificar que Funciona

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

### PASO 10: Verificar desde Fuera del VPS

```bash
# Desde tu máquina local, verificar que el puerto 7002 esté accesible
curl http://149.50.128.73:7002/api/health

# Deberías ver la misma respuesta
```

---

### PASO 11: Configurar Variables en Vercel

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

### PASO 12: Verificar QR Code en la Web

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

## 📋 ALTERNATIVA: DEPLOY DESDE WINSCP

Si prefieres usar WinSCP:

### PASO 1: Subir código con WinSCP

1. Abre WinSCP
2. Conecta al VPS:
   - **Host:** `149.50.128.73`
   - **Puerto:** `5782`
   - **Usuario:** Tu usuario
   - **Contraseña:** Tu contraseña
3. Sube la carpeta `bot-nanomoringa` a `/home/usuario/`
4. Ve a la carpeta en el VPS: `cd /home/usuario/bot-nanomoringa`

### PASO 2: Seguir desde PASO 6 (Configurar Variables)

Sigue los pasos desde PASO 6 en adelante (configurar variables, Docker, etc.)

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

---

## ✅ CHECKLIST FINAL

- [ ] Docker instalado y funcionando
- [ ] Git instalado
- [ ] Repositorio clonado (o código subido con WinSCP)
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

**⏱️ Tiempo estimado:** 30-60 minutos

**Última actualización:** 2025-11-14
**Estado:** Listo para deploy con Docker desde GitHub


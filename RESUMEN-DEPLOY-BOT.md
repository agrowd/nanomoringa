# 📋 RESUMEN DEPLOY DEL BOT - PREGUNTAS FRECUENTES

## ✅ ACLARACIONES IMPORTANTES

### 📌 Puertos - NO HAY CONFLICTO

1. **Puerto 5782 (SSH):**
   - ✅ Es SOLO para conectarte al servidor
   - ✅ Puedes usarlo para otros sistemas SIN PROBLEMA
   - ✅ NO se usa para el bot
   - ✅ Es solo para acceso SSH
   - ✅ NO necesitas cambiarlo

2. **Puerto 7002 (Bot):**
   - ✅ Este es el puerto que el bot usará para su API
   - ✅ Es DIFERENTE al 5782
   - ✅ NO hay conflicto con otros sistemas
   - ✅ Solo necesitas que esté abierto en el firewall

**🎯 Resumen:**
- **Puerto 5782:** SSH (acceso al servidor) ✅ Sin problema, puedes seguir usándolo
- **Puerto 7002:** Bot API (comunicación con Vercel) ✅ Sin conflicto

---

## ❓ PREGUNTAS FRECUENTES

### ¿Puedo usar el puerto 5782 para otros sistemas?

**✅ SÍ, sin problema:**
- El puerto 5782 es SOLO para SSH (acceso al servidor)
- NO se usa para el bot
- Puedes seguir usándolo para otros sistemas
- NO hay conflicto

### ¿Qué puerto usa el bot?

**✅ Puerto 7002:**
- El bot usa el puerto 7002 para su API
- Es DIFERENTE al 5782
- NO hay conflicto con otros sistemas
- Solo necesitas que esté abierto en el firewall

### ¿El código está en GitHub?

**✅ SÍ:**
- El bot tiene su propio repositorio: `git@github.com:agrowd/bot-nanomoringa.git`
- El código está actualizado en GitHub
- Puedes clonarlo directamente en el VPS

### ¿Es mejor usar GitHub o WinSCP?

**✅ GitHub (RECOMENDADO):**
- ✅ Código versionado y actualizado
- ✅ Fácil de mantener y actualizar
- ✅ No necesitas subir archivos manualmente
- ✅ Más profesional y escalable
- ✅ Puedes hacer cambios y actualizar fácilmente

**WinSCP (Alternativa):**
- ✅ Más simple si no tienes Git
- ✅ Control directo de archivos
- ✅ Útil para cambios rápidos
- ❌ Más lento para actualizar
- ❌ No versiona cambios

### ¿Necesito hacer algo diferente si uso el puerto 5782?

**✅ NO:**
- El puerto 5782 es SOLO para SSH
- NO afecta al bot
- Puedes seguir usándolo normalmente
- NO necesitas cambiar nada

---

## 🚀 OPCIÓN RECOMENDADA: DEPLOY DESDE GITHUB

### ¿Por qué GitHub es mejor?

1. **Código actualizado:**
   - El código del bot está en GitHub: `git@github.com:agrowd/bot-nanomoringa.git`
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

## 📋 PASOS RÁPIDOS - DEPLOY DESDE GITHUB

### 1. Conectar al VPS (Puerto 5782 - Sin problema)

```bash
ssh -p 5782 usuario@149.50.128.73
```

**✅ Nota:** El puerto 5782 es solo para SSH, no hay problema si lo usas para otros sistemas.

---

### 2. Instalar Docker

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
exit
ssh -p 5782 usuario@149.50.128.73
```

---

### 3. Instalar Git

```bash
sudo apt install -y git
```

---

### 4. Configurar SSH Keys (Para GitHub)

```bash
# Generar SSH key (si no tienes una)
ssh-keygen -t ed25519 -C "tu-email@example.com"

# Ver la clave pública
cat ~/.ssh/id_ed25519.pub

# Copiar la clave y agregarla a GitHub:
# GitHub → Settings → SSH and GPG keys → New SSH key
```

---

### 5. Clonar el Repositorio del Bot

```bash
mkdir -p ~/projects
cd ~/projects

# Clonar el repositorio del bot
git clone git@github.com:agrowd/bot-nanomoringa.git

# Ir a la carpeta del bot
cd bot-nanomoringa
```

---

### 6. Configurar Variables de Entorno

```bash
# Crear archivo .env
nano .env
```

**Agregar:**
```env
DATABASE_URL=postgresql://usuario:password@ep-XXXX.region.neon.tech/neondb?sslmode=require
WEB_APP_URL=https://nanomoringa.vercel.app
PORT=7002
```

**Guardar:** `Ctrl + X`, `Y`, `Enter`

---

### 7. Configurar Firewall (Abrir Puerto 7002)

```bash
sudo ufw allow 7002/tcp
sudo ufw reload
```

---

### 8. Construir y Ejecutar con Docker

```bash
# Construir la imagen
docker-compose build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

### 9. Verificar que Funciona

```bash
# Verificar que el contenedor esté corriendo
docker-compose ps

# Verificar que la API responda
curl http://localhost:7002/api/health
```

---

### 10. Configurar Variables en Vercel

1. Ve a Vercel → Settings → Environment Variables
2. Agrega:
   - **Key:** `WHATSAPP_BOT_URL`
   - **Value:** `http://149.50.128.73:7002`
3. Guarda y redeploya

---

### 11. Verificar QR Code

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
3. Sube la carpeta `bot-nanomoringa` a `/home/usuario/projects/`
4. Ve a la carpeta en el VPS: `cd /home/usuario/projects/bot-nanomoringa`

### PASO 2: Seguir desde PASO 6 (Configurar Variables)

Sigue los pasos desde PASO 6 en adelante (configurar variables, Docker, etc.)

---

## ✅ CHECKLIST FINAL

- [ ] Docker instalado y funcionando
- [ ] Git instalado
- [ ] SSH keys configuradas (para GitHub)
- [ ] Repositorio clonado (`git clone git@github.com:agrowd/bot-nanomoringa.git`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Puerto 7002 abierto en el firewall
- [ ] Bot construido y corriendo (`docker-compose up -d`)
- [ ] API respondiendo (`/api/health`)
- [ ] Variables configuradas en Vercel (`WHATSAPP_BOT_URL`)
- [ ] QR code visible en `/admin/whatsapp-configuracion`
- [ ] Bot conectado a WhatsApp (QR escaneado)

---

## 🆘 TROUBLESHOOTING

### Error al clonar el repositorio

**Si usas SSH:**
```bash
# Verificar que SSH keys estén configuradas
ssh -T git@github.com

# Si no funciona, generar nueva clave:
ssh-keygen -t ed25519 -C "tu-email@example.com"
cat ~/.ssh/id_ed25519.pub
# Agregar a GitHub: Settings → SSH and GPG keys → New SSH key
```

**Si usas HTTPS:**
```bash
# Clonar con HTTPS
git clone https://github.com/agrowd/bot-nanomoringa.git

# Si es privado, necesitarás credenciales
```

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

---

## 📝 NOTAS IMPORTANTES

1. **Puerto 5782:** Solo para SSH, sin conflicto con otros sistemas ✅
2. **Puerto 7002:** Para el bot, debe estar abierto en el firewall ✅
3. **GitHub:** Mejor opción para mantener el código actualizado ✅
4. **Docker:** Aísla el bot y facilita el mantenimiento ✅
5. **Variables de entorno:** No compartir públicamente el `.env` ⚠️
6. **Repositorio del bot:** `git@github.com:agrowd/bot-nanomoringa.git` ✅

---

**⏱️ Tiempo estimado:** 30-60 minutos

**Última actualización:** 2025-11-14
**Estado:** Listo para deploy con Docker desde GitHub


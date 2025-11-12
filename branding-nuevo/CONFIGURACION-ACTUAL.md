# ✅ CONFIGURACIÓN ACTUAL - MEDICINA NATURAL

## 📱 CONTACTO Y REDES

### WhatsApp
- **Número principal:** +54 9 11 4089-5557
- **Formato para bot:** 5491140895557
- **Uso:** Ventas y consultas (número descartable)

### Instagram
- **Handle:** @cbd.medicina.ok
- **URL:** https://instagram.com/cbd.medicina.ok

### Facebook
- **Pendiente:** URL de la página

---

## 🖥️ INFRAESTRUCTURA VPS

### Acceso SSH
```bash
Host: 149.50.128.73
Puerto: 5782
Usuario: root
Password: FedeServer.2937
Path actual: /srv/jenny

# Comando de conexión:
ssh -p 5782 root@149.50.128.73
```

### Especificaciones (A confirmar)
- **RAM:** Pendiente verificar
- **CPU:** Pendiente verificar
- **Storage:** Pendiente verificar
- **OS:** Debian (con Docker)

### Tareas VPS
- [ ] Verificar especificaciones (RAM, CPU, Storage)
- [ ] Instalar Docker (si no está)
- [ ] Instalar Docker Compose
- [ ] Configurar firewall
- [ ] Instalar Nginx
- [ ] Configurar SSL (Let's Encrypt)

---

## 🌐 DOMINIO

### Estado
- [ ] **Pendiente:** Definir dominio
- [ ] **Pendiente:** Configurar DNS apuntando a 149.50.128.73

### Sugerencias de dominio:
- medicinanatural.com.ar
- medicinanatural-cbd.com.ar
- cbd-natural.com.ar

---

## 🎨 BRANDING

### Logo
- ✅ **Archivo:** `branding-nuevo/logo-medicina-natural.png`
- ✅ **Estado:** Disponible

### Paleta de Colores (Confirmada)
```css
--fondo-principal: #F6F0DE     /* Beige cálido */
--verde-oscuro: #294E3A        /* Títulos y navbar */
--verde-muy-oscuro: #213A2E    /* Texto */
--verde-medio: #4A8F53         /* Botones y acentos */
--tierra-dorado: #C7A87A       /* Acentos secundarios */
```

### Tipografías (Confirmada)
- **Títulos:** Playfair Display (Google Fonts)
- **Cuerpo:** Inter (Google Fonts)

### Imágenes de Productos
- ✅ **Disponibles en:** `branding-nuevo/imagenes-a-interpretar/`
- ✅ **Cantidad:** 15 imágenes
- ✅ **Estado:** Listas para usar

---

## 📦 PRODUCTOS CONFIGURADOS

### 1. Aceite CBD 80% Full Spectrum (Local)

**Información Base:**
```yaml
ID: aceite-cbd-80-local
Nombre: "Aceite CBD Full Spectrum 80%"
Slug: aceite-cbd-80-full-spectrum
Categoría: aceites
Precio: $50,000 (placeholder - editable)
Stock: 100 (placeholder - editable)
Featured: true

Descripción corta:
"Aceite de CBD cultivado en Argentina con espectro completo. 
Máxima pureza, sin aditivos, extracción natural."

Descripción larga:
"Nuestro aceite CBD Full Spectrum 80% es cultivado y procesado 
en Argentina con los más altos estándares de calidad. 

Características:
• 80% de concentración de CBD
• Full Spectrum (espectro completo)
• Sin aditivos ni químicos
• Extracción natural
• Ideal para empezar tu rutina de bienestar

Uso recomendado:
2-3 gotas sublinguales, mantener bajo la lengua 60-90 segundos 
antes de tragar. Comenzar de menos a más."

CBD Info:
  concentración: "80% CBD"
  tipo: "Full Spectrum"
  volumen: "30ml"
  uso: "Sublingual"

Variantes disponibles:
  - 500mg ($50,000)
  - 1000mg ($50,000)
  - 1500mg ($50,000)

Tags: ["local", "full-spectrum", "bestseller", "natural"]

Imágenes:
  - /uploads/productos/aceite-cbd-local-1.jpg
  - /uploads/productos/aceite-cbd-local-2.jpg
  - /uploads/productos/aceite-cbd-local-3.jpg

Legal disclaimer:
"Este producto no es un medicamento. No está destinado a diagnosticar, 
tratar, curar o prevenir ninguna enfermedad. Consulte con su médico 
antes de usar. Solo para mayores de 18 años."
```

---

### 2. Premium Hemp Oil 12.000mg (Importado USA)

**Información Base:**
```yaml
ID: premium-hemp-oil-usa
Nombre: "Premium Hemp Oil USA 12.000mg"
Slug: premium-hemp-oil-12000mg
Categoría: aceites
Precio: $50,000 (placeholder - editable)
Stock: 50 (placeholder - editable)
Featured: true

Descripción corta:
"Aceite CBD premium importado de Estados Unidos. 
Máxima concentración, gotero calibrado, extracción CO₂."

Descripción larga:
"Premium Hemp Oil importado directamente de EE.UU. con la más alta 
concentración de CBD disponible en el mercado.

Características:
• 12.000mg de concentración total
• Importado de Estados Unidos
• Extracción por CO₂ supercrítico
• Gotero calibrado para dosificación precisa
• Producción en batch pequeño
• Más concentración por mL

Ideal para:
Usuarios experimentados que buscan máxima potencia y resultados 
más notables en su rutina de bienestar.

Uso recomendado:
Comenzar con 1-2 gotas sublinguales, ajustar según necesidad. 
El gotero calibrado permite dosificación exacta."

CBD Info:
  concentración: "12.000mg"
  tipo: "Broad Spectrum"
  volumen: "60ml"
  uso: "Sublingual"

Tags: ["premium", "importado", "alta-concentracion", "usa"]

Imágenes:
  - /uploads/productos/premium-hemp-oil-1.jpg
  - /uploads/productos/premium-hemp-oil-2.jpg
  - /uploads/productos/premium-hemp-oil-3.jpg

Legal disclaimer:
"Este producto no es un medicamento. No está destinado a diagnosticar, 
tratar, curar o prevenir ninguna enfermedad. Consulte con su médico 
antes de usar. Solo para mayores de 18 años."
```

---

### 3. Cápsulas CBD

**Información Base:**
```yaml
ID: capsulas-cbd-25mg
Nombre: "Cápsulas CBD 25mg"
Slug: capsulas-cbd-25mg
Categoría: capsulas
Precio: $50,000 (placeholder - editable)
Stock: 100 (placeholder - editable)
Featured: false

Descripción corta:
"Cápsulas de CBD con dosificación exacta. 
Prácticas, discretas, ideales para viajes."

Descripción larga:
"Nuestras cápsulas CBD ofrecen la forma más práctica y discreta 
de incorporar CBD a tu rutina diaria.

Características:
• 25mg de CBD por cápsula
• Dosificación exacta y constante
• Fácil de transportar
• Sin sabor
• Ideal para viajes y uso en cualquier lugar
• Presentación discreta

Ideal para:
Personas que buscan practicidad y dosificación precisa sin 
necesidad de goteros o mediciones.

Uso recomendado:
1-2 cápsulas al día con agua. Preferiblemente con alimentos 
para mejor absorción."

CBD Info:
  concentración: "25mg por cápsula"
  tipo: "CBD Isolate"
  formato: "Frasco x30 cápsulas"
  uso: "Oral"

Tags: ["capsulas", "practico", "viaje", "dosificacion-exacta"]

Imágenes:
  - /uploads/productos/capsulas-cbd-1.jpg
  - /uploads/productos/capsulas-cbd-2.jpg

Legal disclaimer:
"Este producto no es un medicamento. No está destinado a diagnosticar, 
tratar, curar o prevenir ninguna enfermedad. Consulte con su médico 
antes de usar. Solo para mayores de 18 años."
```

---

### 4. Gomitas CBD

**Información Base:**
```yaml
ID: gomitas-cbd-10mg
Nombre: "Gomitas CBD 10mg"
Slug: gomitas-cbd-10mg
Categoría: gomitas
Precio: $50,000 (placeholder - editable)
Stock: 100 (placeholder - editable)
Featured: false

Descripción corta:
"Gomitas de CBD con sabor natural. 
Momento placentero de autocuidado, fácil dosificación."

Descripción larga:
"Incorporá CBD a tu rutina de la forma más rica y placentera 
con nuestras gomitas de sabor natural.

Características:
• 10mg de CBD por gomita
• Sabor natural agradable
• Sin azúcar añadida
• Momento de autocuidado placentero
• Dosificación simple y clara
• Presentación atractiva

Ideal para:
Quienes buscan una forma agradable de consumir CBD, 
convirtiendo el bienestar en un momento placentero del día.

Uso recomendado:
1-2 gomitas al día. Comenzar con 1 gomita y ajustar según 
necesidad. Masticar bien antes de tragar."

CBD Info:
  concentración: "10mg por gomita"
  tipo: "CBD Isolate"
  formato: "Frasco x30 gomitas"
  uso: "Oral"

Tags: ["gomitas", "sabor", "autocuidado", "practico"]

Imágenes:
  - /uploads/productos/gomitas-cbd-1.jpg
  - /uploads/productos/gomitas-cbd-2.jpg

Legal disclaimer:
"Este producto no es un medicamento. No está destinado a diagnosticar, 
tratar, curar o prevenir ninguna enfermedad. Consulte con su médico 
antes de usar. Solo para mayores de 18 años."
```

---

## 💬 AUTORESPUESTAS WHATSAPP

### Secuencia 1: Bienvenida General
```
Horario: Lun-Sáb 09:00-20:00
Zona: GMT-3 (Buenos Aires)

Mensaje 1 (0 seg):
"¡Hola! 👋 Gracias por contactarnos.
Soy del equipo de Medicina Natural."

Mensaje 2 (3 seg):
"Te voy a contar sobre nuestros productos con CBD de calidad 🌿

Trabajamos con:
✔️ Aceite local (80% CBD)
✔️ Línea premium importada
✔️ Cápsulas y gomitas
✔️ Seguimiento personalizado"

Mensaje 3 (5 seg):
"¿Buscás algo específico?

• Para empezar: escribí PLAN
• Concentración: escribí FOCO
• Articulaciones/músculos: escribí MOVILIDAD
• Descanso: escribí DOMINGO

¿O preferís que te cuente más sobre los productos?"

Fallback (30 min):
"Entiendo que estés ocupado/a 😊
Cuando quieras consultar algo, aquí estoy.
¡Que tengas un excelente día! 🌟"
```

### Secuencia 2: Fuera de Horario
```
Horario: Todos los días 20:01-08:59

Mensaje 1 (0 seg):
"¡Hola! 👋
Gracias por escribirnos.
Ahora no estamos disponibles, pero mañana a las 9:00 hs te respondemos personalmente.
Medicina Natural 🌿"

Mensaje 2 (2 seg):
"Mientras tanto, podés escribir tu consulta y te responderemos apenas abramos.

Si querés, también podés dejarnos una palabra clave:
• PLAN - Info general
• ACEITE - Sobre aceites CBD
• PREMIUM - Línea importada
• CAPSULAS - Cápsulas CBD
• GOMITAS - Gomitas CBD"
```

---

## 📊 CONFIGURACIÓN INICIAL

### Base de Datos
- **Motor:** PostgreSQL 15
- **Host:** localhost (en VPS)
- **Puerto:** 5432
- **Database:** medicinanatural
- **Usuario:** admin
- **Password:** (generar segura)

### Docker Services
```
1. PostgreSQL (DB principal)
2. Next.js (Frontend + API)
3. WebSocket Server (Socket.io)
4. WhatsApp Bot (whatsapp-web.js)
5. Nginx (Reverse proxy + SSL)
6. Redis (Opcional - caché)
```

### Puertos Asignados
```
PostgreSQL: 5432 (interno)
Next.js: 3000 (interno)
WebSocket: 4000 (interno)
WhatsApp Bot: 5000 (interno)
Nginx: 80, 443 (externo)
Redis: 6379 (interno)
```

---

## 🔐 SEGURIDAD

### Credenciales Admin (A definir)
- **Usuario:** (definir - ej: admin)
- **Password:** (generar segura - mín 12 caracteres)
- **Email:** (email del admin)

### SSL Certificate
- **Proveedor:** Let's Encrypt (gratuito)
- **Renovación:** Automática cada 90 días
- **Tipo:** Wildcard (*.dominio.com)

### Firewall UFW
```bash
Permitir:
- Puerto 80 (HTTP)
- Puerto 443 (HTTPS)
- Puerto 5782 (SSH)

Bloquear:
- Todo lo demás
```

---

## 📋 CHECKLIST DE DEPLOY

### Pre-Deploy
- [x] Logo disponible
- [x] Imágenes de productos disponibles
- [x] Paleta de colores confirmada
- [x] Productos definidos
- [x] Información VPS recibida
- [x] Número WhatsApp confirmado
- [ ] Dominio definido
- [ ] DNS configurado

### Deploy Fase 1 (Infraestructura)
- [ ] Conectar a VPS vía SSH
- [ ] Verificar especificaciones
- [ ] Instalar Docker + Docker Compose
- [ ] Configurar firewall
- [ ] Crear estructura de directorios
- [ ] Clonar/subir código

### Deploy Fase 2 (Configuración)
- [ ] Configurar variables de entorno
- [ ] Generar secrets seguros
- [ ] Configurar PostgreSQL
- [ ] Configurar Nginx
- [ ] Obtener certificados SSL

### Deploy Fase 3 (Aplicación)
- [ ] Build de Next.js
- [ ] Inicializar base de datos
- [ ] Subir logo e imágenes
- [ ] Crear productos iniciales
- [ ] Configurar autorespuestas

### Deploy Fase 4 (WhatsApp)
- [ ] Iniciar bot de WhatsApp
- [ ] Generar QR code
- [ ] Escanear con +54 9 11 4089-5557
- [ ] Verificar conexión
- [ ] Probar autorespuestas

### Deploy Fase 5 (Testing)
- [ ] Test de landing page
- [ ] Test de productos
- [ ] Test de chat web
- [ ] Test de WhatsApp bot
- [ ] Test de CRM admin
- [ ] Test de autorespuestas
- [ ] Test de sincronización

### Deploy Fase 6 (Go Live)
- [ ] Backups configurados
- [ ] Monitoreo activo
- [ ] Documentación completa
- [ ] Training al equipo
- [ ] 🚀 LANZAMIENTO

---

## 📅 TIMELINE ESTIMADO

### Semana 1: Infraestructura
- Configurar VPS
- Instalar Docker
- Setup de base de datos
- Configurar dominio y SSL

### Semana 2: Frontend
- Adaptar branding
- Configurar colores y tipografías
- Reemplazar logo
- Adaptar hero section

### Semana 3: Productos
- Crear productos en DB
- Procesar y subir imágenes
- Configurar variantes
- Páginas de producto

### Semana 4: Chat Web
- Implementar widget
- Formulario captura
- Integración con backend
- Diseño adaptado

### Semana 5: WhatsApp Bot
- Setup whatsapp-web.js
- Configurar autorespuestas
- Sistema de palabras clave
- Testing de flujos

### Semana 6: CRM
- Panel de conversaciones
- Editor de autorespuestas
- Panel de leads
- Gestión de sesión WhatsApp

### Semana 7: Integración
- WebSocket en tiempo real
- Sincronización completa
- Testing end-to-end
- Ajustes finales

### Semana 8: Deploy y Training
- Deploy a producción
- Configuración final
- Training al equipo
- Go Live 🚀

---

## ✅ RESUMEN

**Tenemos:**
- ✅ Logo
- ✅ Imágenes de productos
- ✅ Información completa del negocio
- ✅ Paleta de colores
- ✅ Productos definidos
- ✅ Número WhatsApp
- ✅ Acceso VPS
- ✅ Arquitectura técnica completa

**Nos falta:**
- ⏳ Dominio (definir y configurar)
- ⏳ Verificar especificaciones del VPS
- ⏳ Definir credenciales admin

**Estado:** ✅ LISTO PARA COMENZAR IMPLEMENTACIÓN

---

**Última actualización:** 18/10/2025
**Próximo paso:** Conectar a VPS y verificar especificaciones


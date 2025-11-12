# 🎯 PLAN DE ACCIÓN - MEDICINA NATURAL

## 📅 CRONOGRAMA DE 8 SEMANAS

```
Hoy (18/Oct) ─────────────────────────► Go Live (13/Dic)
     │                                        │
     ├─ Semana 1-2: Infraestructura          │
     ├─ Semana 3-4: Frontend + Productos     │
     ├─ Semana 5-6: Chat + WhatsApp Bot      │
     └─ Semana 7-8: CRM + Testing ───────────┘
```

---

## 🚀 SEMANA 1: INFRAESTRUCTURA Y SETUP (21-27 Oct)

### Día 1-2: Verificación y Preparación VPS
```bash
✅ TAREAS:
├─ Conectar a VPS vía SSH
├─ Verificar especificaciones (RAM, CPU, Storage)
├─ Instalar Docker + Docker Compose
├─ Configurar firewall (UFW)
└─ Crear estructura de directorios

COMANDO:
ssh -p 5782 root@149.50.128.73
Password: FedeServer.2937

VERIFICAR:
- RAM: Mínimo 4GB (recomendado 8GB)
- CPU: Mínimo 2 cores (recomendado 4)
- Storage: Mínimo 50GB
- OS: Debian con Docker
```

### Día 3-4: Configuración Base de Datos
```bash
✅ TAREAS:
├─ Crear docker-compose.yml
├─ Configurar PostgreSQL 15
├─ Crear base de datos "medicinanatural"
├─ Ejecutar schema inicial
└─ Verificar conexión

RESULTADOS:
- PostgreSQL funcionando en puerto 5432
- Base de datos creada con todas las tablas
- Conexión exitosa desde Next.js
```

### Día 5-7: Dominio y SSL
```bash
✅ TAREAS:
├─ Definir dominio
├─ Configurar DNS → 149.50.128.73
├─ Instalar Nginx
├─ Configurar SSL con Let's Encrypt
└─ Probar HTTPS

OPCIONES DE DOMINIO:
- medicinanatural.com.ar
- cbd-natural.com.ar
- medicinanatural-cbd.com

RESULTADO:
- https://[tu-dominio] funcionando
```

---

## 🎨 SEMANA 2: BRANDING Y FRONTEND (28 Oct - 3 Nov)

### Día 1-2: Adaptación de Colores y Tipografía
```typescript
✅ TAREAS:
├─ Actualizar globals.css con paleta nueva
├─ Configurar Playfair Display + Inter
├─ Reemplazar logo de DripCore
├─ Crear favicon con logo Medicina Natural
└─ Testear en diferentes dispositivos

ARCHIVOS A EDITAR:
- app/globals.css
- app/layout.tsx
- public/favicon.svg
- components/header.tsx
- components/footer.tsx
```

### Día 3-5: Hero Section y Landing
```typescript
✅ TAREAS:
├─ Reemplazar video/imagen hero
├─ Actualizar títulos y textos
├─ Adaptar sección de productos
├─ Agregar sección "¿Por qué CBD?"
├─ Agregar FAQ simple
└─ Disclaimers legales en footer

RESULTADO:
- Landing minimalista optimizada para Meta Ads
- Textos breves y claros
- CTAs prominentes
```

### Día 6-7: Responsive y Accesibilidad
```typescript
✅ TAREAS:
├─ Verificar mobile (público 40-65 años)
├─ Aumentar tamaños de texto
├─ Verificar contraste WCAG AAA
├─ Botones grandes y claros
└─ Testing en diferentes pantallas

REQUISITOS:
- Texto mínimo 18px
- Contraste 7:1
- Botones min 48x48px
- Espaciado generoso
```

---

## 📦 SEMANA 3: PRODUCTOS (4-10 Nov)

### Día 1-2: Procesamiento de Imágenes
```bash
✅ TAREAS:
├─ Optimizar imágenes de productos
├─ Redimensionar a 1200x1200px
├─ Subir a /public/uploads/productos/
├─ Generar thumbnails
└─ Verificar carga rápida

PRODUCTOS:
- Aceite CBD 80% (3 imágenes)
- Premium Hemp Oil (3 imágenes)
- Cápsulas CBD (2 imágenes)
- Gomitas CBD (2 imágenes)
```

### Día 3-5: Creación en Base de Datos
```typescript
✅ TAREAS:
├─ Crear productos en PostgreSQL
├─ Configurar variantes y precios
├─ Agregar descripciones completas
├─ Configurar stock inicial
└─ Marcar productos destacados

SCRIPT SQL:
INSERT INTO products (...) VALUES (...);
```

### Día 6-7: Páginas de Producto
```typescript
✅ TAREAS:
├─ Adaptar página de detalle
├─ Mostrar información CBD
├─ Agregar disclaimers legales
├─ Botón "Consultar" → Chat
└─ Testing de UX

RESULTADO:
- 4 productos visibles en catálogo
- Páginas de detalle funcionales
- CTAs claros a WhatsApp
```

---

## 💬 SEMANA 4: CHAT WEB (11-17 Nov)

### Día 1-3: Widget de Chat
```typescript
✅ TAREAS:
├─ Crear componente ChatWidget
├─ Formulario nombre + teléfono
├─ Validación de campos
├─ Diseño adaptado a paleta MN
└─ Botón flotante en esquina

COMPONENTES:
- components/chat-widget.tsx
- components/chat-window.tsx
- components/chat-form.tsx
- components/chat-messages.tsx
```

### Día 4-6: API de Chat
```typescript
✅ TAREAS:
├─ Crear /api/chat/start
├─ Crear /api/chat/send
├─ Crear /api/chat/messages
├─ Guardar en PostgreSQL
└─ Validación de datos

TABLAS:
- chat_conversations
- chat_messages
```

### Día 7: Testing
```typescript
✅ TAREAS:
├─ Probar flujo completo
├─ Verificar guardado en DB
├─ Testing en mobile
└─ Ajustes finales

RESULTADO:
- Chat web funcional
- Datos guardándose correctamente
```

---

## 📱 SEMANA 5: WHATSAPP BOT (18-24 Nov)

### Día 1-2: Setup whatsapp-web.js
```javascript
✅ TAREAS:
├─ Crear servicio del bot
├─ Configurar whatsapp-web.js
├─ Generar QR code
├─ Escanear con +54 9 11 4089-5557
└─ Verificar conexión

DOCKER:
- Servicio whatsapp-bot
- Puerto 5000
- Persistencia de sesión
```

### Día 3-5: Autorespuestas
```javascript
✅ TAREAS:
├─ Implementar secuencias de autorespuestas
├─ Configurar horarios activos
├─ Sistema de palabras clave
├─ Fallback si no responde
└─ Testing de flujos

SECUENCIAS:
1. Bienvenida general (09:00-20:00)
2. Fuera de horario (20:01-08:59)
3. Respuestas a palabras clave
```

### Día 6-7: Sincronización
```javascript
✅ TAREAS:
├─ Conectar con WebSocket
├─ Sincronizar mensajes a DB
├─ Emitir eventos en tiempo real
└─ Testing completo

RESULTADO:
- Bot funcionando 24/7
- Autorespuestas activas
- Mensajes sincronizados
```

---

## 💼 SEMANA 6: CRM ADMIN (25 Nov - 1 Dic)

### Día 1-3: Panel de Conversaciones
```typescript
✅ TAREAS:
├─ Vista de conversaciones
├─ Lista de leads
├─ Chat en tiempo real
├─ Indicadores de estado
└─ Filtros y búsqueda

PÁGINAS:
- /admin/crm/conversaciones
- /admin/crm/leads
```

### Día 4-5: Editor de Autorespuestas
```typescript
✅ TAREAS:
├─ Editor visual de secuencias
├─ Configuración de delays
├─ Upload de media (imagen/audio)
├─ Preview de secuencias
└─ Activar/desactivar

PÁGINA:
- /admin/crm/autorespuestas
```

### Día 6-7: Gestión de Sesión WhatsApp
```typescript
✅ TAREAS:
├─ Panel de sesión actual
├─ Botón "Cambiar número"
├─ Generación de QR
├─ Historial de sesiones
└─ Testing de cambio

PÁGINA:
- /admin/whatsapp/sesion

RESULTADO:
- CRM completo y funcional
- Respuestas desde web
- Gestión de números descartables
```

---

## 🔧 SEMANA 7: INTEGRACIÓN (2-8 Dic)

### Día 1-3: WebSocket en Tiempo Real
```typescript
✅ TAREAS:
├─ Setup Socket.io server
├─ Conexión desde frontend
├─ Eventos de mensajes
├─ Sincronización completa
└─ Indicadores (escribiendo, leído)

SERVICIO:
- websocket-server (puerto 4000)
```

### Día 4-6: Testing End-to-End
```bash
✅ FLUJOS A PROBAR:
├─ Usuario web → Chat → WhatsApp
├─ WhatsApp → Bot → CRM
├─ Admin CRM → Bot → WhatsApp usuario
├─ Cambio de número WhatsApp
├─ Autorespuestas completas
└─ Gestión de leads

HERRAMIENTAS:
- Testing manual
- Testing con múltiples usuarios
- Testing de carga
```

### Día 7: Ajustes Finales
```bash
✅ TAREAS:
├─ Correcciones de bugs
├─ Optimización de performance
├─ Ajustes de diseño
└─ Documentación final
```

---

## 🚀 SEMANA 8: DEPLOY Y GO LIVE (9-15 Dic)

### Día 1-2: Configuración Final
```bash
✅ TAREAS:
├─ Variables de entorno de producción
├─ Configurar backups automáticos
├─ Monitoreo y alertas
└─ SSL renovación automática
```

### Día 3-4: Training al Equipo
```bash
✅ CAPACITACIÓN:
├─ Cómo usar el CRM
├─ Cómo responder en tiempo real
├─ Cómo cambiar número WhatsApp
├─ Cómo editar autorespuestas
├─ Cómo gestionar leads
└─ Cómo editar productos

DOCUMENTACIÓN:
- Manual de usuario CRM
- Video tutoriales
- FAQ de administración
```

### Día 5: Testing Final
```bash
✅ CHECKLIST:
├─ Landing carga rápido
├─ Productos se ven correctamente
├─ Chat web funciona
├─ WhatsApp responde automáticamente
├─ Admin puede responder desde CRM
├─ Cambio de sesión funciona
└─ Todo sincronizado
```

### Día 6-7: 🎉 GO LIVE
```bash
✅ LANZAMIENTO:
├─ Deploy final a producción
├─ Verificación completa
├─ Monitoreo activo primeras 24hs
└─ Soporte inmediato

🚀 MEDICINA NATURAL ONLINE
```

---

## 📊 MÉTRICAS DE ÉXITO

### Semana 1
- ✅ VPS configurado
- ✅ Base de datos funcionando
- ✅ Dominio con HTTPS

### Semana 2
- ✅ Landing adaptada
- ✅ Branding actualizado
- ✅ Responsive funcionando

### Semana 3
- ✅ 4 productos en catálogo
- ✅ Imágenes optimizadas
- ✅ Páginas de producto

### Semana 4
- ✅ Chat web operativo
- ✅ Formulario capturando leads
- ✅ Datos en DB

### Semana 5
- ✅ Bot WhatsApp conectado
- ✅ Autorespuestas funcionando
- ✅ QR escaneado

### Semana 6
- ✅ CRM completo
- ✅ Panel de leads
- ✅ Editor de autorespuestas

### Semana 7
- ✅ Todo sincronizado
- ✅ Testing completo
- ✅ Sin bugs críticos

### Semana 8
- ✅ Producción estable
- ✅ Equipo capacitado
- 🚀 ONLINE

---

## 🎯 HITOS CLAVE

```
✅ DÍA 1:  VPS verificado
✅ DÍA 7:  Base de datos funcionando
✅ DÍA 14: Landing adaptada
✅ DÍA 21: Productos en catálogo
✅ DÍA 28: Chat web operativo
✅ DÍA 35: WhatsApp bot conectado
✅ DÍA 42: CRM completo
✅ DÍA 49: Testing finalizado
🚀 DÍA 56: GO LIVE (13 Diciembre)
```

---

## 📞 CONTACTO PARA COORDINACIÓN

**Reuniones semanales:** Definir día y horario
**Updates diarios:** WhatsApp o Email
**Emergencias:** WhatsApp

**VPS:** 149.50.128.73:5782
**WhatsApp:** +54 9 11 4089-5557
**Instagram:** @cbd.medicina.ok

---

## ✅ PRÓXIMA ACCIÓN INMEDIATA

### 🔥 HOY (18 Oct):
1. Verificar especificaciones del VPS
2. Definir dominio
3. Definir credenciales admin

### 🔥 MAÑANA (19 Oct):
1. Instalar Docker en VPS
2. Configurar dominio y DNS
3. Comenzar con docker-compose

### 🔥 ESTA SEMANA:
1. Completar setup de infraestructura
2. Configurar PostgreSQL
3. Obtener certificado SSL

---

**Fecha de inicio:** 18 Octubre 2025
**Fecha estimada de finalización:** 13 Diciembre 2025
**Duración:** 8 semanas (56 días)

🚀 **VAMOS QUE SE PUEDE**


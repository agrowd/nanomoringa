# 📦 GUÍA PARA SUBIR PRODUCTOS - NANO MORINGA

## 🎯 **RESUMEN RÁPIDO**

**NO necesitás subir nada a Vercel manualmente.** Los productos se guardan automáticamente en la base de datos PostgreSQL (Neon) cuando los creás desde el panel de administración.

---

## 📋 **PASOS PARA SUBIR PRODUCTOS**

### **1. Acceder al Panel de Administración**

1. **Abrí tu navegador** y andá a:
   - **Local:** `http://localhost:3000/admin`
   - **Vercel:** `https://nanomoringa.vercel.app/admin`

2. **Iniciá sesión** con estas credenciales:
   - **Usuario:** `natoh`
   - **Contraseña:** `Federyco88$`

3. **Si entrás correctamente**, vas a ver el Dashboard con estadísticas.

---

### **2. Crear un Nuevo Producto**

1. **En el Dashboard**, hacé click en el botón **"Crear Producto"** o andá directamente a:
   - `/admin/productos/nuevo`

2. **Completá el formulario** con la información del producto:

#### **📝 INFORMACIÓN BÁSICA**

- **Nombre del Producto:** 
  - Ejemplo: `Aceite Relajante Nano Moringa`
  
- **Slug (URL):** 
  - Se genera automáticamente del nombre
  - Ejemplo: `aceite-relajante-nano-moringa`
  - Se puede editar manualmente si querés

- **SKU:**
  - Formato: `NM-[CATEGORIA]-[NUMERO]`
  - Ejemplo: `NM-ACE-001` (Nano Moringa - Aceite - 001)

- **Categoría:** (Seleccionar una)
  - `Aceites`
  - `Tópicos`
  - `Cápsulas`
  - `Gomitas`
  - `Cremas`
  - `Otros`

- **Descripción:** (Corta, aparece en el catálogo)
  - Ejemplo: `Aceite micronizado 100% natural. Formulado para bienestar diario.`

- **Descripción Larga:** (Detallada, aparece en la página del producto)
  - Ejemplo: `Nuestro aceite micronizado está formulado para una mejor absorción diaria. Producto 100% natural con propiedades antioxidantes. Ideal para tu rutina de bienestar.`

#### **💰 PRECIOS**

- **Precio:** (Precio actual de venta)
  - Ejemplo: `50000`

- **Precio Comparación:** (Opcional, para mostrar descuento)
  - Ejemplo: `75000`
  - Si ponés este precio, se mostrará como "Antes: $75.000" y se calculará el descuento automáticamente

#### **📦 STOCK Y VARIANTES**

- **Stock:** (Cantidad disponible)
  - Ejemplo: `50`

- **Presentaciones:** (Tamaños/Volúmenes disponibles)
  - Click en **"Tamaños Comunes"** para agregar: `30ml`, `60ml`, `100ml`
  - O agregá manualmente: `30 unidades`, `60 unidades`, `90 unidades`
  - O click en **"Presentación Única"** si solo hay una opción

- **Variantes:** (Colores/Sabores/Tipos)
  - Click en **"Colores Comunes"** para agregar: `Natural`, `Relajante`, `Energizante`, `Equilibrio`
  - O agregá manualmente otras variantes

#### **🏷️ ETIQUETAS**

- **Etiquetas:** (Para filtros y badges)
  - `nuevo` - Muestra badge "Nuevo"
  - `destacado` - Aparece en la home
  - `en-oferta` - Muestra badge de oferta
  - `bestseller` - Muestra badge "Bestseller"
  - `100-natural` - Para productos naturales
  - `micronizado` - Para productos micronizados

- **Producto Destacado:** (Switch)
  - Si está activado, aparece en la sección "Productos Destacados" de la home

#### **🖼️ IMÁGENES Y VIDEOS**

1. **Subir Imágenes:**
   - Click en **"Subir Imágenes"**
   - Seleccioná las imágenes del producto
   - Las imágenes se suben automáticamente a `/public/uploads/`
   - Podés reordenar arrastrando
   - La primera imagen es la principal (aparece en el catálogo)

2. **Subir Videos:** (Opcional)
   - Click en **"Subir Videos"**
   - Seleccioná videos del producto

---

### **3. Guardar el Producto**

1. **Revisá toda la información** antes de guardar
2. **Click en "Guardar Producto"**
3. **Si todo está bien**, vas a ver un mensaje de éxito y te redirige a la lista de productos
4. **El producto ya está guardado en la base de datos** y aparece automáticamente en:
   - El catálogo (`/catalogo`)
   - La home (si está marcado como destacado)
   - La página del producto (`/producto/[slug]`)

---

## 🔍 **VERIFICAR QUE FUNCIONÓ**

1. **Andá al catálogo:** `https://nanomoringa.vercel.app/catalogo`
2. **Buscá tu producto** en la lista
3. **Click en el producto** para ver la página completa
4. **Verificá que:**
   - Las imágenes se ven correctamente
   - Los precios están bien
   - Las presentaciones y variantes funcionan
   - El stock se muestra correctamente

---

## ✏️ **EDITAR UN PRODUCTO EXISTENTE**

1. **Andá a:** `/admin/productos`
2. **Buscá el producto** en la lista
3. **Click en "Editar"** (ícono de lápiz)
4. **Modificá lo que necesites**
5. **Click en "Guardar Cambios"**

---

## 🗑️ **ELIMINAR UN PRODUCTO**

1. **Andá a:** `/admin/productos`
2. **Buscá el producto** en la lista
3. **Click en "Eliminar"** (ícono de basura)
4. **Confirmá la eliminación**

---

## 📸 **GESTIONAR IMÁGENES DE UN PRODUCTO**

1. **Andá a:** `/admin/productos`
2. **Buscá el producto**
3. **Click en el ícono de imágenes** (📷)
4. **En el modal:**
   - Arrastrá para reordenar
   - Click en ❌ para eliminar una imagen
   - La primera imagen es la principal

---

## ⚠️ **IMPORTANTE**

### **✅ NO necesitás:**
- Subir archivos manualmente a Vercel
- Hacer deploy después de crear productos
- Tocar código
- Acceder a la base de datos directamente

### **✅ SÍ necesitás:**
- Tener las imágenes listas en tu computadora
- Saber los precios, stock y descripciones
- Tener acceso a internet para subir las imágenes

---

## 🎨 **CONSEJOS PARA LAS IMÁGENES**

1. **Formato recomendado:** JPG o PNG
2. **Tamaño recomendado:** 800x800px o más grande (se optimizan automáticamente)
3. **Peso máximo:** Hasta 5MB por imagen
4. **Cantidad:** Mínimo 1 imagen, recomendado 3-5 imágenes
5. **Primera imagen:** La mejor foto del producto (aparece en el catálogo)

---

## 🔐 **SEGURIDAD**

**Las credenciales del admin están hardcodeadas en el código:**
- Usuario: `natoh`
- Contraseña: `Federyco88$`

**⚠️ IMPORTANTE:** En producción, deberías cambiar estas credenciales por variables de entorno más seguras. Por ahora funcionan así para facilitar el uso.

---

## 📞 **SI TENÉS PROBLEMAS**

1. **No podés iniciar sesión:**
   - Verificá que estés usando: `natoh` / `Federyco88$`
   - Limpiá la caché del navegador

2. **No se guardan los productos:**
   - Verificá que la base de datos esté inicializada
   - Andá a: `https://nanomoringa.vercel.app/api/init-db` (POST request)
   - O verificá las variables de entorno en Vercel

3. **Las imágenes no se suben:**
   - Verificá que tengas conexión a internet
   - Verificá que las imágenes no sean muy pesadas (>5MB)
   - Verificá que el formato sea JPG o PNG

---

## 🎯 **RESUMEN FINAL**

1. **Entrá a:** `https://nanomoringa.vercel.app/admin`
2. **Login:** `natoh` / `Federyco88$`
3. **Click en:** "Crear Producto"
4. **Completá el formulario**
5. **Subí las imágenes**
6. **Guardá**
7. **¡Listo!** El producto ya está en el catálogo

**No necesitás hacer nada más. Los productos se guardan automáticamente en la base de datos y aparecen en el sitio inmediatamente.**


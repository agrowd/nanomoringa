## Deploy Frontend en Vercel + Bot Local/VPS

Guía para subir el frontend de Medicina Natural a un repositorio nuevo y desplegarlo en Vercel dejando el bot/WS en infraestructura propia.

---

### 1. Preparar el repositorio

1. Asegurate de estar en la carpeta del proyecto.
2. Elimina cualquier `.git` previo y crea un historial limpio:
   ```bash
   rm -rf .git
   git init
   git checkout -b main
   git remote add origin <nuevo-repo-url>
   ```
3. Revisa que `README.md`, assets en `public/brand/` y documentos mencionen a Medicina Natural (no DripCore).
4. Copia `ENV-LOCAL-TEMPLATE.txt` a `.env.local`, completa tus valores y **no** lo subas al repo.
5. Haz commit de los archivos necesarios:
   ```bash
   git add .
   git commit -m "feat: medicina natural storefront"
   git push -u origin main
   ```

### 2. Variables de entorno mínimas

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING` | Conexión a Postgres/Neon. Usa `sslmode=require` si es Neon. |
| `NEXT_PUBLIC_WA_PHONE` | Número oficial que recibe pedidos. Formato completo sin `+`. |
| `NEXT_PUBLIC_ADMIN_USER`, `NEXT_PUBLIC_ADMIN_PASS` | Credenciales temporales para `/admin`. Cambiarlas en producción. |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_DESCRIPTION` | Metadata de SEO. |
| `NEXT_PUBLIC_SHIPPING_*` | Configuración de envíos. |
| `WHATSAPP_BOT_URL`, `WS_URL` | URLs públicas donde viven el bot y el WebSocket. En dev suelen ser `http://localhost:5000` / `4000`. |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | Requeridas para NextAuth (aunque el login actual es client-side). Usa valores seguros. |

> En Vercel puedes cargar todo desde `.env.local` ejecutando `vercel env pull` / `vercel env push`, o copiándolas a mano en **Project Settings → Environment Variables**.

### 3. Configurar Vercel

1. Importa el repositorio recién creado desde el dashboard de Vercel.
2. Configura:
   - **Framework**: Next.js
   - **Build Command**: `pnpm install && pnpm build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`
   - **Node Version**: 20
3. Agrega todas las variables mencionadas en `Production` y, si quieres, duplica en `Preview`/`Development`.
4. Deshabilita “Automatic Static Optimization” si Vercel lo sugiere (ya usamos funciones).

### 4. Bot/WS fuera de Vercel

El widget de chat necesita:

- **Bot HTTP** (`WHATSAPP_BOT_URL`): Recibe los leads capturados en la web, puede generar respuestas y conecta con el WhatsApp Business oficial. Levántalo en tu VPS con HTTPS (Nginx + certbot o Cloudflare Tunnel).  
- **Servidor WebSocket** (`WS_URL`): Opcional. Si lo mantienes activo puedes enviar notificaciones en tiempo real desde tu backend al front.

Para desarrollo basta con mantener ambos servicios locales (Node/Express, FastAPI, etc.) y tunelizarlos con `cloudflared` o `ngrok` cuando necesites que Vercel llegue a ellos.

### 5. Checklist post-deploy

1. **Landing**: revisa hero, badges, grid de productos (mock o DB real).
2. **Chat**: abre el widget, completa el formulario y verifica que el bot reciba el lead.
3. **Botón WhatsApp**: tooltip + link abren la conversación con el texto correcto.
4. **Carrito**: agrega productos, abre el drawer, valida totales y mensaje final.
5. **Admin**: entra a `/admin`, cambia las credenciales desde variables si sigue el login básico.
6. **APIs**: golpea `/api/health`, `/api/products`, `/api/coupons` para confirmar que la base responde.
7. **Logs**: monitorea en Vercel (`Deployments > Functions`) y en tu VPS para detectar errores tempranos.

### 6. Troubleshooting rápido

| Problema | Posible causa / solución |
| --- | --- |
| `FETCH failed` al cargar `/api/coupons` | Variables de Postgres mal configuradas o la tabla no existe. Ejecuta los scripts `init-*`. |
| Chat no envía leads | `WHATSAPP_BOT_URL` inaccesible (no HTTPS, firewall, túnel caído). Verifica desde `curl` en Vercel. |
| Checkout WhatsApp abre número incorrecto | Revisa `NEXT_PUBLIC_WA_PHONE` (sin símbolos ni espacios). |
| Admin accesible con credenciales viejas | Cambia `NEXT_PUBLIC_ADMIN_*` en Vercel y limpia el localStorage (`admin-auth`). |

---

Con esto el frontend queda en Vercel y el bot permanece bajo tu control (local o VPS). Mantén esta guía actualizada conforme agregues nuevos servicios o automatizaciones.

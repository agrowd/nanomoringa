# ✅ Pasos Finales para Configurar Uploadthing

## 🔑 Token Generado

El token base64 ya está generado y listo para usar:

```
eyJhcGlLZXkiOiJza19saXZlXzExZWY5ZDkwM2UxYzFmYTA4ODk0M2UzOWI1ZmE2NDYxOGE1NDNmZTM3ZDJjN2UyYjU5ZDI4NzMwNDhiM2NlOTUiLCJhcHBJZCI6IjhnYnI0ajY5cDkiLCJyZWdpb25zIjpbImdsb2JhbCJdfQ==
```

## 📋 Pasos en Vercel:

### 1. Eliminar Variables Antiguas
1. Ve a **Settings** → **Environment Variables**
2. **Elimina** estas variables (si existen):
   - ❌ `UPLOADTHING_SECRET`
   - ❌ `UPLOADTHING_APP_ID`

### 2. Agregar Nueva Variable
1. Haz clic en **Add New**
2. **Name:** `UPLOADTHING_TOKEN`
3. **Value:** Pega este valor exacto (sin espacios):
   ```
   eyJhcGlLZXkiOiJza19saXZlXzExZWY5ZDkwM2UxYzFmYTA4ODk0M2UzOWI1ZmE2NDYxOGE1NDNmZTM3ZDJjN2UyYjU5ZDI4NzMwNDhiM2NlOTUiLCJhcHBJZCI6IjhnYnI0ajY5cDkiLCJyZWdpb25zIjpbImdsb2JhbCJdfQ==
   ```
4. **Environments:** Marca las tres:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Haz clic en **Save**

### 3. Forzar Nuevo Deploy
1. Ve a **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. Espera 1-2 minutos a que termine

### 4. Verificar Logs
1. Ve a **Deployments** → Último deployment
2. Haz clic en **Functions** → `/api/uploadthing`
3. Intenta subir un archivo
4. Revisa los logs - deberías ver:
   - `[Uploadthing] Token found, length: XXX`
   - `[Uploadthing] Token decoded successfully, appId: 8gbr4j69p9`

## ⚠️ Si sigue fallando:

1. **Verifica que el token no tenga espacios** al inicio o final
2. **Verifica que esté marcado para Production** (no solo Preview/Development)
3. **Espera 2-3 minutos** después de agregar la variable antes de probar
4. **Revisa los logs de Vercel** para ver el error exacto

## ✅ Checklist:

- [ ] Variables antiguas eliminadas
- [ ] `UPLOADTHING_TOKEN` agregada con el valor base64
- [ ] Marcada para Production, Preview y Development
- [ ] Nuevo deploy completado
- [ ] Logs muestran "Token decoded successfully"
- [ ] Subida de archivos funciona


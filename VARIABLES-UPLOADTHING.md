# 🔑 Variables de Entorno para Uploadthing

## ⚠️ IMPORTANTE: Uploadthing necesita `UPLOADTHING_TOKEN`

El error indica que falta la variable `UPLOADTHING_TOKEN`. 

### En Vercel, agrega esta variable:

**Variable:**
- Name: `UPLOADTHING_TOKEN`
- Value: `sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95`
- Environment: `Production`, `Preview`, `Development` (marca las tres)

### También puedes usar (alternativa):

Si `UPLOADTHING_TOKEN` no funciona, intenta con:
- `UPLOADTHING_SECRET` = `sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95`
- `UPLOADTHING_APP_ID` = (tu app ID de Uploadthing)

### En .env.local (local):

```env
UPLOADTHING_TOKEN=sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95
# O alternativamente:
# UPLOADTHING_SECRET=sk_live_11ef9d903e1c1fa088943e39b5fa64618a543fe37d2c7e2b59d2873048b3ce95
# UPLOADTHING_APP_ID=xxxxx
```

## 📝 Pasos:

1. Ve a Vercel Dashboard
2. Settings → Environment Variables
3. Agrega `UPLOADTHING_TOKEN` con el valor de tu secret key
4. Haz un nuevo deploy
5. Prueba de nuevo


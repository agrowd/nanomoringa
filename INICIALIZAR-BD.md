# 🚀 Inicializar Base de Datos de WhatsApp

## Comando curl

Para inicializar las tablas de WhatsApp en PostgreSQL, ejecuta:

```bash
curl -X POST https://nanomoringa.vercel.app/api/whatsapp/init-db
```

## Desde el navegador

También puedes hacerlo desde el navegador visitando:

```
https://nanomoringa.vercel.app/api/whatsapp/init-db
```

## Verificar que funcionó

Después de ejecutar, deberías ver:

```json
{
  "success": true,
  "message": "WhatsApp database initialized successfully"
}
```

## ¿Qué hace este endpoint?

1. ✅ Crea las tablas necesarias:
   - `whatsapp_conversations`
   - `whatsapp_messages`
   - `whatsapp_bot_messages`
   - `whatsapp_sessions`

2. ✅ Inserta los mensajes por defecto del bot

3. ✅ Crea los índices para mejor performance

## Próximos pasos

Después de inicializar:
1. Deploy el bot en el VPS
2. El bot se conectará y generará el QR
3. El QR aparecerá automáticamente en `/admin/whatsapp-configuracion`


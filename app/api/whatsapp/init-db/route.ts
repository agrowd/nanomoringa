import { NextResponse } from 'next/server'
import { initWhatsAppDatabase, saveBotMessages } from '@/lib/whatsapp-db'

// Función compartida para inicializar la BD
async function initializeDatabase() {
  try {
    // Inicializar tablas
    await initWhatsAppDatabase()

    // Mensajes por defecto del bot (migrados del código actual)
    const defaultBotMessages = [
      {
        type: 'text' as const,
        content: 'Hola buenas. Ahí te paso información 👇',
        delay: 0,
        order: 1,
        is_active: true
      },
      {
        type: 'text' as const,
        content: 'ACEITE DE CANNABIS MEDICINAL 🌿\n🌿BENEFICIOS DE USAR CBD 🌿\n\n*Tratamiento 100% natural 🌿\n*No contiene psicoactivos que dañan el organismo\n*No es DROGA\n*La ingesta diaria para tratar alguna enfermedad de base no produce adicción\n*Se ha demostrado científicamente que el uso de aceite de cannabis medicinal 🌿 para el tratamiento de muchas enfermedades ha mejorado la calidad de vida de las personas con distintas patologías.\nENTREGA INMEDIATA🚛\n\n¿En qué te va a ayudar nuestro aceite natural?\n✅ Favorece a la relajación\n✅ Reduce el estrés\n✅ Mejora la calidad de sueño\n✅ Ayuda a regular la ansiedad\n✅ Reduce las crisis de pánico y ansiedad\n✅ Trata dolores crónicos (fibromialgia, artritis artrosis, etc)\n✅ Reduce la presión arterial\n✅ Reduce el dolor en pacientes oncológicos\n✅ Apto para niños y adultos con TEA y TDAH\n\n❗ No es un medicamento, es una opción de primer nivel para cuidar tu salud.\n📩 Escribinos si tenés dudas 👇🏻',
        delay: 1,
        order: 2,
        is_active: true
      },
      {
        type: 'text' as const,
        content: '🌸🌿 PROMO DE PRIMAVERA 🌸🌿\n\nComprando el aceite de 30ml (duración de 3 meses) tenés envío GRATIS a TODO el PAÍS‼ (con seguimiento del tratamiento)\n\n Precio final: $42.500',
        delay: 1,
        order: 3,
        is_active: true
      },
      {
        type: 'text' as const,
        content: 'Somos de CABA. No tenemos local, pero podés pasar a retirar sin cargo por Villa del Parque o Morón. También hacemos envíos a todo el país 🚚',
        delay: 1,
        order: 4,
        is_active: true
      },
      {
        type: 'text' as const,
        content: 'Son gotas sublinguales. Se empieza con una dosis básica de 2 gotas a la mañana y 2 a la noche, y después nos mantenemos en contacto para ir regulándola 💧',
        delay: 1,
        order: 5,
        is_active: true
      },
      {
        type: 'text' as const,
        content: 'Decime / Volveme a decir para lo que lo andás necesitando y te digo cuál es el indicado para vos.',
        delay: 1,
        order: 6,
        is_active: true
      }
    ]

    await saveBotMessages(defaultBotMessages)

    return { 
      success: true, 
      message: 'WhatsApp database initialized successfully' 
    }
  } catch (error: any) {
    console.error('Error initializing WhatsApp database:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// GET - Para acceder desde el navegador
export async function GET(request: Request) {
  const result = await initializeDatabase()
  
  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(result, { status: 500 })
  }
}

// POST - Para llamadas programáticas
export async function POST(request: Request) {
  const result = await initializeDatabase()
  
  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(result, { status: 500 })
  }
}


import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"
import { ChatWidget } from "@/components/chat-widget"
import { WhatsAppChannelNotification } from "@/components/whatsapp-channel-notification"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nano Moringa - Productos Medicinales 100% Naturales · Aceite de CBD",
  description: "Productos Medicinales 100% naturales. Aceite de CBD micronizado para tu bienestar diario. Ventas por mayor y menor. Envíos a todo el país con asesoramiento personalizado.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans" suppressHydrationWarning={true}>
        <CartProvider>
          {children}
      <FloatingWhatsAppButton />
      <ChatWidget />
      <WhatsAppChannelNotification />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}

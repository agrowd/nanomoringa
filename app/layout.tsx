import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { ChatWidget } from "@/components/chat-widget"
import { WhatsAppChannelNotification } from "@/components/whatsapp-channel-notification"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"

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
  title: "Nano Moringa - Productos Medicinales 100% Naturales",
  description: "Productos Medicinales 100% naturales. Aceites micronizados para tu bienestar diario. Ventas por mayor y menor. Envíos a todo el país con asesoramiento personalizado.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans" suppressHydrationWarning={true}>
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <CartProvider>
          {children}
          <ChatWidget />
          <WhatsAppChannelNotification />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}

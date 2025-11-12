import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"
import { CartInitializer } from "@/components/cart-initializer"
import { WhatsAppChannelNotification } from "@/components/whatsapp-channel-notification"
import { CouponBanner } from "@/components/coupon-banner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DripCore - Ropa Deportiva y Streetwear AAA · Precios Increíbles",
  description: "Tienda de ropa deportiva premium: zapatillas, camperas, remeras, gorras, buzos y más. Streetwear con drops exclusivos, precios increíbles y envío rápido.",
  keywords: ["ropa deportiva", "zapatillas", "camperas", "remeras", "gorras", "buzos", "streetwear", "moda urbana", "drops limitados", "precios increíbles", "en oferta"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "DripCore - Ropa Deportiva y Streetwear AAA",
    description: "La mejor ropa deportiva y streetwear con drops limitados, precios increíbles y envío rápido",
    type: "website",
    images: ["/brand/dripcore-logo-bk-grey.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans" suppressHydrationWarning={true}>
        <CartInitializer />
        <CouponBanner />
        {children}
        <FloatingWhatsAppButton />
        <WhatsAppChannelNotification />
        <Toaster />
      </body>
    </html>
  )
}

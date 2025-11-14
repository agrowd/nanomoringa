"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchBar } from "@/components/search-bar"
import { CartNotification } from "@/components/cart-notification"
import { CartDrawer } from "@/components/cart-drawer"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const { getItemCount, isOpen, toggleCart } = useCart()
  const itemCount = getItemCount()
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const router = useRouter()

  const handleConsultarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
    }
  }

  const navLinks: Array<{ href: string; label: string; onClick?: (e: React.MouseEvent) => void }> = [
    { href: "/catalogo", label: "Productos" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/faq", label: "Preguntas Frecuentes" },
    { href: "#", label: "Consultar", onClick: handleConsultarClick },
  ]

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="container mx-auto flex h-18 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-primary-foreground flex items-center justify-center p-1 overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-lg">
              <Image
                src="/brand/nanomoringa-logo.png"
                alt="Nano Moringa"
                width={52}
                height={52}
                className="object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.onClick) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-sm font-medium transition-all duration-300 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-lg cursor-pointer"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-all duration-300 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-lg"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 relative">
          {/* Search Bar */}
          <div className="relative">
            <SearchBar isExpanded={isSearchExpanded} onToggle={toggleSearch} />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCart}
            className="relative text-white hover:bg-white/10 h-12 w-12"
          >
            <ShoppingCart className="h-7 w-7" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#8B5CF6] text-xs font-bold flex items-center justify-center text-white animate-pulse">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#11141D] border-white/10">
              <SheetHeader>
                <SheetTitle className="text-white">Menú</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => {
                  if (link.onClick) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={link.onClick}
                        className="text-lg font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartNotification />
      <CartDrawer isOpen={isOpen} onClose={toggleCart} />
    </header>
  )
}

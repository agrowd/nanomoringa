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
    { href: "/faq", label: "FAQ" },
    { href: "#", label: "Consultar", onClick: handleConsultarClick },
  ]

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="w-full max-w-[1920px] mx-auto flex h-14 sm:h-16 md:h-18 items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 sm:gap-2 shrink-0 group">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full bg-primary-foreground flex items-center justify-center p-0.5 sm:p-1 md:p-1.5 lg:p-2 overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-lg">
              <Image
                src="/brand/nanomoringa-logo.png"
                alt="Nano Moringa"
                width={64}
                height={64}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
          </div>
        </Link>

        {/* Desktop Navigation - Oculto en mobile, visible desde md (768px) */}
        <nav className="desktop-nav hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 flex-1 justify-center min-w-0">
          {navLinks.map((link) => {
            if (link.onClick) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-base md:text-lg lg:text-xl font-semibold transition-all duration-300 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 md:px-4 lg:px-5 py-2 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-base md:text-lg lg:text-xl font-semibold transition-all duration-300 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 md:px-4 lg:px-5 py-2 rounded-lg whitespace-nowrap"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 relative shrink-0 ml-auto">
          {/* Search Bar - Visible en todas las pantallas */}
          <div className="relative">
            <SearchBar isExpanded={isSearchExpanded} onToggle={toggleSearch} />
          </div>

          {/* Carrito - Visible en todas las pantallas */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCart}
            className="relative text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full bg-[#8B5CF6] text-[10px] sm:text-xs font-bold flex items-center justify-center text-white animate-pulse">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu - Solo visible en mobile (menor a md) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mobile-menu-button text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10 md:hidden">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#11141D] border-white/10 w-[85vw] sm:w-[400px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-white text-xl sm:text-2xl">Menú</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-3 sm:gap-4">
                {navLinks.map((link) => {
                  if (link.onClick) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={link.onClick}
                        className="text-base sm:text-lg font-medium text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-white/10"
                      >
                        {link.label}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base sm:text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
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

"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const handleConsultarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const chatButton = document.querySelector('[aria-label="Abrir chat"]') as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
    }
  }
  return (
    <footer className="border-t border-border bg-primary mt-12 sm:mt-16 lg:mt-20">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-foreground flex items-center justify-center p-0.5 overflow-hidden shadow-lg">
                <Image src="/brand/nanomoringa-logo.png" alt="Nano Moringa" width={40} height={40} className="object-contain w-full h-full sm:w-auto sm:h-auto" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-foreground">NANO MORINGA</span>
            </Link>
            <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md leading-relaxed mb-4 sm:mb-6">
              Productos Medicinales 100% naturales. Aceites micronizados para tu bienestar diario. 
              Ventas por mayor y menor. Envíos a todo el país con asesoramiento personalizado.
            </p>
            <div className="text-xs text-primary-foreground/60 max-w-md leading-relaxed p-3 sm:p-4 bg-primary-foreground/5 rounded-lg">
              <p className="font-semibold mb-2">Aviso Legal:</p>
              <p>Este producto no es un medicamento. No está destinado a diagnosticar, tratar, curar o prevenir ninguna enfermedad. 
              Consulte con su médico antes de usar. Solo para mayores de 18 años. Manténgase fuera del alcance de los niños.</p>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-primary-foreground">Navegación</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-primary-foreground/80">
              <li>
                <Link href="/catalogo" className="hover:text-accent transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-accent transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={handleConsultarClick}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Consultar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-primary-foreground">Contacto</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-primary-foreground/80">
              <li>
                <a href="https://instagram.com/nanomoringa" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span>📷</span> @nanomoringa
                </a>
              </li>
              <li>
                <a href="https://wa.me/5491158082486" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span>💬</span> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-6 sm:mt-8 lg:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm lg:text-base text-primary-foreground/60">&copy; {new Date().getFullYear()} Nano Moringa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

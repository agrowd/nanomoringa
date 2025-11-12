import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center p-0.5 overflow-hidden shadow-lg">
                <Image src="/brand/medicina-natural-logo.png" alt="Medicina Natural" width={48} height={48} className="object-contain" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">MEDICINA NATURAL</span>
            </Link>
            <p className="text-base text-primary-foreground/80 max-w-md leading-relaxed mb-6">
              Bienestar natural con productos CBD de calidad. Aceites, cápsulas y gomitas con seguimiento personalizado. 
              Envíos a todo el país con calidad certificada.
            </p>
            <div className="text-xs text-primary-foreground/60 max-w-md leading-relaxed p-4 bg-primary-foreground/5 rounded-lg">
              <p className="font-semibold mb-2">Aviso Legal:</p>
              <p>Este producto no es un medicamento. No está destinado a diagnosticar, tratar, curar o prevenir ninguna enfermedad. 
              Consulte con su médico antes de usar. Solo para mayores de 18 años. Manténgase fuera del alcance de los niños.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Navegación</h3>
            <ul className="space-y-3 text-base text-primary-foreground/80">
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
                <Link href="/contacto" className="hover:text-accent transition-colors">
                  Consultar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Contacto</h3>
            <ul className="space-y-3 text-base text-primary-foreground/80">
              <li>
                <a href="https://instagram.com/cbd.medicina.ok" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span>📷</span> @cbd.medicina.ok
                </a>
              </li>
              <li>
                <a href="https://wa.me/5491140895557" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
                  <span>💬</span> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-base text-primary-foreground/60">&copy; {new Date().getFullYear()} Medicina Natural. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

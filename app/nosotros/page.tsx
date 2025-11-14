import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export const metadata = {
  title: "Nosotros - Nano Moringa",
  description: "Conocé la filosofía detrás de Nano Moringa. Bienestar con productos naturales certificados.",
}

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center p-1 mx-auto mb-4 sm:mb-6 shadow-lg overflow-hidden">
              <Image
                src="/brand/nanomoringa-logo.png"
                alt="Nano Moringa"
                width={64}
                height={64}
                className="object-contain w-full h-full sm:w-auto sm:h-auto"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">Nosotros</h1>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">Acompañamos tu bienestar</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6 sm:space-y-8 text-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🌿</div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">Nuestra Misión</h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground px-4">
              Acompañamos tu bienestar diario con productos naturales de la más alta calidad. 
              Cada aceite es cuidadosamente seleccionado para brindarte tranquilidad y confianza.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 my-8 sm:my-12">
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">💚</div>
                <h3 className="font-bold text-lg sm:text-xl mb-2">Calidad</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Productos certificados</p>
              </div>
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">👥</div>
                <h3 className="font-bold text-lg sm:text-xl mb-2">Seguimiento Personalizado</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Asesoramiento 1:1 adaptado a tus necesidades. Cada persona es única y por eso diseñamos un plan de tratamiento personalizado que se ajusta a tu estilo de vida, objetivos y condiciones específicas. Te acompañamos en cada paso del proceso.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">📦</div>
                <h3 className="font-bold text-lg sm:text-xl mb-2">Envíos</h3>
                <p className="text-muted-foreground text-sm sm:text-base">A todo el país</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">Nuestro Compromiso</h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground px-4">
              Trabajamos con transparencia y responsabilidad. Cada producto cuenta con 
              certificaciones de laboratorio y análisis de pureza. Tu bienestar es nuestra prioridad.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

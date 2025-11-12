import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export const metadata = {
  title: "Nosotros - Medicina Natural",
  description: "Conocé la filosofía detrás de Medicina Natural. Bienestar con productos naturales certificados.",
}

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center p-1 mx-auto mb-6 shadow-lg overflow-hidden">
              <Image
                src="/brand/medicina-natural-logo.png"
                alt="Medicina Natural"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">Nosotros</h1>
            <p className="text-xl text-muted-foreground">Acompañamos tu bienestar</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-center">
            <div className="text-6xl mb-4">🌿</div>
            
            <h2 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-playfair)]">Nuestra Misión</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Acompañamos tu bienestar diario con productos naturales de la más alta calidad. 
              Cada aceite es cuidadosamente seleccionado para brindarte tranquilidad y confianza.
            </p>

            <div className="grid md:grid-cols-3 gap-8 my-12">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-5xl mb-3">💚</div>
                <h3 className="font-bold text-xl mb-2">Calidad</h3>
                <p className="text-muted-foreground">Productos certificados</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-5xl mb-3">👥</div>
                <h3 className="font-bold text-xl mb-2">Seguimiento</h3>
                <p className="text-muted-foreground">Asesoramiento 1:1</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="font-bold text-xl mb-2">Envíos</h3>
                <p className="text-muted-foreground">A todo el país</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-playfair)]">Nuestro Compromiso</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
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

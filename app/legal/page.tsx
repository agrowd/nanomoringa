import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Términos y Condiciones - DripCore",
  description: "Términos legales y condiciones de uso",
}

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Términos y Condiciones</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Aceptación de Términos</h2>
              <p className="leading-relaxed">
                Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso y todas
                las leyes y regulaciones aplicables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Uso del Sitio</h2>
              <p className="leading-relaxed">
                Este sitio web es propiedad de DripCore. El contenido, organización, gráficos, diseño, compilación y
                otros asuntos relacionados con el sitio están protegidos por derechos de autor y otras leyes de
                propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Productos y Precios</h2>
              <p className="leading-relaxed">
                Todos los precios están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o
                discontinuar productos en cualquier momento. Los productos están sujetos a disponibilidad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Política de Cambios y Devoluciones</h2>
              <p className="leading-relaxed">
                Aceptamos cambios dentro de los 15 días de recibido el producto, siempre que esté sin uso, con sus
                etiquetas originales y en su empaque original. Las devoluciones se evalúan caso por caso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Privacidad</h2>
              <p className="leading-relaxed">
                Tu privacidad es importante para nosotros. Toda la información personal recopilada será utilizada
                únicamente para procesar pedidos y mejorar tu experiencia de compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contacto</h2>
              <p className="leading-relaxed">
                Para cualquier pregunta sobre estos términos y condiciones, por favor contáctanos a través de nuestros
                canales oficiales.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

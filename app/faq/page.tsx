import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "Preguntas Frecuentes - Nano Moringa",
  description: "Respondemos tus dudas sobre nuestros productos naturales. Uso, dosificación, envíos y más.",
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">💬</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">Preguntas Frecuentes</h1>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">Resolvé tus dudas</p>
          </div>

          <Accordion type="single" collapsible className="space-y-2 sm:space-y-4">
            <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-3 sm:px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-3 sm:py-4 hover:no-underline">
                ¿Cómo funciona el proceso de compra?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                Consultanos por WhatsApp, te asesoramos personalmente sobre el producto ideal para vos, 
                coordinamos el pago y envío. Todo simple y directo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-3 sm:px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-3 sm:py-4 hover:no-underline">
                ¿Los productos son seguros?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                Todos nuestros productos cuentan con certificaciones de laboratorio y análisis de pureza. 
                Son 100% naturales, sin aditivos químicos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-3 sm:px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-3 sm:py-4 hover:no-underline">
                ¿Hacen envíos a todo el país?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                Sí, enviamos a todo el país con seguimiento. Los costos y tiempos se informan al 
                momento de tu consulta por WhatsApp.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-3 sm:px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-3 sm:py-4 hover:no-underline">
                ¿Cómo se usan los productos?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                Cada producto incluye instrucciones detalladas de uso. Además, te brindamos 
                seguimiento personalizado y respondemos todas tus dudas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-3 sm:px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-3 sm:py-4 hover:no-underline">
                ¿Ofrecen asesoramiento?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                Sí, ese es nuestro diferencial. Te acompañamos personalmente desde la primera consulta 
                hasta que encuentres tu rutina ideal. Escribinos por WhatsApp.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-gray-200 rounded-lg px-3 sm:px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-3 sm:py-4 hover:no-underline">
                ¿Qué métodos de pago aceptan?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-3 sm:pb-4">
                Transferencia bancaria, Mercado Pago y efectivo en caso de retiro personal. 
                Los detalles se coordinan por WhatsApp.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </>
  )
}

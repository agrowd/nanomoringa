import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Sparkles } from "lucide-react"

export const metadata = {
  title: "Misión - DripCore",
  description: "Nuestra misión y valores",
}

export default function MisionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestra Misión</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ser tu tienda de ropa deportiva y streetwear premium con la mejor selección y envío rápido
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-[#8B5CF6]/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Selección Premium</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seleccionamos cuidadosamente cada pieza de ropa deportiva y streetwear para garantizar la más alta
                  calidad en cada producto que ofrecemos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-[#8B5CF6]/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Diseño Exclusivo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cada colección es única y limitada, diseñada para destacar y expresar individualidad sin compromisos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-[#8B5CF6]/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Comunidad</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Construimos una comunidad de personas que valoran el estilo auténtico y la cultura urbana.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

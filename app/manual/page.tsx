import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Settings, MessageCircle, Filter, Shield, Code } from "lucide-react"

export const metadata = {
  title: "Manual de Uso - DripCore",
  description: "Guía completa de funcionamiento del sitio DripCore",
}

export default function ManualPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#8B5CF6] text-white">Documentación Técnica</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Manual de Funcionamiento</h1>
            <p className="text-xl text-muted-foreground">Guía completa del sitio DripCore E-commerce</p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-[#8B5CF6]" />
                  Resumen del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  DripCore es un sitio e-commerce completo construido con Next.js 14, TypeScript, Tailwind CSS y
                  shadcn/ui. Diseñado para una marca de streetwear premium con drops limitados, incluye catálogo con
                  filtros, fichas de producto, carrito local y checkout por WhatsApp.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-[#8B5CF6]">8</p>
                    <p className="text-sm text-muted-foreground">Productos Demo</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-[#8B5CF6]">10+</p>
                    <p className="text-sm text-muted-foreground">Páginas</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-[#8B5CF6]">100%</p>
                    <p className="text-sm text-muted-foreground">Responsive</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-[#8B5CF6]">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Checkout</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#8B5CF6]" />
                  Funcionalidades para Usuarios
                </CardTitle>
                <CardDescription>Experiencia de compra completa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#8B5CF6]" />
                      Catálogo de Productos
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Grid responsive de productos</li>
                      <li>• Filtros por categoría, presentación, variante y precio</li>
                      <li>• Ordenamiento (nuevo, precio asc/desc)</li>
                      <li>• Badges de estado (nuevo, descuento, stock)</li>
                      <li>• URLs compartibles con filtros</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-[#8B5CF6]" />
                      Ficha de Producto
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Galería de imágenes con navegación</li>
                      <li>• Selección de presentación y variante</li>
                      <li>• Control de cantidad</li>
                      <li>• Agregar al carrito</li>
                      <li>• Consulta directa por WhatsApp</li>
                      <li>• Tab de vista 3D (placeholder)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-[#8B5CF6]" />
                      Carrito de Compras
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Persistencia en localStorage</li>
                      <li>• Modificar cantidades</li>
                      <li>• Eliminar items</li>
                      <li>• Selector envío/retiro</li>
                      <li>• Campo de notas opcional</li>
                      <li>• Resumen de compra</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#8B5CF6]" />
                      Integración WhatsApp
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Botón flotante en todas las páginas</li>
                      <li>• Consulta desde producto</li>
                      <li>• Checkout completo desde carrito</li>
                      <li>• Mensajes pre-formateados</li>
                      <li>• Incluye URL de referencia</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#8B5CF6]" />
                  Panel de Administración
                </CardTitle>
                <CardDescription>Gestión completa de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#8B5CF6]" />
                      Autenticación
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Sistema de login simple con credenciales configurables por variables de entorno:
                    </p>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                      <p>Usuario: admin (configurable en NEXT_PUBLIC_ADMIN_USER)</p>
                      <p>Contraseña: dripcore2025 (configurable en NEXT_PUBLIC_ADMIN_PASS)</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">CRUD de Productos</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Crear nuevos productos con formulario completo</li>
                      <li>• Editar productos existentes</li>
                      <li>• Eliminar productos con confirmación</li>
                      <li>• Subida de imágenes (placeholder)</li>
                      <li>• Configurar presentaciones, variantes, categorías</li>
                      <li>• Marcar productos como destacados</li>
                      <li>• Gestión de stock y precios</li>
                      <li>• Etiquetas (nuevo, bestseller, drop-limitado)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-[#8B5CF6]" />
                  Stack Tecnológico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Frontend</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Next.js 14 (App Router)</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS v4</li>
                      <li>• shadcn/ui</li>
                      <li>• Lucide Icons</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Estado y Datos</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Zustand (cart + auth)</li>
                      <li>• localStorage persistence</li>
                      <li>• JSON local (products.json)</li>
                      <li>• Prisma ready (opcional)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Características</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• SEO optimizado</li>
                      <li>• JSON-LD schemas</li>
                      <li>• Responsive design</li>
                      <li>• Accesibilidad (ARIA)</li>
                      <li>• Dark theme</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Variables de Entorno</CardTitle>
                <CardDescription>Configuración necesaria en .env.local</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                  <p className="text-[#8B5CF6]"># WhatsApp Configuration</p>
                  <p>NEXT_PUBLIC_WA_PHONE=5491172456286</p>
                  <p className="text-[#8B5CF6] mt-4"># Admin Credentials</p>
                  <p>NEXT_PUBLIC_ADMIN_USER=admin</p>
                  <p>NEXT_PUBLIC_ADMIN_PASS=dripcore2025</p>
                  <p className="text-[#8B5CF6] mt-4"># Database (Option B - opcional)</p>
                  <p className="text-muted-foreground"># DATABASE_URL="file:./dev.db"</p>
                </div>
              </CardContent>
            </Card>

            {/* Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Estructura de Rutas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Públicas</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                      <li>/ - Home</li>
                      <li>/catalogo - Catálogo con filtros</li>
                      <li>/producto/[slug] - Detalle de producto</li>
                      <li>/carrito - Carrito de compras</li>
                      <li>/nosotros - Sobre la marca</li>
                      <li>/mision - Misión y valores</li>
                      <li>/faq - Preguntas frecuentes</li>
                      <li>/contacto - Formulario de contacto</li>
                      <li>/legal - Términos y condiciones</li>
                      <li>/manual - Esta página</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Admin (protegidas)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                      <li>/admin - Login</li>
                      <li>/admin/productos - CRUD productos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Estructura de Datos</CardTitle>
                <CardDescription>Modelo de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAt?: number
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  tags: string[]
  stock: number
  featured: boolean
  createdAt: string
}`}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Future Enhancements */}
            <Card>
              <CardHeader>
                <CardTitle>Mejoras Futuras (v1.1+)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Funcionalidades</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Vista 3D de productos (react-three-fiber)</li>
                      <li>• Sistema de reviews y ratings</li>
                      <li>• Wishlist / favoritos</li>
                      <li>• Newsletter subscription</li>
                      <li>• Búsqueda de productos</li>
                      <li>• Comparador de productos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Backend</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Migración a Prisma + SQLite/PostgreSQL</li>
                      <li>• API Routes para CRUD</li>
                      <li>• Autenticación con NextAuth</li>
                      <li>• Upload real de imágenes (Vercel Blob)</li>
                      <li>• Sistema de órdenes</li>
                      <li>• Analytics y métricas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Installation */}
            <Card>
              <CardHeader>
                <CardTitle>Instalación y Desarrollo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Clonar o descargar el proyecto</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <p>git clone [repository-url]</p>
                    <p>cd dripcore-ecommerce</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Instalar dependencias</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <p>npm install</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Configurar variables de entorno</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <p>cp .env.example .env.local</p>
                    <p className="text-muted-foreground"># Editar .env.local con tus valores</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. Ejecutar en desarrollo</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <p>npm run dev</p>
                    <p className="text-muted-foreground"># Abrir http://localhost:3000</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">5. Build para producción</h4>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                    <p>npm run build</p>
                    <p>npm start</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-[#8B5CF6]">
              <CardHeader>
                <CardTitle className="text-[#8B5CF6]">Notas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    <span>
                      Esta página de manual es temporal y debe ser eliminada antes del lanzamiento en producción.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    <span>
                      Los datos de productos están en /data/products.json. Puedes editarlos directamente o usar el panel
                      admin.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    <span>
                      El checkout por WhatsApp es funcional pero requiere configurar el número correcto en las variables
                      de entorno.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    <span>
                      El sistema de autenticación admin es básico. Para producción, considera implementar NextAuth o
                      similar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    <span>
                      Las imágenes usan placeholders. Reemplaza con imágenes reales en /public o usa un servicio de
                      hosting.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

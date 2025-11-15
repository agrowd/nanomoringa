"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  LogOut,
  ShoppingCart,
  DollarSign,
  Ticket,
  Eye,
  MessageSquare
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  compareAt?: number
  stock: number
  category: string
  images: string[]
  featured: boolean
  slug: string
}

interface Coupon {
  id: number
  code: string
  name: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  currentUses: number
  maxUses?: number
  expiresAt?: string
  isActive: boolean
}

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadProducts()
    loadCoupons()
    loadUnreadCount()
    
    // Polling cada 20 segundos para actualizar contador de mensajes sin leer
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 20000)
    
    // SSE para tiempo real
    const eventSource = new EventSource("/api/whatsapp/events")
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "message_received") {
          loadUnreadCount()
          // Reproducir sonido siempre que llegue un mensaje nuevo
          playNotificationSound()
        }
        // También reproducir sonido cuando se envía un mensaje del bot (nuevo lead)
        if (data.type === "message_sent" && data.data?.sender_type === 'bot') {
          loadUnreadCount()
          playNotificationSound()
        }
      } catch (error) {
        console.error("Error parsing SSE event:", error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      // Reconectar después de 3 segundos
      setTimeout(() => {
        eventSource.close()
      }, 3000)
    }
    
    return () => {
      clearInterval(interval)
      eventSource.close()
    }
  }, [isAuthenticated, router])
  
  const loadUnreadCount = async () => {
    try {
      const response = await fetch("/api/whatsapp/unread-count")
      if (response.ok) {
        const data = await response.json()
        const previousCount = unreadCount
        setUnreadCount(data.count || 0)
        
        // Si hay nuevos mensajes, reproducir sonido
        if (data.count > previousCount && previousCount > 0) {
          playNotificationSound()
        }
      }
    } catch (error) {
      console.error("Error loading unread count:", error)
    }
  }
  
  const playNotificationSound = () => {
    const beep = new AudioContext()
    const oscillator = beep.createOscillator()
    const gainNode = beep.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(beep.destination)
    oscillator.frequency.value = 800
    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, beep.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, beep.currentTime + 0.5)
    oscillator.start(beep.currentTime)
    oscillator.stop(beep.currentTime + 0.5)
  }

  const loadProducts = async () => {
    try {
      console.log("Loading products from /api/products...")
      const response = await fetch("/api/products")
      console.log("Response status:", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("Products loaded:", data.length, "products")
        console.log("First product:", data[0])
        setProducts(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to load products:", response.status, response.statusText, errorData)
        toast({
          title: "Error al cargar productos",
          description: errorData.error || `Error ${response.status}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron cargar los productos",
        variant: "destructive",
      })
    }
  }

  const loadCoupons = async () => {
    try {
      console.log("Loading coupons from /api/coupons...")
      const response = await fetch("/api/coupons")
      if (response.ok) {
        const data = await response.json()
        console.log("Coupons loaded:", data.length, "coupons")
        setCoupons(data)
      } else {
        console.error("Failed to load coupons:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error loading coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    router.push("/admin")
  }

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock < 10).length,
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    featuredProducts: products.filter(p => p.featured).length,
    productsOnSale: products.filter(p => p.compareAt && p.compareAt > p.price).length,
    averageDiscount: products.filter(p => p.compareAt && p.compareAt > p.price).length > 0 
      ? products.filter(p => p.compareAt && p.compareAt > p.price)
          .reduce((sum, p) => {
            const discount = ((p.compareAt! - p.price) / p.compareAt!) * 100
            return sum + discount
          }, 0) / products.filter(p => p.compareAt && p.compareAt > p.price).length
      : 0
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/brand/nanomoringa-logo.png" alt="Nano Moringa" width={40} height={40} className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Panel de administración Nano Moringa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Botón WhatsApp con notificación */}
              <Button
                asChild
                variant="outline"
                className="relative border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
              >
                <Link href="/admin/whatsapp">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Productos</CardTitle>
              <Package className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
              <p className="text-sm text-gray-600 mt-1">Productos en catálogo</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Stock Bajo</CardTitle>
              <TrendingUp className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.lowStock}</div>
              <p className="text-sm text-gray-600 mt-1">Necesitan reposición</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Valor Total</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${stats.totalRevenue.toLocaleString('es-AR')}
              </div>
              <p className="text-sm text-gray-600 mt-1">Valor en inventario</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Destacados</CardTitle>
              <Settings className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.featuredProducts}</div>
              <p className="text-sm text-gray-600 mt-1">Productos destacados</p>
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">En Oferta</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.productsOnSale}</div>
              <p className="text-sm text-gray-600 mt-1">Productos en oferta</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Descuento Promedio</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{Math.round(stats.averageDiscount)}%</div>
              <p className="text-sm text-gray-600 mt-1">Descuento promedio</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Stock Total</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </div>
              <p className="text-sm text-gray-600 mt-1">Unidades disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Categorías</CardTitle>
              <Settings className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                {new Set(products.map(p => p.category)).size}
              </div>
              <p className="text-sm text-gray-600 mt-1">Categorías activas</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - WhatsApp Bot incluido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Plus className="h-5 w-5 text-purple-600" />
                Nuevo Producto
              </CardTitle>
              <CardDescription className="text-gray-600">Agregar un nuevo producto al catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/admin/productos/nuevo">Crear Producto</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Edit className="h-5 w-5 text-purple-600" />
                Gestión de Productos
              </CardTitle>
              <CardDescription className="text-gray-600">Editar productos existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                <Link href="/admin/productos">Ver Productos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Ticket className="h-5 w-5 text-purple-600" />
                Cupones de Descuento
              </CardTitle>
              <CardDescription className="text-gray-600">Generar y gestionar cupones</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                <Link href="/admin/cupones">Gestionar Cupones</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MessageSquare className="h-5 w-5 text-green-600" />
                WhatsApp Bot
              </CardTitle>
              <CardDescription className="text-gray-600">Gestionar conversaciones y QR</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                <Link href="/admin/whatsapp-configuracion">Abrir WhatsApp</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas de Cupones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Cupones Activos</CardTitle>
              <Ticket className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {coupons.filter(c => c.isActive).length}
              </div>
              <p className="text-sm opacity-80 mt-1">Cupones disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Usos Totales</CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {coupons.reduce((sum, c) => sum + c.currentUses, 0)}
              </div>
              <p className="text-sm opacity-80 mt-1">Veces aplicados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Descuento Máximo</CardTitle>
              <DollarSign className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {coupons.length > 0 
                  ? Math.max(...coupons.map(c => c.discountType === 'percentage' ? c.discountValue : 0))
                  : 0}%
              </div>
              <p className="text-sm opacity-80 mt-1">Mayor descuento activo</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Productos Recientes</CardTitle>
            <CardDescription className="text-gray-600">Últimos productos agregados al catálogo</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-600">Cargando productos...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/producto/${product.slug || product.id}`}>
                        <h4 className="font-semibold text-sm text-gray-900 hover:text-purple-600 cursor-pointer hover:underline">{product.name}</h4>
                      </Link>
                      <p className="text-xs text-gray-600 capitalize">{product.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-gray-900">${product.price.toLocaleString('es-AR')}</span>
                        <Badge variant={product.stock < 10 ? "destructive" : "secondary"} className="text-xs">
                          Stock: {product.stock}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        <Link href={`/admin/productos/editar/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                        <Link href={`/producto/${product.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

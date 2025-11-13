"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Edit, Trash2, LogOut, Eye, Images } from "lucide-react"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { ImageSelector } from "@/components/image-selector"

export default function AdminProductsPage() {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadProducts()
  }, [isAuthenticated, router])

  // Recargar productos cuando se vuelve a esta página (desde crear producto)
  useEffect(() => {
    const handleFocus = () => {
      loadProducts()
    }
    window.addEventListener('focus', handleFocus)
    // También recargar cuando la página se vuelve visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        loadProducts()
      }
    })
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log("Loading products from /api/products...")
      const response = await fetch("/api/products")
      console.log("Response status:", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("Products loaded:", data.length, "products")
        setProducts(data)
        if (data.length === 0) {
          toast({
            title: "Sin productos",
            description: "No hay productos en la base de datos. Creá tu primer producto.",
          })
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to load products:", response.status, response.statusText, errorData)
        toast({
          title: "Error al cargar productos",
          description: errorData.error || `Error ${response.status}: ${response.statusText}`,
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

  const handleOpenImageModal = (product: Product) => {
    setSelectedProduct(product)
    setShowImageModal(true)
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setSelectedProduct(null)
  }

  const handleReorderImages = async (newImages: string[]) => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`/api/products/reorder-images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          images: newImages
        })
      })

      if (response.ok) {
        // Actualizar el producto en el estado local
        setProducts(prev => prev.map(p => 
          p.id === selectedProduct.id 
            ? { ...p, images: newImages }
            : p
        ))

        // Actualizar el producto seleccionado
        setSelectedProduct(prev => prev ? { ...prev, images: newImages } : null)

        toast({
          title: "Imágenes actualizadas",
          description: "El orden de las imágenes se ha actualizado correctamente",
        })
      } else {
        throw new Error('Error al actualizar imágenes')
      }
    } catch (error) {
      console.error('Error reordering images:', error)
      toast({
        title: "Error",
        description: "No se pudieron actualizar las imágenes",
        variant: "destructive",
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    if (!selectedProduct) return

    const newImages = selectedProduct.images.filter((_, i) => i !== index)
    handleReorderImages(newImages)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        })
        
        if (response.ok) {
          setProducts(products.filter((p) => p.id !== id))
          toast({
            title: "Producto eliminado",
            description: "El producto se ha eliminado correctamente",
          })
        } else {
          throw new Error("Error al eliminar el producto")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      }
    }
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
              <Button asChild variant="outline">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Link>
              </Button>
              <Image src="/brand/nanomoringa-logo.png" alt="Nano Moringa" width={40} height={40} className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-sm text-gray-600">Administra tu catálogo</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Productos</h2>
            <p className="text-gray-600">{products.length} productos en total</p>
          </div>

          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/admin/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Cargando productos...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600 mb-4">No hay productos aún</div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
              <Link href="/admin/productos/nuevo">
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Producto
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-gray-100">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-purple-600 text-white">Destacado</Badge>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      <Badge
                        variant={product.stock < 10 ? "destructive" : product.stock < 25 ? "secondary" : "default"}
                        className="text-xs"
                      >
                        Stock: {product.stock}
                      </Badge>
                      {product.compareAt && product.compareAt > product.price && (
                        <Badge className="bg-red-500 text-white text-xs">
                          -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Link href={`/producto/${product.slug || product.id}`}>
                    <CardTitle className="text-lg mb-2 line-clamp-1 text-gray-900 hover:text-purple-600 cursor-pointer hover:underline">{product.name}</CardTitle>
                  </Link>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Precio: <span className="font-semibold text-gray-900">${product.price.toLocaleString('es-AR')}</span></p>
                    {product.compareAt && (
                      <p className="text-red-600">Antes: ${product.compareAt.toLocaleString('es-AR')}</p>
                    )}
                    <p>Categoría: <span className="capitalize font-medium">{product.category}</span></p>
                    <p>SKU: <span className="font-mono text-xs">{product.sku}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                      <Link href={`/producto/${product.slug || product.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      <Link href={`/admin/productos/editar/${product.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => handleOpenImageModal(product)}
                      title="Gestionar imágenes"
                    >
                      <Images className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal para gestión de imágenes */}
      {showImageModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestionar Imágenes</h2>
                  <p className="text-gray-600 mt-1">{selectedProduct.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleCloseImageModal}
                  className="border-gray-300"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <ImageSelector
                images={selectedProduct.images}
                onReorderImages={handleReorderImages}
                onRemoveImage={handleRemoveImage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

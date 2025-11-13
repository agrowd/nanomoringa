"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X, Upload } from "lucide-react"
import Link from "next/link"
import { MediaManager } from "@/components/media-manager"
import type { Product } from "@/lib/types"

interface ProductForm {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  long_description: string
  price: number
  compareAt: number
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  videos: string[]
  tags: string[]
  stock: number
  featured: boolean
}

const categories = [
  "Aceites", "Tópicos", "Cápsulas", "Gomitas", "Cremas", "Otros"
]

const productSizes = ["30ml", "60ml", "100ml", "30 unidades", "60 unidades", "90 unidades"]
const productColors = ["Natural", "Relajante", "Energizante", "Equilibrio"]
const defaultTags = ["nuevo", "destacado", "en-oferta", "bestseller", "100-natural", "micronizado"]

export default function NewProductPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState<ProductForm>({
    id: "",
    name: "",
    slug: "",
    sku: "",
    description: "",
    long_description: "",
    price: 0,
    compareAt: 0,
    category: "",
    sizes: [],
    colors: [],
    images: [],
    videos: [],
    tags: [],
    stock: 0,
    featured: false
  })

  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
  }, [isAuthenticated, router])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleCategoryChange = (category: string) => {
    // No establecer presentaciones por defecto, dejar que el usuario las agregue manualmente
    setForm(prev => ({
      ...prev,
      category
    }))
  }

  const addSize = () => {
    if (newSize && !form.sizes.includes(newSize)) {
      setForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }))
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const addColor = () => {
    if (newColor && !form.colors.includes(newColor)) {
      setForm(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }))
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }))
  }

  const addTag = () => {
    if (newTag && !form.tags.includes(newTag)) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validar que haya al menos una imagen
      if (form.images.length === 0) {
        toast({
          title: "Error",
          description: "Debes agregar al menos una imagen del producto",
          variant: "destructive",
        })
        return
      }

      console.log('[FORM] Submitting product data:', {
        name: form.name,
        images: form.images.length,
        videos: form.videos.length,
        sizes: form.sizes,
        colors: form.colors
      })

      // Generar ID único si no existe
      const productData = {
        ...form,
        id: form.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
        // No agregar promociones por defecto
        is_on_sale: false,
        sale_price: null,
        sale_start_date: null,
        sale_end_date: null,
        sale_duration_days: 7
      }

      console.log('[FORM] Product data to send:', productData)

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const createdProduct = await response.json()
        console.log('[FORM] Product created successfully:', createdProduct)
        toast({
          title: "Producto creado",
          description: `"${form.name}" se ha creado exitosamente`,
        })
        // Esperar un momento antes de redirigir para que el toast se vea
        setTimeout(() => {
          router.push("/admin/productos")
          // Forzar recarga después de navegar
          router.refresh()
        }, 500)
      } else {
        const errorData = await response.json()
        console.error('[FORM] Error response:', errorData)
        throw new Error(errorData.details || errorData.error || "Error al crear el producto")
      }
    } catch (error) {
      console.error("[FORM] Error creating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el producto",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Básica */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Información Básica</CardTitle>
                <CardDescription className="text-gray-600">Datos principales del producto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej: Aceite Relajante Nano Moringa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="aceite-relajante-nano-moringa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="NM-ACE-001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Descripción Corta</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción breve del producto..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="long_description">Descripción Larga</Label>
                  <Textarea
                    id="long_description"
                    value={form.long_description}
                    onChange={(e) => setForm(prev => ({ ...prev, long_description: e.target.value }))}
                    placeholder="Descripción detallada del producto..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Precios y Stock */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Precios y Stock</CardTitle>
                <CardDescription className="text-gray-600">Configuración de precios y disponibilidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="45000"
                    required
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="compareAt">Precio Anterior ($)</Label>
                  <Input
                    id="compareAt"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.compareAt || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, compareAt: parseFloat(e.target.value) || 0 }))}
                    placeholder="65000"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                  {form.compareAt > 0 && form.price > 0 && form.compareAt > form.price && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <span className="text-green-700 font-semibold">
                        Descuento: {Math.round(((form.compareAt - form.price) / form.compareAt) * 100)}%
                      </span>
                      <div className="text-green-600">
                        Ahorro: ${(form.compareAt - form.price).toLocaleString('es-AR')}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    placeholder="50"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={form.featured}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Producto Destacado</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Presentaciones */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Presentaciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Botones rápidos para presentaciones */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Presentaciones sugeridas:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, sizes: productSizes }))}
                    className="text-xs"
                  >
                    Tamaños Comunes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, colors: productColors }))}
                    className="text-xs"
                  >
                    Colores Comunes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, sizes: ["Único"] }))}
                    className="text-xs"
                  >
                    Presentación Única
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Agregar presentación personalizada"
                  className="bg-white border-gray-300 focus:border-purple-500"
                />
                <Button type="button" onClick={addSize}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.sizes.map(size => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1 pr-1">
                    <span>{size}</span>
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Eliminar presentación ${size}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Colores */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Colores Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Agregar color (ej: Negro)"
                />
                <Button type="button" onClick={addColor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.colors.map(color => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1 pr-1">
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Eliminar color ${color}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Etiquetas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Agregar etiqueta"
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {defaultTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={form.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (form.tags.includes(tag)) {
                        removeTag(tag)
                      } else {
                        setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <Badge key={tag} variant="default" className="flex items-center gap-1 pr-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Eliminar etiqueta ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Manager */}
          <MediaManager
            images={form.images}
            videos={form.videos}
            onImagesChange={(images) => setForm(prev => ({ ...prev, images }))}
            onVideosChange={(videos) => setForm(prev => ({ ...prev, videos }))}
          />

          {/* Preview */}
          {form.name && form.images.length > 0 && (
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Vista Previa</CardTitle>
                <CardDescription className="text-gray-600">Así se verá tu producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Imagen */}
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      {form.images[0] ? (
                        <img
                          src={form.images[0]}
                          alt={form.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    
                    {/* Información */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{form.name}</h3>
                        <p className="text-sm text-gray-600">{form.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${form.price?.toLocaleString('es-AR') || '0'}
                        </span>
                        {form.compareAt > form.price && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              ${form.compareAt?.toLocaleString('es-AR')}
                            </span>
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              -{Math.round(((form.compareAt - form.price) / form.compareAt) * 100)}%
                            </span>
                          </>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-3">{form.description}</p>
                      
                      {form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {form.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        <p>Stock: {form.stock} unidades</p>
                        <p>SKU: {form.sku}</p>
                        {form.featured && (
                          <p className="text-purple-600 font-semibold">⭐ Destacado</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/productos">Cancelar</Link>
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Crear Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

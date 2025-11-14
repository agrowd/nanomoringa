"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { MediaManager } from "@/components/media-manager"
import { SaveConfirmationDialog } from "@/components/save-confirmation-dialog"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"

export default function EditProductPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    longDescription: "",
    price: 0,
    compareAt: 0,
    category: "",
    sizes: [] as string[],
    colors: [] as string[],
    tags: [] as string[],
    stock: 0,
    featured: false,
    images: [] as string[],
    videos: [] as string[]
  })
  const [originalData, setOriginalData] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadProduct()
  }, [isAuthenticated, router, params.id])

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products?id=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          sku: data.sku || "",
          description: data.description || "",
          longDescription: data.long_description || "",
          price: data.price || 0,
          compareAt: data.compareAt || 0,
          category: data.category || "",
          sizes: data.sizes || [],
          colors: data.colors || [],
          tags: data.tags || [],
          stock: data.stock || 0,
          featured: data.featured || false,
          images: data.images || [],
          videos: data.videos || [],
          is_on_sale: data.is_on_sale || false,
          sale_price: data.sale_price || 0,
          sale_duration_days: data.sale_duration_days || 7
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          variant: "destructive",
        })
        router.push("/admin/productos")
      }
    } catch (error) {
      console.error("Error loading product:", error)
      toast({
        title: "Error",
        description: "Error al cargar el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Preparar los datos para enviar al API
      const productData = {
        id: params.id,
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        description: formData.description,
        long_description: formData.long_description,
        price: parseFloat(formData.price.toString()) || 0,
        compareAt: formData.compareAt ? parseFloat(formData.compareAt.toString()) : null,
        category: formData.category,
        sizes: Array.isArray(formData.sizes) ? formData.sizes : [],
        colors: Array.isArray(formData.colors) ? formData.colors : [],
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        stock: parseInt(formData.stock.toString()) || 0,
        featured: Boolean(formData.featured),
        images: Array.isArray(formData.images) ? formData.images : [],
        videos: Array.isArray(formData.videos) ? formData.videos : [],
        is_on_sale: Boolean(formData.is_on_sale),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price.toString()) : null,
        sale_start_date: formData.sale_start_date || null,
        sale_end_date: formData.sale_end_date || null,
        sale_duration_days: parseInt(formData.sale_duration_days?.toString()) || 7
      }

      console.log('[EDIT] Sending product data:', productData)
      console.log('[EDIT] Product data types:', {
        name: typeof productData.name,
        price: typeof productData.price,
        sizes: Array.isArray(productData.sizes),
        colors: Array.isArray(productData.colors),
        images: Array.isArray(productData.images),
        videos: Array.isArray(productData.videos),
        tags: Array.isArray(productData.tags)
      })

      // Calcular tamaño del payload antes de enviar
      const payloadSize = JSON.stringify(productData).length
      const payloadSizeMB = (payloadSize / (1024 * 1024)).toFixed(2)
      console.log('[EDIT] Payload size:', payloadSize, 'bytes', `(${payloadSizeMB}MB)`)
      
      if (payloadSize > 4 * 1024 * 1024) {
        toast({
          title: "Error: Archivo demasiado grande",
          description: `El producto es demasiado grande (${payloadSizeMB}MB). Los videos en base64 ocupan mucho espacio. Considera usar videos más pequeños o eliminar algunos videos antes de guardar.`,
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      const response = await fetch(`/api/products?id=${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        // Actualizar el estado local con los datos devueltos del servidor
        setProduct(updatedProduct)
        setFormData({
          name: updatedProduct.name || "",
          slug: updatedProduct.slug || "",
          sku: updatedProduct.sku || "",
          description: updatedProduct.description || "",
          longDescription: updatedProduct.long_description || "",
          price: updatedProduct.price || 0,
          compareAt: updatedProduct.compareAt || 0,
          category: updatedProduct.category || "",
          sizes: updatedProduct.sizes || [],
          colors: updatedProduct.colors || [],
          tags: updatedProduct.tags || [],
          is_on_sale: updatedProduct.is_on_sale || false,
          sale_price: updatedProduct.sale_price || 0,
          sale_duration_days: updatedProduct.sale_duration_days || 7,
          stock: updatedProduct.stock || 0,
          featured: updatedProduct.featured || false,
          images: updatedProduct.images || [],
          videos: updatedProduct.videos || []
        })
        
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente",
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: "Error al actualizar el producto" }))
        
        if (response.status === 413) {
          toast({
            title: "Error: Archivo demasiado grande",
            description: errorData.details || "Los videos en base64 ocupan mucho espacio. Considera usar videos más pequeños o eliminar algunos videos antes de guardar.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: errorData.details || errorData.error || "No se pudo actualizar el producto",
            variant: "destructive",
          })
        }
        throw new Error(errorData.error || "Error al actualizar el producto")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addSize = () => {
    const newSize = prompt("Ingresa la nueva presentación:\n\nEjemplos:\n• Volumen: 30ml, 60ml, 100ml\n• Unidades: 30 unidades, 60 unidades, 90 unidades\n• Único: Único")
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }))
    }
  }

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const addMultipleSizes = (sizes: string[]) => {
    const newSizes = sizes.filter(size => !formData.sizes.includes(size))
    if (newSizes.length > 0) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, ...newSizes]
      }))
    }
  }

  const addColor = () => {
    const newColor = prompt("Ingresa el nuevo color/variante:\n\nEjemplos:\n• Natural, Relajante, Energizante\n• Equilibrio, Concentrado\n• Sabor Limón, Sabor Menta")
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }))
    }
  }

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }))
  }

  const addMultipleColors = (colors: string[]) => {
    const newColors = colors.filter(color => !formData.colors.includes(color))
    if (newColors.length > 0) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, ...newColors]
      }))
    }
  }

  const addTag = () => {
    const newTag = prompt("Ingresa la nueva etiqueta:\n\nEjemplos:\n• nuevo, destacado, en-oferta\n• bestseller, 100-natural\n• micronizado, certificado")
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addMultipleTags = (tags: string[]) => {
    const newTags = tags.filter(tag => !formData.tags.includes(tag))
    if (newTags.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...newTags]
      }))
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Cargando producto...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 shadow-sm bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link href="/admin/productos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Editar Producto</h1>
                <p className="text-sm text-gray-600">{product?.name}</p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-600/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>

      {/* Ayuda Rápida */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              💡 Consejos para editar más rápido:
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Usa los <strong>botones rápidos</strong> para presentaciones, variantes y etiquetas comunes</li>
                <li>Los <strong>placeholders</strong> muestran ejemplos de formato</li>
                <li>El <strong>SKU</strong> debe seguir el formato: NM-[CATEGORIA]-[NUMERO]</li>
                <li>Las <strong>etiquetas</strong> afectan la visibilidad y filtros del producto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Rompeviento Deportivo Premium Azul"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Ej: rompeviento-deportivo-premium-azul"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Ej: NM-ACE-001 (formato: NM-[CATEGORIA]-[NUMERO])"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Aceites">Aceites</option>
                    <option value="Tópicos">Tópicos</option>
                    <option value="Cápsulas">Cápsulas</option>
                    <option value="Gomitas">Gomitas</option>
                    <option value="Cremas">Cremas</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ej: Aceite micronizado 100% natural. Formulado para bienestar diario. Envase de vidrio oscuro para preservar propiedades."
                    className="bg-white border-gray-300 focus:border-purple-500"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="longDescription">Descripción Larga</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                    placeholder="Descripción detallada del producto, materiales, características especiales, cuidados, etc. Esta descripción aparecerá en la página del producto."
                    className="bg-white border-gray-300 focus:border-purple-500"
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Precios y Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="Ej: 45000 (sin puntos ni comas)"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="compareAt">Precio Anterior (Opcional)</Label>
                  <Input
                    id="compareAt"
                    type="number"
                    value={formData.compareAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, compareAt: Number(e.target.value) }))}
                    placeholder="Ej: 65000 (para mostrar descuento)"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    placeholder="Ej: 25 (cantidad disponible)"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Producto Destacado</Label>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="is_on_sale"
                      checked={formData.is_on_sale}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, is_on_sale: checked }))
                        if (checked && !formData.sale_start_date) {
                          const startDate = new Date().toISOString()
                          const endDate = new Date(Date.now() + (formData.sale_duration_days || 7) * 24 * 60 * 60 * 1000).toISOString()
                          setFormData(prev => ({ ...prev, sale_start_date: startDate, sale_end_date: endDate }))
                        }
                      }}
                    />
                    <Label htmlFor="is_on_sale" className="font-semibold text-orange-600">🔥 Producto en Oferta</Label>
                  </div>

                  {formData.is_on_sale && (
                    <>
                      <div className="mb-3">
                        <Label htmlFor="sale_price">Precio en Oferta</Label>
                        <Input
                          id="sale_price"
                          type="number"
                          value={formData.sale_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, sale_price: Number(e.target.value) }))}
                          placeholder="Ej: 35000 (precio rebajado)"
                          className="bg-white border-orange-300 focus:border-orange-500"
                        />
                        {formData.price && formData.sale_price && (
                          <p className="text-sm text-green-600 mt-1">
                            Descuento: {Math.round(((formData.price - formData.sale_price) / formData.price) * 100)}%
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="sale_duration_days">Duración de la Oferta (días)</Label>
                        <Input
                          id="sale_duration_days"
                          type="number"
                          value={formData.sale_duration_days}
                          onChange={(e) => {
                            const days = Number(e.target.value)
                            setFormData(prev => ({ 
                              ...prev, 
                              sale_duration_days: days,
                              sale_end_date: new Date(new Date(prev.sale_start_date || Date.now()).getTime() + days * 24 * 60 * 60 * 1000).toISOString()
                            }))
                          }}
                          placeholder="Ej: 7 (una semana)"
                          className="bg-white border-orange-300 focus:border-orange-500"
                        />
                        {formData.sale_end_date && (
                          <p className="text-sm text-gray-600 mt-1">
                            Finaliza: {new Date(formData.sale_end_date).toLocaleDateString('es-AR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Variants and Images */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Presentaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.sizes.map((size) => (
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
                
                {/* Botones rápidos para presentaciones comunes */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Presentaciones rápidas:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => addMultipleSizes(['30ml', '60ml', '100ml'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Volúmenes Comunes
                      </Button>
                      <Button 
                        onClick={() => addMultipleSizes(['30 unidades', '60 unidades', '90 unidades'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Unidades Comunes
                      </Button>
                      <Button 
                        onClick={() => addMultipleSizes(['Único'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Presentación Única
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={addSize} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Presentación Personalizada
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Colores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.colors.map((color) => (
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
                
                {/* Botones rápidos para colores comunes */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Colores rápidos:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => addMultipleColors(['Negro', 'Blanco', 'Gris'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Básicos
                      </Button>
                      <Button 
                        onClick={() => addMultipleColors(['Azul', 'Verde', 'Rojo', 'Rosa'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Colores
                      </Button>
                      <Button 
                        onClick={() => addMultipleColors(['Beige', 'Marrón', 'Azul Oscuro', 'Rosa Pastel'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Tonos
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={addColor} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Color Personalizado
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Etiquetas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1 pr-1">
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
                
                {/* Botones rápidos para etiquetas comunes */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Etiquetas rápidas:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => addMultipleTags(['nuevo', 'destacado'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Nuevo + Destacado
                      </Button>
                      <Button 
                        onClick={() => addMultipleTags(['en-oferta', 'drop-limitado'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        En Oferta
                      </Button>
                      <Button 
                        onClick={() => addMultipleTags(['bestseller', 'premium'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Bestseller
                      </Button>
                      <Button 
                        onClick={() => addMultipleTags(['deportivo', 'urbano'])} 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        Estilo
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={addTag} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Etiqueta Personalizada
                  </Button>
                </div>
              </CardContent>
            </Card>

            <MediaManager
              images={formData.images}
              videos={formData.videos}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              onVideosChange={(videos) => setFormData(prev => ({ ...prev, videos }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

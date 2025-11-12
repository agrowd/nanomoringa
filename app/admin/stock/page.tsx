"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Package, Save, Search } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

export default function StockManagementPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [bulkStock, setBulkStock] = useState("")
  const [stockChanges, setStockChanges] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadProducts()
  }, [isAuthenticated, router])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    } else {
      setSelectedProducts(new Set())
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts)
    if (checked) {
      newSelected.add(productId)
    } else {
      newSelected.delete(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleStockChange = (productId: string, value: string) => {
    const newChanges = new Map(stockChanges)
    const stockValue = parseInt(value)
    if (!isNaN(stockValue) && stockValue >= 0) {
      newChanges.set(productId, stockValue)
    } else {
      newChanges.delete(productId)
    }
    setStockChanges(newChanges)
  }

  const handleBulkUpdate = () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un producto",
        variant: "destructive",
      })
      return
    }

    const stockValue = parseInt(bulkStock)
    if (isNaN(stockValue) || stockValue < 0) {
      toast({
        title: "Error",
        description: "Ingresa un valor de stock válido",
        variant: "destructive",
      })
      return
    }

    const newChanges = new Map(stockChanges)
    selectedProducts.forEach(id => {
      newChanges.set(id, stockValue)
    })
    setStockChanges(newChanges)
    setBulkStock("")
    
    toast({
      title: "Cambios aplicados",
      description: `Stock de ${selectedProducts.size} productos actualizado a ${stockValue}`,
    })
  }

  const handleSaveChanges = async () => {
    if (stockChanges.size === 0) {
      toast({
        title: "No hay cambios",
        description: "No se detectaron cambios en el stock",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const updates = Array.from(stockChanges.entries()).map(([id, stock]) => ({
        id,
        stock
      }))

      const response = await fetch('/api/bulk-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      })

      if (response.ok) {
        const data = await response.json()
        
        toast({
          title: "¡Stock actualizado!",
          description: data.message,
        })

        // Limpiar cambios y recargar
        setStockChanges(new Map())
        setSelectedProducts(new Set())
        await loadProducts()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "No se pudo actualizar el stock",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar cambios",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getDisplayStock = (product: Product): number => {
    return stockChanges.get(product.id) ?? product.stock
  }

  const hasChanges = (productId: string): boolean => {
    return stockChanges.has(productId)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/productos">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Gestión de Stock</h1>
          <p className="text-gray-600">Actualiza el stock de múltiples productos al mismo tiempo</p>
        </div>

        {/* Controles de Búsqueda y Acciones Masivas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Buscar por nombre, ID o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Actualización Masiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  min="0"
                  className="flex-1"
                />
                <Button
                  onClick={handleBulkUpdate}
                  disabled={selectedProducts.size === 0 || !bulkStock}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Aplicar a Seleccionados ({selectedProducts.size})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        {stockChanges.size > 0 && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-900">
                    {stockChanges.size} productos con cambios pendientes
                  </p>
                  <p className="text-sm text-green-700">
                    Los cambios no se guardarán hasta que hagas click en "Guardar Cambios"
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStockChanges(new Map())}
                  >
                    Descartar
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla de Productos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              Selecciona productos y actualiza su stock individualmente o en masa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Cargando productos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            filteredProducts.length > 0 &&
                            selectedProducts.size === filteredProducts.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock Actual</TableHead>
                      <TableHead>Nuevo Stock</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className={hasChanges(product.id) ? 'bg-yellow-50' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.has(product.id)}
                            onCheckedChange={(checked) => 
                              handleSelectProduct(product.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                            {product.stock} unidades
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={stockChanges.get(product.id) ?? ''}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            placeholder={product.stock.toString()}
                            min="0"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          {hasChanges(product.id) && (
                            <Badge className="bg-yellow-500">
                              Modificado
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


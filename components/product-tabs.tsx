"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Descripción</TabsTrigger>
        <TabsTrigger value="details">Detalles</TabsTrigger>
        <TabsTrigger value="3d">Vista 3D</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <Card>
          <CardContent className="pt-6">
            <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold mb-1">Presentaciones disponibles</p>
                <p className="text-sm text-gray-700">{product.sizes.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Variantes disponibles</p>
                <p className="text-sm text-gray-700">{product.colors.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Stock</p>
                <p className="text-sm text-gray-700">{product.stock} unidades</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Categoría</p>
                <p className="text-sm text-gray-700">{product.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="3d">
        <Card>
          <CardContent className="pt-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-gray-900">Vista 3D (Próximamente)</p>
                <p className="text-sm text-gray-700 max-w-md">
                  Estamos preparando vista 3D a partir de tus fotos (v1.1). Pronto podrás ver el producto en 360°.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

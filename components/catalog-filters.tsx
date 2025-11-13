"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

const categories = [
  { value: "Aceites", label: "Aceites" },
  { value: "Tópicos", label: "Tópicos" },
  { value: "Cápsulas", label: "Cápsulas" },
  { value: "Gomitas", label: "Gomitas" },
  { value: "Cremas", label: "Cremas" },
  { value: "Otros", label: "Otros" },
]

const sizes = ["30ml", "60ml", "100ml", "30 unidades", "60 unidades", "90 unidades", "Único"]

const colors = ["Natural", "Relajante", "Energizante", "Equilibrio", "Concentrado"]

export function CatalogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 150000])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/catalogo?${params.toString()}`)
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(key)?.split(",").filter(Boolean) || []

    const index = current.indexOf(value)
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(value)
    }

    if (current.length > 0) {
      params.set(key, current.join(","))
    } else {
      params.delete(key)
    }

    router.push(`/catalogo?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/catalogo")
    setPriceRange([0, 150000])
  }

  const selectedCategories = searchParams.get("category")?.split(",") || []
  const selectedSizes = searchParams.get("size")?.split(",") || []
  const selectedColors = searchParams.get("color")?.split(",") || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort */}
          <div>
            <Label className="mb-2 block">Ordenar por</Label>
            <Select value={searchParams.get("sort") || ""} onValueChange={(value) => updateFilters("sort", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más nuevo</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div>
            <Label className="mb-3 block">Categoría</Label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat.value}`}
                    checked={selectedCategories.includes(cat.value)}
                    onCheckedChange={() => toggleArrayFilter("category", cat.value)}
                  />
                  <label htmlFor={`cat-${cat.value}`} className="text-sm cursor-pointer">
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label className="mb-3 block">Presentación</Label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("size", size)}
                  className={selectedSizes.includes(size) ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" : ""}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label className="mb-3 block">Color</Label>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => toggleArrayFilter("color", color)}
                  />
                  <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="mb-3 block">
              Rango de precio: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <Slider min={0} max={150000} step={5000} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                updateFilters("minPrice", priceRange[0].toString())
                updateFilters("maxPrice", priceRange[1].toString())
              }}
            >
              Aplicar rango
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

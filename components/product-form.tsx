"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MediaManager } from "@/components/media-manager"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      compareAt: undefined,
      category: "Aceites",
      sizes: [],
      colors: [],
      images: ["/placeholder.svg?height=800&width=600"],
      videos: [],
      tags: [],
      stock: 0,
      featured: false,
      createdAt: new Date().toISOString(),
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Product)
  }

  const toggleSize = (size: string) => {
    const sizes = formData.sizes || []
    if (sizes.includes(size)) {
      setFormData({ ...formData, sizes: sizes.filter((s) => s !== size) })
    } else {
      setFormData({ ...formData, sizes: [...sizes, size] })
    }
  }

  const toggleColor = (color: string) => {
    const colors = formData.colors || []
    if (colors.includes(color)) {
      setFormData({ ...formData, colors: colors.filter((c) => c !== color) })
    } else {
      setFormData({ ...formData, colors: [...colors, color] })
    }
  }

  const toggleTag = (tag: string) => {
    const tags = formData.tags || []
    if (tags.includes(tag)) {
      setFormData({ ...formData, tags: tags.filter((t) => t !== tag) })
    } else {
      setFormData({ ...formData, tags: [...tags, tag] })
    }
  }

  const allSizes = ["30ml", "60ml", "100ml", "30 unidades", "60 unidades", "90 unidades", "Único"]
  const allColors = ["Natural", "Relajante", "Energizante", "Equilibrio", "Concentrado"]
  const allTags = ["nuevo", "destacado", "en-oferta", "bestseller", "100-natural", "micronizado"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Nombre del producto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="producto-ejemplo"
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
            required
          />
        </div>

        <div>
          <Label htmlFor="compareAt">Precio comparación (opcional)</Label>
          <Input
            id="compareAt"
            type="number"
            step="0.01"
            value={formData.compareAt || ""}
            onChange={(e) =>
              setFormData({ ...formData, compareAt: e.target.value ? Number.parseFloat(e.target.value) : undefined })
            }
          />
        </div>

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aceites">Aceites</SelectItem>
              <SelectItem value="Tópicos">Tópicos</SelectItem>
              <SelectItem value="Cápsulas">Cápsulas</SelectItem>
              <SelectItem value="Gomitas">Gomitas</SelectItem>
              <SelectItem value="Cremas">Cremas</SelectItem>
              <SelectItem value="Otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Presentaciones</Label>
        <div className="grid grid-cols-4 gap-2">
          {allSizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={formData.sizes?.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSize(size)}
              className={formData.sizes?.includes(size) ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" : "bg-transparent"}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Variantes</Label>
        <div className="space-y-2">
          {allColors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={formData.colors?.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Etiquetas</Label>
        <div className="space-y-2">
          {allTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}`}
                checked={formData.tags?.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
        />
        <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
          Producto destacado
        </label>
      </div>

      <MediaManager
        images={formData.images || []}
        videos={formData.videos || []}
        onImagesChange={(images) => setFormData({ ...formData, images })}
        onVideosChange={(videos) => setFormData({ ...formData, videos })}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
          Guardar Producto
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent">
          Cancelar
        </Button>
      </div>
    </form>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, X } from "lucide-react"
import { useCart } from "@/lib/cart-store"

export function CartItems() {
  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const updateQuantity = useCart((state) => state.updateQuantity)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={`${item.id}-${item.variant.size}-${item.variant.color}`}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Link href={`/producto/${item.id}`} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/producto/${item.slug || item.id}`}>
                  <h3 className="font-semibold text-lg mb-1 truncate hover:text-purple-600 hover:underline cursor-pointer transition-colors">{item.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.variant.size} / {item.variant.color}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() =>
                        updateQuantity(item.id, item.variant.size, item.variant.color, Math.max(1, (Number(item.qty) || 1) - 1))
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{Number(item.qty) || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() =>
                        updateQuantity(item.id, item.variant.size, item.variant.color, (Number(item.qty) || 1) + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">${((item.price || 0) * (Number(item.qty) || 1)).toLocaleString('es-AR')}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.id, item.variant.size, item.variant.color)}
                      title="Eliminar del carrito"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

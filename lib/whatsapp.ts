import type { CartItem } from "./types"

export const buildWAUrl = (phone: string, text: string): string => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export const buildProductMessage = (productName: string, size: string, color: string, url: string): string => {
  return `Hola, consulto desde Nano Moringa 🌿

Producto:
• ${productName}
• Presentación: ${size}
• Variante: ${color}

Ver producto: ${url}`
}

export const buildCartMessage = (
  items: CartItem[],
  deliveryOption: "envio" | "retiro",
  note: string,
  url: string,
): string => {
  // Función para calcular de forma segura
  const safePrice = (price: number | undefined | null): number => {
    if (typeof price !== 'number' || isNaN(price)) return 0
    return price
  }
  
  const safeQty = (qty: number | undefined | null): number => {
    if (typeof qty !== 'number' || isNaN(qty)) return 1
    return qty
  }

  const itemsList = items
    .map((item) => {
      const price = safePrice(item.price)
      const qty = safeQty(item.qty)
      const total = price * qty
      
      // Generar URL específica del producto basada en el ID
      const productUrl = `${url.replace('/catalogo', '')}/producto/${item.id}`
      
      return `  • ${item.name} (${item.variant.size} / ${item.variant.color}) x${qty} = $${total.toLocaleString('es-AR')}
    ${productUrl}`
    })
    .join("\n\n")

  const subtotal = items.reduce((sum, item) => {
    const price = safePrice(item.price)
    const qty = safeQty(item.qty)
    return sum + (price * qty)
  }, 0)
  
  const shippingCost = 0 // Envío siempre GRATIS
  const total = subtotal + shippingCost

  return `Hola, consulto desde Nano Moringa 🌿

*MI PEDIDO:*
${itemsList}

*RESUMEN:*
Subtotal: $${subtotal.toLocaleString('es-AR')}
Envío: GRATIS
*TOTAL: $${total.toLocaleString('es-AR')}*

*ENTREGA:*
${deliveryOption === "envio" ? "Envío a domicilio - GRATIS a todo el país" : "Retiro personal - GRATIS"}
${deliveryOption === "retiro" ? "• Coordinamos lugar y horario" : ""}

${note ? `*Nota:* ${note}` : ""}

Ver productos: ${url}`
}

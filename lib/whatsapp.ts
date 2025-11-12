import type { CartItem } from "./types"

export const buildWAUrl = (phone: string, text: string): string => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export const buildProductMessage = (productName: string, size: string, color: string, url: string): string => {
  return `Hola, consulto desde Medicina Natural 🌿

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
  
  const shippingCost = deliveryOption === "envio" ? 10000 : 0
  const total = subtotal + shippingCost

  return `Hola, consulto desde Medicina Natural 🌿

*MI PEDIDO:*
${itemsList}

*RESUMEN:*
Subtotal: $${subtotal.toLocaleString('es-AR')}
${deliveryOption === "envio" ? "Envío (GBA): $10.000" : "Retiro personal: GRATIS"}
*TOTAL: $${total.toLocaleString('es-AR')}*

*ENTREGA:*
${deliveryOption === "envio" ? "Envío a domicilio" : "Retiro personal"}
${deliveryOption === "envio" ? "• GBA: $10.000" : ""}
${deliveryOption === "envio" ? "• Interior: $35.000" : ""}
${deliveryOption === "retiro" ? "• Coordinamos lugar y horario" : ""}

${note ? `*Nota:* ${note}` : ""}

Ver productos: ${url}`
}

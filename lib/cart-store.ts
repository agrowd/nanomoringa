"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./types"

interface AppliedCoupon {
  code: string
  name: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
}

interface CartData {
  items: CartItem[]
  appliedCoupon: AppliedCoupon | null
  timestamp: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  lastAddedItem: CartItem | null
  appliedCoupon: AppliedCoupon | null
  cartTimestamp: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getCouponDiscount: () => number
  getItemCount: () => number
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  clearLastAddedItem: () => void
  validateCartData: () => void
}

// Función para validar datos del carrito
const validateCartItem = (item: any): CartItem | null => {
  try {
    if (!item || typeof item !== 'object') return null
    
    // Validar campos requeridos
    if (!item.id || !item.name || !item.price || !item.variant) return null
    
    // Validar variant
    if (!item.variant.size || !item.variant.color) return null
    
    // Normalizar cantidad
    const qty = Number(item.qty) || 1
    if (qty <= 0 || qty > 100) return null // Límites razonables
    
    // Normalizar precio
    const price = Number(item.price) || 0
    if (price < 0 || price > 1000000) return null // Límites razonables
    
    return {
      id: String(item.id),
      name: String(item.name),
      price: price,
      qty: qty,
      image: item.image || "/placeholder.svg",
      variant: {
        size: String(item.variant.size),
        color: String(item.variant.color)
      }
    }
  } catch (error) {
    console.warn('[Cart Store] Error validating cart item:', error)
    return null
  }
}

// Función para validar cupón aplicado
const validateAppliedCoupon = (coupon: any): AppliedCoupon | null => {
  try {
    if (!coupon || typeof coupon !== 'object') return null
    
    if (!coupon.code || !coupon.name || !coupon.discountType || !coupon.discountValue) return null
    
    if (!['percentage', 'fixed'].includes(coupon.discountType)) return null
    
    const discountValue = Number(coupon.discountValue) || 0
    const minPurchase = Number(coupon.minPurchase) || 0
    
    if (discountValue <= 0 || discountValue > 1000000) return null
    if (minPurchase < 0 || minPurchase > 1000000) return null
    
    return {
      code: String(coupon.code),
      name: String(coupon.name),
      discountType: coupon.discountType,
      discountValue: discountValue,
      minPurchase: minPurchase
    }
  } catch (error) {
    console.warn('[Cart Store] Error validating applied coupon:', error)
    return null
  }
}

// TTL del carrito: 2 horas (en milisegundos)
const CART_TTL = 2 * 60 * 60 * 1000 // 2 horas

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedItem: null,
      appliedCoupon: null,
      cartTimestamp: Date.now(),
      addItem: (item) => {
        try {
          set((state) => {
            // Validar el item antes de agregarlo
            const validatedItem = validateCartItem(item)
            if (!validatedItem) {
              console.warn('[Cart Store] Invalid item, skipping add:', item)
              return state
            }
            
            const existingIndex = state.items.findIndex(
              (i) =>
                i.id === validatedItem.id &&
                i.variant.size === validatedItem.variant.size &&
                i.variant.color === validatedItem.variant.color,
            )

            let newItems
            if (existingIndex > -1) {
              newItems = [...state.items]
              newItems[existingIndex].qty = newItems[existingIndex].qty + validatedItem.qty
              // Límite máximo por producto
              if (newItems[existingIndex].qty > 10) {
                newItems[existingIndex].qty = 10
              }
            } else {
              newItems = [...state.items, validatedItem]
            }

            return { 
              items: newItems,
              lastAddedItem: validatedItem,
              cartTimestamp: Date.now(),
              isOpen: true // Auto-open cart when item is added
            }
          })
        } catch (error) {
          console.error('[Cart Store] Error adding item:', error)
        }
      },
      removeItem: (productId, size, color) => {
        try {
          set((state) => ({
            items: state.items.filter(
              (i) => !(i.id === productId && i.variant.size === size && i.variant.color === color),
            ),
            cartTimestamp: Date.now(),
          }))
        } catch (error) {
          console.error('[Cart Store] Error removing item:', error)
        }
      },
      updateQuantity: (productId, size, color, qty) => {
        try {
          const normalizedQty = Number(qty) || 1
          if (normalizedQty <= 0 || normalizedQty > 10) return // Límites razonables
          
          set((state) => ({
            items: state.items.map((i) =>
              i.id === productId && i.variant.size === size && i.variant.color === color 
                ? { ...i, qty: normalizedQty } 
                : i,
            ),
            cartTimestamp: Date.now(),
          }))
        } catch (error) {
          console.error('[Cart Store] Error updating quantity:', error)
        }
      },
      clearCart: () => set({ 
        items: [], 
        lastAddedItem: null, 
        appliedCoupon: null, 
        cartTimestamp: Date.now() 
      }),
      getSubtotal: () => {
        try {
          const { items } = get()
          return items.reduce((sum, item) => {
            const qty = Number(item.qty) || 1
            const price = Number(item.price) || 0
            return sum + (price * qty)
          }, 0)
        } catch (error) {
          console.error('[Cart Store] Error calculating subtotal:', error)
          return 0
        }
      },
      getCouponDiscount: () => {
        try {
          const { appliedCoupon } = get()
          if (!appliedCoupon) return 0
          
          const subtotal = get().getSubtotal()
          
          if (subtotal < appliedCoupon.minPurchase) return 0
          
          if (appliedCoupon.discountType === 'percentage') {
            return Math.round(subtotal * (appliedCoupon.discountValue / 100))
          } else {
            return Math.min(appliedCoupon.discountValue, subtotal)
          }
        } catch (error) {
          console.error('[Cart Store] Error calculating coupon discount:', error)
          return 0
        }
      },
      getTotal: () => {
        try {
          const subtotal = get().getSubtotal()
          const discount = get().getCouponDiscount()
          return Math.max(0, subtotal - discount)
        } catch (error) {
          console.error('[Cart Store] Error calculating total:', error)
          return 0
        }
      },
      getItemCount: () => {
        try {
          const { items } = get()
          return items.reduce((sum, item) => {
            const qty = Number(item.qty) || 1
            return sum + qty
          }, 0)
        } catch (error) {
          console.error('[Cart Store] Error calculating item count:', error)
          return 0
        }
      },
      applyCoupon: (coupon) => {
        try {
          const validatedCoupon = validateAppliedCoupon(coupon)
          if (validatedCoupon) {
            set({ appliedCoupon: validatedCoupon })
          }
        } catch (error) {
          console.error('[Cart Store] Error applying coupon:', error)
        }
      },
      removeCoupon: () => set({ appliedCoupon: null }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearLastAddedItem: () => set({ lastAddedItem: null }),
      validateCartData: () => {
        try {
          const state = get()
          const now = Date.now()
          
          // Verificar TTL del carrito
          if (now - state.cartTimestamp > CART_TTL) {
            console.log('[Cart Store] Cart expired, clearing...')
            set({ 
              items: [], 
              appliedCoupon: null, 
              cartTimestamp: now,
              lastAddedItem: null 
            })
            return
          }
          
          // Validar todos los items
          const validatedItems = state.items
            .map(item => validateCartItem(item))
            .filter((item): item is CartItem => item !== null)
          
          // Validar cupón aplicado
          const validatedCoupon = state.appliedCoupon 
            ? validateAppliedCoupon(state.appliedCoupon) 
            : null
          
          // Si hay diferencias, actualizar el estado
          if (validatedItems.length !== state.items.length || validatedCoupon !== state.appliedCoupon) {
            console.log('[Cart Store] Cart data corrupted, fixing...')
            set({
              items: validatedItems,
              appliedCoupon: validatedCoupon,
              cartTimestamp: now
            })
          }
        } catch (error) {
          console.error('[Cart Store] Error validating cart data:', error)
          // En caso de error crítico, limpiar todo
          set({ 
            items: [], 
            appliedCoupon: null, 
            cartTimestamp: Date.now(),
            lastAddedItem: null 
          })
        }
      },
    }),
    {
      name: "medicina-natural-cart",
      partialize: (state) => ({ 
        items: state.items, 
        appliedCoupon: state.appliedCoupon,
        cartTimestamp: state.cartTimestamp
      }),
      onRehydrateStorage: () => (state) => {
        // Validar datos al rehidratar desde localStorage
        if (state) {
          setTimeout(() => {
            state.validateCartData()
          }, 100) // Pequeño delay para asegurar que el store esté listo
        }
      },
    },
  ),
)

"use client"

import { useEffect, useCallback } from 'react'
import { useCart } from '@/lib/cart-store'

// Función para generar un session ID único
const generateSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('cart-session-id')
  if (!sessionId) {
    sessionId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('cart-session-id', sessionId)
  }
  return sessionId
}

export function useCartSync() {
  const { 
    items, 
    appliedCoupon, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart,
    applyCoupon,
    removeCoupon 
  } = useCart()

  // Sincronizar con la base de datos
  const syncToDatabase = useCallback(async () => {
    try {
      const sessionId = generateSessionId()
      if (!sessionId) return

      const response = await fetch('/api/cart-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items,
          appliedCoupon
        })
      })

      if (response.ok) {
        console.log('[Cart Sync] Successfully synced to database')
      }
    } catch (error) {
      console.error('[Cart Sync] Error syncing to database:', error)
    }
  }, [items, appliedCoupon])

  // Cargar desde la base de datos solo en la carga inicial
  const loadFromDatabase = useCallback(async () => {
    try {
      const sessionId = generateSessionId()
      if (!sessionId) return

      // Verificar si ya se cargó desde la DB en esta sesión
      const alreadyLoaded = sessionStorage.getItem('cart-loaded-from-db')
      if (alreadyLoaded) return

      const response = await fetch(`/api/cart-sync?sessionId=${sessionId}`)
      
      if (response.ok) {
        const data = await response.json()
        
        // Solo cargar si hay datos en la DB y el localStorage está vacío
        if (data.items && data.items.length > 0 && items.length === 0) {
          console.log('[Cart Sync] Loading from database:', data.items.length, 'items')
          
          // Limpiar carrito actual
          clearCart()
          
          // Cargar items desde la DB
          data.items.forEach((item: any) => {
            addItem(item)
          })
          
          // Cargar cupón aplicado si existe
          if (data.appliedCoupon) {
            applyCoupon(data.appliedCoupon)
          }

          // Marcar como cargado para esta sesión
          sessionStorage.setItem('cart-loaded-from-db', 'true')
        }
      }
    } catch (error) {
      console.error('[Cart Sync] Error loading from database:', error)
    }
  }, [items.length, clearCart, addItem, applyCoupon])

  // Sincronizar cuando cambie el carrito
  useEffect(() => {
    const timer = setTimeout(() => {
      if (items.length > 0 || appliedCoupon) {
        syncToDatabase()
      }
    }, 1000) // Debounce de 1 segundo

    return () => clearTimeout(timer)
  }, [items, appliedCoupon, syncToDatabase])

  // Cargar desde la DB al montar el componente
  useEffect(() => {
    loadFromDatabase()
  }, [loadFromDatabase])

  return {
    syncToDatabase,
    loadFromDatabase
  }
}

import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'retro_cart_v1'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, size, quantity = 1) {
    setItems((prev) => {
      const key = `${product.id}-${size}`
      const existing = prev.find((i) => `${i.id}-${i.size}` === key)
      const maxQty = product.stock ?? 99
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.size}` === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxQty) }
            : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          size,
          quantity: Math.min(quantity, maxQty),
          maxQty,
        },
      ]
    })
  }

  function removeItem(id, size) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))
  }

  function updateQuantity(id, size, quantity) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQty ?? 99)) }
          : i
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'retro_wishlist_v1'

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function toggle(product) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id)
      if (exists) return prev.filter((i) => i.id !== product.id)
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          stock: product.stock,
        },
      ]
    })
  }

  function isWishlisted(id) {
    return items.some((i) => i.id === id)
  }

  function remove(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, remove }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import StockBadge from './StockBadge'
import { useCart } from '../context/CartContext'
import { animateItemToCart } from '../lib/cartAnimations'

export default function ProductCard({ product }) {
  const { toggle, isWishlisted } = useWishlist()
  const { addItem } = useCart()
  const primary = product.images?.[0]?.url
  const secondary = product.images?.[1]?.url

  function handleQuickAdd(event) {
    event.preventDefault()
    if (product.stock <= 0) return
    addItem(product, product.sizes?.[0] || '', 1)
    animateItemToCart({ sourceElement: event.currentTarget.parentElement.querySelector('img'), imageSrc: primary })
  }

  return (
    <div className="group relative">
      <Link to={`/product/${product.slug}`} className="block focus-ring">
        <div className="relative aspect-[3/4] overflow-hidden bg-bone">
          {primary ? (
            <>
              <img
                src={primary}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {secondary && (
                <img
                  src={secondary}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-silver text-xs">No image</div>
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.new_arrival && (
              <span className="bg-ink text-mist text-[10px] tracking-widest2 px-2 py-1">NEW</span>
            )}
            {product.featured && (
              <span className="bg-mist text-ink text-[10px] tracking-widest2 px-2 py-1 border border-ink">FEATURED</span>
            )}
          </div>

        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-ink">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite">₹{Number(product.price).toFixed(0)}</span>
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={product.stock <= 0}
        className="mt-3 w-full border border-bone text-mist py-2.5 text-[10px] tracking-widest2 hover:bg-mist hover:text-ink disabled:opacity-40 focus-ring"
      >
        {product.stock > 0 ? 'QUICK ADD' : 'SOLD OUT'}
      </button>
      <button
        type="button"
        aria-label={`Toggle ${product.name} wishlist`}
        onClick={() => toggle(product)}
        className="absolute top-2 right-2 bg-mist/90 rounded-full p-2 focus-ring"
      >
        <Heart
          size={16}
          className={isWishlisted(product.id) ? 'fill-ink text-ink' : 'text-ink'}
        />
      </button>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import StockBadge from '../components/StockBadge'

export default function Wishlist() {
  const { items, remove } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl tracking-wide mb-3">YOUR WISHLIST IS EMPTY</h1>
        <Link to="/shop" className="text-xs tracking-widest2 border-b border-ink pb-0.5">BROWSE COLLECTION</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
      <h1 className="font-display text-4xl tracking-wide mb-8">YOUR WISHLIST</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border border-bone p-4">
            <Link to={`/product/${item.slug}`} className="w-20 h-24 bg-bone shrink-0 overflow-hidden">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            </Link>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <Link to={`/product/${item.slug}`} className="text-sm font-medium hover:underline">{item.name}</Link>
                <button onClick={() => remove(item.id)} className="text-graphite hover:text-ink focus-ring">
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">₹{Number(item.price).toFixed(0)}</span>
                <StockBadge stock={item.stock ?? 0} />
              </div>
              <Link
                to={`/product/${item.slug}`}
                className="mt-2 text-center border border-ink py-2 text-[11px] tracking-widest2 hover:bg-ink hover:text-mist transition-colors"
              >
                VIEW PRODUCT
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

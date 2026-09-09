import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { buildSingleProductMessage, whatsappLink } from '../lib/whatsapp'
import StockBadge from '../components/StockBadge'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('published', true).maybeSingle()
      setProduct(data)
      setActiveImg(0)
      setSize('')
      setQty(1)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 pt-32 pb-24"><div className="skeleton h-[60vh] w-full" /></div>
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl tracking-wide mb-3">PRODUCT NOT FOUND</h1>
        <Link to="/shop" className="text-xs tracking-widest2 border-b border-ink">BROWSE COLLECTION</Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [{ url: null }]
  const message = buildSingleProductMessage({
    name: product.name, size, quantity: qty, price: product.price,
  })

  function handleAddToCart() {
    if (product.sizes?.length && !size) return
    addItem(product, size, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] bg-bone overflow-hidden">
            {images[activeImg]?.url ? (
              <img src={images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-silver text-sm">No image available</div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-mist/80 rounded-full p-2 focus-ring"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-mist/80 rounded-full p-2 focus-ring"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 shrink-0 border ${activeImg === i ? 'border-ink' : 'border-transparent'}`}
                >
                  {img.url && <img src={img.url} alt="" className="w-full h-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs tracking-widest2 text-graphite mb-2">{product.category?.toUpperCase()}</p>
          <h1 className="font-display text-4xl tracking-wide mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">₹{Number(product.price).toFixed(0)}</span>
            <StockBadge stock={product.stock} />
          </div>

          {product.description && <p className="text-graphite text-sm leading-relaxed mb-6">{product.description}</p>}

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs tracking-widest2 text-graphite mb-2">SIZE</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-11 h-11 text-xs border focus-ring ${size === s ? 'bg-ink text-mist border-ink' : 'border-bone hover:border-ink'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xs tracking-widest2 text-graphite mb-2">QUANTITY</h3>
            <div className="flex items-center border border-bone w-fit">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 focus-ring">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                className="w-10 h-10 focus-ring"
                disabled={qty >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || (product.sizes?.length && !size)}
              className="bg-ink text-mist py-3.5 text-xs tracking-widest2 hover:bg-graphite transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
            >
              {added ? 'ADDED TO CART' : product.stock <= 0 ? 'SOLD OUT' : 'ADD TO CART'}
            </button>
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noreferrer"
              className="border border-ink py-3.5 text-xs tracking-widest2 text-center hover:bg-ink hover:text-mist transition-colors focus-ring"
            >
              ORDER ON WHATSAPP
            </a>
            <button
              onClick={() => toggle(product)}
              className="flex items-center justify-center gap-2 py-2 text-xs tracking-widest2 text-graphite hover:text-ink focus-ring"
            >
              <Heart size={14} className={isWishlisted(product.id) ? 'fill-ink text-ink' : ''} />
              {isWishlisted(product.id) ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
            </button>
          </div>

          {(product.sizes?.length || product.fabric || product.fit || product.care) && (
            <div className="mt-10 border-t border-bone pt-6 space-y-2 text-sm text-graphite">
              <h3 className="text-xs tracking-widest2 text-ink mb-3">ADDITIONAL INFORMATION</h3>
              {product.sizes?.length > 0 && <p>Available sizes: {product.sizes.join(', ')}</p>}
              {product.fit && <p>Fit: {product.fit}</p>}
              {product.fabric && <p>Fabric: {product.fabric}</p>}
              {product.care && <p>Care: {product.care}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

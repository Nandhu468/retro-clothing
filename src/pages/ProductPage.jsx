import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight, Ruler, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { buildSingleProductMessage, whatsappLink } from '../lib/whatsapp'
import StockBadge from '../components/StockBadge'
import { animateItemToCart } from '../lib/cartAnimations'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [shareStatus, setShareStatus] = useState('')
  const productImageRef = useRef(null)

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

  useEffect(() => {
    if (!product) return undefined

    document.title = `${product.name} | Retro Clothing`
    const description = document.querySelector('meta[name="description"]')
    if (description && product.description) description.setAttribute('content', product.description)

    try {
      const stored = JSON.parse(localStorage.getItem('retro_recent_products_v1') || '[]')
      const next = [product, ...stored.filter((item) => item.id !== product.id)].slice(0, 8)
      localStorage.setItem('retro_recent_products_v1', JSON.stringify(next))
      setRecentlyViewed(next.filter((item) => item.id !== product.id).slice(0, 4))
    } catch {
      setRecentlyViewed([])
    }

    let active = true
    async function loadRelatedProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('published', true)
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4)
      if (active) setRelatedProducts(data || [])
    }
    loadRelatedProducts()
    return () => { active = false }
  }, [product])

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
    animateItemToCart({
      sourceElement: productImageRef.current,
      imageSrc: images[activeImg]?.url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  async function handleShare() {
    const shareData = {
      title: `${product.name} | Retro Clothing`,
      text: `Take a look at ${product.name} from Retro Clothing.`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('LINK COPIED')
      window.setTimeout(() => setShareStatus(''), 1800)
    } catch {
      // A user can dismiss the native share sheet without an error state in the UI.
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] bg-bone overflow-hidden">
            {images[activeImg]?.url ? (
              <img ref={productImageRef} src={images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
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
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="text-xs tracking-widest2 text-graphite">SIZE</h3>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen((open) => !open)}
                  className="inline-flex min-h-8 items-center gap-1 text-[10px] tracking-widest2 text-graphite hover:text-ink focus-ring"
                  aria-expanded={sizeGuideOpen}
                >
                  <Ruler size={14} /> SIZE GUIDE
                </button>
              </div>
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
              {sizeGuideOpen && (
                <div className="mt-4 border border-bone p-4 text-sm text-graphite">
                  <p className="text-xs tracking-widest2 text-ink mb-3">GENERAL SIZE GUIDE</p>
                  <div className="grid grid-cols-3 gap-y-2 text-xs">
                    <span className="text-ink">SIZE</span><span className="text-ink">CHEST</span><span className="text-ink">FIT</span>
                    <span>S</span><span>36–38 in</span><span>Regular</span>
                    <span>M</span><span>38–40 in</span><span>Regular</span>
                    <span>L</span><span>40–42 in</span><span>Regular</span>
                    <span>XL</span><span>42–44 in</span><span>Regular</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed">Fit can vary by style. Message us on WhatsApp for exact garment measurements.</p>
                </div>
              )}
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
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2 text-xs tracking-widest2 text-graphite hover:text-ink focus-ring"
            >
              <Share2 size={14} /> {shareStatus || 'SHARE PRODUCT'}
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

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-bone pt-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-widest2 text-graphite mb-2">COMPLETE THE LOOK</p>
              <h2 className="font-display text-3xl tracking-wide">YOU MAY ALSO LIKE</h2>
            </div>
            <Link to={`/shop/${product.category}`} className="shrink-0 text-xs tracking-widest2 border-b border-ink pb-0.5 focus-ring">VIEW ALL</Link>
          </div>
          <ProductRail products={relatedProducts} />
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-16 border-t border-bone pt-10">
          <p className="text-xs tracking-widest2 text-graphite mb-2">PICK UP WHERE YOU LEFT OFF</p>
          <h2 className="font-display text-3xl tracking-wide mb-6">RECENTLY VIEWED</h2>
          <ProductRail products={recentlyViewed} />
        </section>
      )}
    </div>
  )
}

function ProductRail({ products }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
      {products.map((item) => (
        <div key={item.id} className="w-[min(58vw,230px)] shrink-0 snap-start md:w-auto">
          <Link to={`/product/${item.slug}`} className="block focus-ring">
            <div className="aspect-[3/4] bg-bone overflow-hidden">
              {item.images?.[0]?.url && <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />}
            </div>
            <p className="mt-3 text-sm font-medium text-ink truncate">{item.name}</p>
            <p className="mt-1 text-sm text-graphite">₹{Number(item.price).toFixed(0)}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}

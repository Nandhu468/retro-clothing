import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, Phone } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import ModernSpotlight from '../components/ModernSpotlight'

const categories = [
  { key: 'shirts', label: 'SHIRTS', desc: 'Classic cuts. Everyday presence.' },
  { key: 't-shirts', label: 'TEES', desc: 'Essential layers, considered.' },
  { key: 'pants', label: 'PANTS', desc: 'Built to complete the look.' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const [{ data: featuredData }, { data: newData }, { data: allData }] = await Promise.all([
        supabase.from('products').select('*').eq('published', true).eq('featured', true).limit(4),
        supabase.from('products').select('*').eq('published', true).eq('new_arrival', true).order('created_at', { ascending: false }).limit(8),
        supabase.from('products').select('*').eq('published', true).limit(50),
      ])
      if (!active) return
      setFeatured(featuredData || [])
      setNewArrivals(newData || [])
      setProducts(allData || [])
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  return <div>
    <section className="home-hero relative min-h-[100svh] sm:min-h-[640px] flex items-center overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20">
      {/* Background Image: shifted to the right so boutique racks and lighting are on the right */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/hero-desktop.jpg"
          alt="Retro Clothing store"
          className="home-hero-image w-full h-full object-cover object-[86%_center] sm:object-right lg:object-center"
          fetchpriority="high"
        />
      </div>

      {/* Deep fade from right to left (like PC home page):
          The left 50-55% is pure solid pitch-black to protect RETRO CLOTHING from any white shop background.
          It smoothly fades into the warm boutique shop on the right. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black from-0% via-black via-55% min-[550px]:via-black/92 min-[550px]:via-50% to-black/35 sm:from-black sm:via-black/90 sm:via-45% sm:to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/80 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 min-[380px]:px-6 sm:px-10 lg:px-12 flex flex-col items-start overflow-visible">
        <div className="animate-rise-1 w-full max-w-full overflow-visible">
          <ModernSpotlight />
        </div>
        <div className="animate-rise-2 mb-6 sm:mb-8">
          <p className="font-display text-mist text-2xl sm:text-4xl tracking-wider mb-1.5 font-bold">
            DEFINE YOUR STYLE
          </p>
          <p className="text-silver max-w-sm text-xs sm:text-base leading-relaxed">
            Luxury made affordable. Menswear with a timeless point of view.
          </p>
        </div>
        <div className="flex flex-row gap-2.5 sm:gap-4 animate-rise-3">
          <Link
            to="/shop"
            className="bg-mist text-ink px-4 min-[380px]:px-6 sm:px-7 py-3 sm:py-3.5 text-center text-[11px] sm:text-xs tracking-widest2 focus-ring shine-btn font-medium whitespace-nowrap"
          >
            SHOP COLLECTION
          </Link>
          <Link
            to="/new-arrivals"
            className="border border-mist text-mist px-4 min-[380px]:px-6 sm:px-7 py-3 sm:py-3.5 text-center text-[11px] sm:text-xs tracking-widest2 focus-ring hover:bg-mist/10 whitespace-nowrap"
          >
            NEW ARRIVALS
          </Link>
        </div>
      </div>
    </section>
    <Reveal as="section" className="px-4 sm:px-6 pb-24"><div className="max-w-7xl mx-auto"><div className="mb-7"><p className="section-index">01 / SHOP THE EDIT</p><h2 className="font-display text-4xl sm:text-5xl">SHOP BY CATEGORY</h2></div><div className="grid md:grid-cols-3 gap-3 sm:gap-4">{categories.map((category, index) => { const product = products.find((item) => item.category === category.key && item.images?.[0]?.url); return <Link key={category.key} to={`/shop/${category.key}`} className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden block focus-ring"><img src={product?.images?.[0]?.url || (index === 1 ? '/hero-mobile.jpg' : '/hero-desktop.jpg')} alt={category.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6"><h3 className="font-display text-mist text-4xl tracking-wide">{category.label}</h3><p className="text-silver text-sm mt-1 mb-3">{category.desc}</p><span className="text-mist text-xs tracking-widest2">EXPLORE →</span></div></Link> })}</div></div></Reveal>
    <ProductSection title="THE EDIT" eyebrow="02 / SELECTED PIECES" products={featured} loading={loading} />
    <ProductSection title="NEW ARRIVALS" eyebrow="03 / JUST IN" products={newArrivals} loading={loading} link="/new-arrivals" />
    <Reveal as="section" className="editorial-banner relative h-[65svh] min-h-[420px] flex items-center"><img src="/hero-desktop.jpg" alt="Retro Clothing editorial" className="editorial-image absolute inset-0 w-full h-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-black/55" /><div className="relative z-10 max-w-xl px-6 sm:px-10"><p className="text-xs tracking-widest2 text-silver mb-4">RETRO CLOTHING</p><h2 className="font-display text-mist text-6xl sm:text-7xl tracking-wide mb-4">WORN WITH INTENT</h2><p className="text-silver text-sm sm:text-base">A focused wardrobe of shirts, tees and pants—made for the everyday, styled your way.</p></div></Reveal>
    <section className="marquee-strip" aria-label="Retro Clothing brand values"><div>RETRO CLOTHING <span>•</span> DEFINE YOUR STYLE <span>•</span> LUXURY MADE AFFORDABLE <span>•</span> RETRO CLOTHING <span>•</span> DEFINE YOUR STYLE <span>•</span></div></section>
    <Reveal as="section" className="bg-charcoal text-mist py-20 px-6 text-center"><Instagram size={28} className="mx-auto mb-4 text-silver" /><h2 className="font-display text-4xl tracking-wide mb-2">FOLLOW THE RETRO</h2><p className="text-silver text-sm mb-6">The latest pieces, looks and store updates.</p><a href="https://www.instagram.com/retroclothing_.in/" target="_blank" rel="noreferrer" className="inline-block border border-mist px-7 py-3 text-xs tracking-widest2 focus-ring">@RETROCLOTHING_.IN</a></Reveal>
    <Reveal as="section" id="store" className="max-w-5xl mx-auto px-6 py-24 grid sm:grid-cols-2 gap-10 items-center scroll-mt-20"><div><p className="section-index">VISIT US</p><h2 className="font-display text-5xl tracking-wide mb-4">RETRO CLOTHING<br />TIRUNELVELI</h2><p className="text-graphite text-sm flex items-start gap-2 mb-7"><MapPin size={16} className="mt-0.5 shrink-0" />33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Town, Tirunelveli, Tamil Nadu – 627006</p><div className="flex flex-wrap gap-3"><a href="https://maps.app.goo.gl/86kZcDQkkMHZznqq7?g_st=ac" target="_blank" rel="noreferrer" className="bg-mist text-ink px-5 py-3 text-xs tracking-widest2">GET DIRECTIONS</a><a href="tel:7358274739" className="border border-white text-mist px-5 py-3 text-xs tracking-widest2 inline-flex items-center gap-2"><Phone size={13} /> CALL STORE</a><a href="https://wa.me/918610898158" target="_blank" rel="noreferrer" className="border border-white text-mist px-5 py-3 text-xs tracking-widest2">WHATSAPP</a></div></div><div className="relative aspect-[4/3] sm:aspect-square overflow-hidden border border-bone/40 bg-charcoal group"><img src="/hero-desktop.jpg" alt="Retro Clothing Boutique Tirunelveli" className="w-full h-full object-cover object-[75%_center] transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-xs tracking-widest2 text-mist flex items-center justify-between"><span>TIRUNELVELI TOWN</span><span className="text-silver">OPEN DAILY</span></div></div></Reveal>
  </div>
}

function ProductSection({ title, eyebrow, products, loading, link }) { return <Reveal as="section" className="collection-surface max-w-7xl mx-auto px-4 py-12 sm:px-8 sm:py-16 mb-24"><div className="flex items-end justify-between gap-4 mb-8"><div><p className="section-index">{eyebrow}</p><h2 className="font-display text-4xl">{title}</h2></div>{link && <Link to={link} className="text-xs tracking-widest2 text-mist border-b border-mist pb-1">VIEW ALL</Link>}</div>{loading ? <SkeletonGrid /> : products.length ? <div className="product-rail">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyRow text="No products yet." />}</Reveal> }
function SkeletonGrid() { return <div className="product-rail">{Array.from({ length: 4 }).map((_, i) => <div key={i}><div className="skeleton aspect-[3/4]" /><div className="skeleton h-3 w-3/4 mt-3" /></div>)}</div> }
export function EmptyRow({ text }) { return <p className="text-graphite text-sm py-10 text-center border border-dashed border-bone">{text}</p> }

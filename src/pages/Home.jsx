import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, Phone } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

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
    <MobileHero />
    <section className="home-hero relative h-[82svh] min-h-[520px] sm:h-[92vh] sm:min-h-[620px] flex items-end overflow-hidden">
      <picture className="absolute inset-0 w-full h-full"><source media="(max-width: 768px)" srcSet="/hero-mobile.jpg" /><img src="/hero-desktop.jpg" alt="Retro Clothing" className="home-hero-image w-full h-full object-cover" fetchPriority="high" /></picture>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-10 pb-16 sm:pb-24"><p className="text-silver text-xs tracking-widest2 mb-4 animate-rise-1">RETRO CLOTHING · TIRUNELVELI</p><h1 className="font-display text-mist text-6xl min-[375px]:text-7xl sm:text-9xl leading-[.82] tracking-wide mb-6 animate-rise-2">DEFINE<br />YOUR STYLE.</h1><p className="text-silver max-w-sm mb-8 text-sm sm:text-base animate-rise-3">Luxury made affordable. Menswear with a timeless point of view.</p><div className="flex flex-col min-[375px]:flex-row gap-3 animate-rise-4"><Link to="/shop" className="bg-mist text-ink px-6 py-3.5 text-center text-xs tracking-widest2 focus-ring shine-btn">SHOP COLLECTION</Link><Link to="/new-arrivals" className="border border-mist text-mist px-6 py-3.5 text-center text-xs tracking-widest2 focus-ring">NEW ARRIVALS</Link></div></div>
    </section>
    <Reveal as="section" className="max-w-5xl mx-auto text-center px-6 py-24 sm:py-32"><p className="text-xs tracking-widest2 text-graphite mb-4">EST. 2026 · TIRUNELVELI</p><h2 className="font-display text-5xl sm:text-7xl tracking-wide mb-6">CLASSIC IS<br />TIMELESS.</h2><p className="text-graphite leading-relaxed max-w-xl mx-auto">RETRO CLOTHING is a men&apos;s fashion store by Balaji and Surya Perumal. Discover shirts, tees and pants selected for your individual style.</p></Reveal>
    <Reveal as="section" className="px-4 sm:px-6 pb-24"><div className="max-w-7xl mx-auto"><div className="mb-7"><p className="section-index">01 / SHOP THE EDIT</p><h2 className="font-display text-4xl sm:text-5xl">SHOP BY CATEGORY</h2></div><div className="grid md:grid-cols-3 gap-3 sm:gap-4">{categories.map((category, index) => { const product = products.find((item) => item.category === category.key && item.images?.[0]?.url); return <Link key={category.key} to={`/shop/${category.key}`} className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden block focus-ring"><img src={product?.images?.[0]?.url || (index === 1 ? '/hero-mobile.jpg' : '/hero-desktop.jpg')} alt={category.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6"><h3 className="font-display text-mist text-4xl tracking-wide">{category.label}</h3><p className="text-silver text-sm mt-1 mb-3">{category.desc}</p><span className="text-mist text-xs tracking-widest2">EXPLORE →</span></div></Link> })}</div></div></Reveal>
    <ProductSection title="THE EDIT" eyebrow="02 / SELECTED PIECES" products={featured} loading={loading} />
    <ProductSection title="NEW ARRIVALS" eyebrow="03 / JUST IN" products={newArrivals} loading={loading} link="/new-arrivals" />
    <Reveal as="section" className="editorial-banner relative h-[65svh] min-h-[420px] flex items-center"><img src="/hero-desktop.jpg" alt="Retro Clothing editorial" className="editorial-image absolute inset-0 w-full h-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-black/55" /><div className="relative z-10 max-w-xl px-6 sm:px-10"><p className="text-xs tracking-widest2 text-silver mb-4">RETRO CLOTHING</p><h2 className="font-display text-mist text-6xl sm:text-7xl tracking-wide mb-4">WORN WITH INTENT</h2><p className="text-silver text-sm sm:text-base">A focused wardrobe of shirts, tees and pants—made for the everyday, styled your way.</p></div></Reveal>
    <section className="marquee-strip" aria-label="Retro Clothing brand values"><div>RETRO CLOTHING <span>•</span> DEFINE YOUR STYLE <span>•</span> LUXURY MADE AFFORDABLE <span>•</span> RETRO CLOTHING <span>•</span> DEFINE YOUR STYLE <span>•</span></div></section>
    <Reveal as="section" className="bg-charcoal text-mist py-20 px-6 text-center"><Instagram size={28} className="mx-auto mb-4 text-silver" /><h2 className="font-display text-4xl tracking-wide mb-2">FOLLOW THE RETRO</h2><p className="text-silver text-sm mb-6">The latest pieces, looks and store updates.</p><a href="https://www.instagram.com/retroclothing_.in/" target="_blank" rel="noreferrer" className="inline-block border border-mist px-7 py-3 text-xs tracking-widest2 focus-ring">@RETROCLOTHING_.IN</a></Reveal>
    <Reveal as="section" id="store" className="max-w-5xl mx-auto px-6 py-24 grid sm:grid-cols-2 gap-10 items-center scroll-mt-20"><div><p className="section-index">VISIT US</p><h2 className="font-display text-5xl tracking-wide mb-4">RETRO CLOTHING<br />TIRUNELVELI</h2><p className="text-graphite text-sm flex items-start gap-2 mb-7"><MapPin size={16} className="mt-0.5 shrink-0" />33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Town, Tirunelveli, Tamil Nadu – 627006</p><div className="flex flex-wrap gap-3"><a href="https://maps.app.goo.gl/86kZcDQkkMHZznqq7?g_st=ac" target="_blank" rel="noreferrer" className="bg-mist text-ink px-5 py-3 text-xs tracking-widest2">GET DIRECTIONS</a><a href="tel:7358274739" className="border border-white text-mist px-5 py-3 text-xs tracking-widest2 inline-flex items-center gap-2"><Phone size={13} /> CALL STORE</a><a href="https://wa.me/918667873216" target="_blank" rel="noreferrer" className="border border-white text-mist px-5 py-3 text-xs tracking-widest2">WHATSAPP</a></div></div><FlickerWordmark /></Reveal>
  </div>
}

function MobileHero() {
  return <section className="mobile-hero relative min-h-[calc(100svh-42px)] overflow-hidden px-5 pt-24 pb-8">
    <p className="relative z-10 text-silver text-[10px] tracking-widest2 mobile-hero-copy">RETRO CLOTHING / TIRUNELVELI</p>
    <h1 className="relative z-10 font-display text-mist text-[clamp(4.25rem,19vw,6.4rem)] leading-[.78] tracking-wide mt-4 mobile-hero-copy mobile-hero-copy-title">DEFINE<br />YOUR STYLE.</h1>
    <div className="mobile-hero-stage" aria-hidden="true"><div className="mobile-hero-card"><img src="/hero-mobile.jpg" alt="" fetchPriority="high" /></div></div>
    <p className="relative z-10 text-silver max-w-[17rem] mt-6 text-sm mobile-hero-copy">Luxury made affordable. Menswear with a timeless point of view.</p>
    <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 mobile-hero-copy"><Link to="/shop" className="bg-mist text-ink px-3 py-3.5 text-center text-[10px] tracking-widest2 focus-ring">SHOP</Link><Link to="/new-arrivals" className="border border-mist text-mist px-3 py-3.5 text-center text-[10px] tracking-widest2 focus-ring">NEW IN</Link></div>
  </section>
}

function FlickerWordmark() {
  return <div className="flicker-wordmark" aria-label="Retro Clothing"><span aria-hidden="true">RETRO<br />CLOTHING</span></div>
}

function ProductSection({ title, eyebrow, products, loading, link }) { return <Reveal as="section" className="collection-surface max-w-7xl mx-auto px-4 py-12 sm:px-8 sm:py-16 mb-24"><div className="flex items-end justify-between gap-4 mb-8"><div><p className="section-index">{eyebrow}</p><h2 className="font-display text-4xl">{title}</h2></div>{link && <Link to={link} className="text-xs tracking-widest2 text-mist border-b border-mist pb-1">VIEW ALL</Link>}</div>{loading ? <SkeletonGrid /> : products.length ? <div className="product-rail">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyRow text="No products yet." />}</Reveal> }
function SkeletonGrid() { return <div className="product-rail">{Array.from({ length: 4 }).map((_, i) => <div key={i}><div className="skeleton aspect-[3/4]" /><div className="skeleton h-3 w-3/4 mt-3" /></div>)}</div> }
export function EmptyRow({ text }) { return <p className="text-graphite text-sm py-10 text-center border border-dashed border-bone">{text}</p> }

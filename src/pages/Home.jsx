import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import { Instagram, MapPin, Phone } from 'lucide-react'
import Reveal from '../components/Reveal'

const categories = [
  { key: 'shirts', label: 'SHIRTS', desc: 'Tailored fits built for every occasion.', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop' },
  { key: 't-shirts', label: 'T-SHIRTS', desc: 'Everyday essentials, elevated.', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop' },
  { key: 'pants', label: 'PANTS', desc: 'Structured comfort from day to night.', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: f }, { data: n }] = await Promise.all([
        supabase.from('products').select('*').eq('published', true).eq('featured', true).limit(4),
        supabase.from('products').select('*').eq('published', true).eq('new_arrival', true).order('created_at', { ascending: false }).limit(8),
      ])
      setFeatured(f || [])
      setNewArrivals(n || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[500px] sm:h-[92vh] sm:min-h-[560px] flex items-end overflow-hidden">
        <picture className="absolute inset-0 w-full h-full">
          <source media="(max-width: 768px)" srcSet="/hero-mobile.jpg" />
          <img
            src="/hero-desktop.jpg"
            alt="Retro Clothing"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 pb-20 sm:pb-24">
                   <p className="text-silver text-xs tracking-widest2 mb-4 animate-rise-1">RETRO CLOTHING</p>
          <h1 className="font-display text-mist text-6xl sm:text-8xl leading-[0.95] tracking-wide mb-6 animate-rise-2">
            DEFINE<br />YOUR STYLE.
          </h1>
          <p className="text-silver max-w-md mb-8 text-sm sm:text-base animate-rise-3">
            Modern men's fashion designed for confidence, comfort and individuality.
          </p>
          <div className="flex flex-wrap gap-4 animate-rise-4">
                        <Link to="/shop" className="bg-mist text-ink px-7 py-3 text-xs tracking-widest2 hover:bg-silver transition-colors duration-250 focus-ring shine-btn">
              SHOP COLLECTION
            </Link>
          <Link to="/new-arrivals" className="border border-mist text-mist px-7 py-3 text-xs tracking-widest2 hover:bg-mist hover:text-ink transition-colors duration-250 focus-ring shine-btn">
  NEW ARRIVALS
</Link>
          </div>
        </div>
      </section>

      {/* BRAND INTRO */}
      <Reveal as="section" className="max-w-3xl mx-auto text-center px-6 py-24">
        <p className="text-xs tracking-widest2 text-graphite mb-4">EST. 2026 · TIRUNELVELI</p>
        <h2 className="font-display text-4xl sm:text-5xl tracking-wide mb-6">MINIMAL LUXURY, WORN DAILY</h2>
        <p className="text-graphite leading-relaxed">
          Retro Clothing is a men's fashion label built on restraint — clean silhouettes, considered
          fabrics and a black-and-off-white palette that lets the wearer, not the logo, do the talking.
        </p>
      </Reveal>

      {/* CATEGORY SHOWCASE */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link key={c.key} to={`/shop/${c.key}`} className="group relative aspect-[3/4] overflow-hidden block focus-ring">
              <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
              <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/55 transition-colors duration-400" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-display text-mist text-3xl tracking-wide">{c.label}</h3>
                <p className="text-silver text-sm mt-1 mb-3">{c.desc}</p>
                <span className="text-mist text-xs tracking-widest2 inline-flex items-center gap-2">
                  EXPLORE <span className="transition-transform duration-250 group-hover:translate-x-1">›</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl tracking-wide">THE EDIT</h2>
            <p className="text-graphite text-sm mt-1">Pieces selected for your everyday rotation.</p>
          </div>
        </div>
        {loading ? (
          <SkeletonGrid />
        ) : featured.length === 0 ? (
          <EmptyRow text="No featured products yet." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl tracking-wide">NEW ARRIVALS</h2>
          <Link to="/new-arrivals" className="text-xs tracking-widest2 border-b border-ink pb-0.5 hover:opacity-60">
            VIEW ALL
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid />
        ) : newArrivals.length === 0 ? (
          <EmptyRow text="No new arrivals yet." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative h-[70vh] min-h-[420px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1800&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 max-w-xl px-6 sm:px-10">
          <h2 className="font-display text-mist text-5xl tracking-wide mb-4">WORN WITH INTENT</h2>
          <p className="text-silver text-sm sm:text-base">
            Every piece is chosen for how it moves, fits and lasts — fashion built for real days, not just photos.
          </p>
        </div>
      </section>

      {/* BRAND PHILOSOPHY */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <h2 className="font-display text-4xl tracking-wide mb-6">LESS, BUT BETTER</h2>
        <p className="text-graphite leading-relaxed">
          We'd rather make one shirt well than ten shirts fast. Retro Clothing exists for men who
          want their wardrobe to feel deliberate — a small, confident collection instead of endless noise.
        </p>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-charcoal text-mist py-20 px-6 text-center">
        <Instagram size={28} className="mx-auto mb-4 text-silver" />
        <h2 className="font-display text-3xl tracking-wide mb-2">FOLLOW THE RETRO</h2>
        <p className="text-silver text-sm mb-6">Discover the latest from Retro Clothing.</p>
        <a
  href="https://www.instagram.com/retroclothing_.in?stkn=Z2Vndnh0dXhyb3Rl"
  target="_blank"
  rel="noreferrer"
  className="inline-block border border-mist px-7 py-3 text-xs tracking-widest2 hover:bg-mist hover:text-ink transition-colors duration-250 focus-ring"
>
  @RETROCLOTHING_.IN
</a>
      </section>

      {/* STORE */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid sm:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-display text-4xl tracking-wide mb-4">VISIT THE STORE</h2>
          <p className="text-graphite text-sm flex items-start gap-2 mb-6">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Tirunelveli, Tamil Nadu – 627006
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://maps.app.goo.gl/86kZcDQkkMHZznqq7?g_st=ac" target="_blank" rel="noreferrer" className="bg-ink text-mist px-5 py-2.5 text-xs tracking-widest2 hover:bg-graphite transition-colors">
              GET DIRECTIONS
            </a>
            <a href="tel:7358274739" className="border border-ink px-5 py-2.5 text-xs tracking-widest2 hover:bg-ink hover:text-mist transition-colors inline-flex items-center gap-2">
              <Phone size={13} /> CALL STORE
            </a>
          </div>
        </div>
        <div className="aspect-video bg-bone overflow-hidden">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop" alt="Store" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="bg-ink text-mist text-center py-16 px-6">
        <h2 className="font-display text-3xl tracking-wide mb-3">ORDER DIRECTLY ON WHATSAPP</h2>
        <p className="text-silver text-sm mb-6">No accounts, no hassle — just message us your size and we'll confirm.</p>
        <a
  href="https://wa.me/918667873216"
  target="_blank"
  rel="noreferrer"
  className="inline-block bg-mist text-ink px-7 py-3 text-xs tracking-widest2 hover:bg-silver transition-colors focus-ring shine-btn"
>
  MESSAGE US
</a>
      </section>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[3/4]" />
          <div className="skeleton h-3 w-3/4 mt-3" />
          <div className="skeleton h-3 w-1/3 mt-2" />
        </div>
      ))}
    </div>
  )
}

export function EmptyRow({ text }) {
  return <p className="text-graphite text-sm py-10 text-center border border-dashed border-bone">{text}</p>
}
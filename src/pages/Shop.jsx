import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import { EmptyRow } from './Home'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function Shop() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  const [sizeFilter, setSizeFilter] = useState([])
  const [availOnly, setAvailOnly] = useState(false)
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase.from('products').select('*').eq('published', true)
      if (category) query = query.eq('category', category)
      if (q) query = query.textSearch('search_vector', q, { type: 'websearch' })
      const { data } = await query
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [category, q])

  const filtered = useMemo(() => {
    let list = [...products]
    if (sizeFilter.length) {
      list = list.filter((p) => (p.sizes || []).some((s) => sizeFilter.includes(s)))
    }
    if (availOnly) list = list.filter((p) => p.stock > 0)

    switch (sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return list
  }, [products, sizeFilter, availOnly, sort])

  const title = category ? category.replace('-', ' ').toUpperCase() : q ? `RESULTS FOR "${q}"` : 'SHOP ALL'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24">
      <div className="flex items-end justify-between mb-8">
        <h1 className="font-display text-4xl sm:text-5xl tracking-wide">{title}</h1>
        <button
          onClick={() => setFilterOpen(true)}
          className="md:hidden flex items-center gap-2 text-xs tracking-widest2 text-white border border-white px-4 py-2 focus-ring"
        >
          <SlidersHorizontal size={14} /> FILTER
        </button>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        {/* Desktop filter sidebar */}
        <aside className="hidden md:block">
          <FilterPanel
            sizeFilter={sizeFilter} setSizeFilter={setSizeFilter}
            availOnly={availOnly} setAvailOnly={setAvailOnly}
            sort={sort} setSort={setSort}
          />
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}><div className="skeleton aspect-[3/4]" /></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyRow text={q ? 'NOTHING MATCHED YOUR SEARCH.' : 'NO PRODUCTS YET'} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-mist rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-wide">FILTERS</h2>
              <button onClick={() => setFilterOpen(false)} className="focus-ring"><X size={22} /></button>
            </div>
            <FilterPanel
              sizeFilter={sizeFilter} setSizeFilter={setSizeFilter}
              availOnly={availOnly} setAvailOnly={setAvailOnly}
              sort={sort} setSort={setSort}
            />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full bg-ink text-mist py-3 text-xs tracking-widest2"
            >
              SHOW {filtered.length} RESULTS
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterPanel({ sizeFilter, setSizeFilter, availOnly, setAvailOnly, sort, setSort }) {
  function toggleSize(s) {
    setSizeFilter((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs tracking-widest2 text-graphite mb-3">SORT BY</h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border border-bone px-3 py-2 text-sm bg-mist focus-ring"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div>
        <h3 className="text-xs tracking-widest2 text-graphite mb-3">SIZE</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`w-10 h-10 text-xs border focus-ring ${
                sizeFilter.includes(s) ? 'bg-ink text-mist border-ink' : 'border-bone hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={availOnly} onChange={(e) => setAvailOnly(e.target.checked)} className="accent-ink" />
        In stock only
      </label>
    </div>
  )
}

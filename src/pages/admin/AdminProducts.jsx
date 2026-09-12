import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, Edit } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = [...products]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (stockFilter === 'low') list = list.filter((p) => p.stock > 0 && p.stock <= 5)
    if (stockFilter === 'out') list = list.filter((p) => p.stock === 0)
    if (stockFilter === 'featured') list = list.filter((p) => p.featured)
    if (stockFilter === 'new') list = list.filter((p) => p.new_arrival)
    if (stockFilter === 'unpublished') list = list.filter((p) => !p.published)

    switch (sort) {
      case 'oldest': list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break
      case 'price': list.sort((a, b) => a.price - b.price); break
      case 'stock': list.sort((a, b) => a.stock - b.stock); break
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    return list
  }, [products, query, category, stockFilter, sort])

  async function handleDelete(product) {
    setDeleting(true)
    // Clean up storage objects for this product's images
    const paths = (product.images || []).map((img) => img.path).filter(Boolean)
    if (paths.length) {
      await supabase.storage.from('product-images').remove(paths)
    }
    await supabase.from('products').delete().eq('id', product.id)
    setConfirmId(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl tracking-wide">PRODUCTS</h1>
        <Link to="/admin/products/new" className="bg-ink text-mist px-4 py-2 text-xs tracking-widest2">ADD PRODUCT</Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center border border-bone bg-white px-3 flex-1 min-w-[180px]">
          <Search size={14} className="text-graphite" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="px-2 py-2 text-sm flex-1 outline-none" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-bone bg-white px-3 py-2 text-sm">
          <option value="all">All Categories</option>
          <option value="shirts">Shirts</option>
          <option value="t-shirts">T-Shirts</option>
          <option value="pants">Pants</option>
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="border border-bone bg-white px-3 py-2 text-sm">
          <option value="all">All Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="featured">Featured</option>
          <option value="new">New Arrival</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-bone bg-white px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price">Price</option>
          <option value="stock">Stock</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="border border-dashed border-bone p-10 text-center text-graphite text-sm">NO PRODUCTS FOUND</p>
      ) : (
        <>
          {/* Table - desktop */}
          <div className="hidden md:block border border-bone bg-white">
            <div className="grid grid-cols-[auto_1fr_100px_90px_100px_100px] gap-4 px-4 py-3 text-[11px] tracking-widest2 text-graphite border-b border-bone">
              <span></span><span>NAME</span><span>PRICE</span><span>STOCK</span><span>STATUS</span><span>ACTIONS</span>
            </div>
            {filtered.map((p) => (
              <div key={p.id} className="grid grid-cols-[auto_1fr_100px_90px_100px_100px] gap-4 px-4 py-3 items-center border-b border-bone last:border-0 text-sm">
                <div className="w-10 h-12 bg-bone overflow-hidden">
                  {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                </div>
                <span className="truncate">{p.name}{!p.published && <span className="ml-2 text-[10px] text-amber-700">(unpublished)</span>}</span>
                <span>₹{Number(p.price).toFixed(0)}</span>
                <span className={p.stock === 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-700' : ''}>{p.stock}</span>
                <span className="text-graphite">{p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? 'Low stock' : 'In stock'}</span>
                <div className="flex gap-3">
                  <Link to={`/admin/products/${p.id}/edit`} className="text-graphite hover:text-ink"><Edit size={15} /></Link>
                  <button onClick={() => setConfirmId(p.id)} className="text-graphite hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Cards - mobile */}
          <div className="md:hidden space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="border border-bone bg-white p-3 flex gap-3">
                <div className="w-14 h-16 bg-bone overflow-hidden shrink-0">
                  {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-graphite">₹{Number(p.price).toFixed(0)} · Stock: {p.stock}</p>
                  <div className="flex gap-4 mt-2">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-xs tracking-widest2 border-b border-ink">EDIT</Link>
                    <button onClick={() => setConfirmId(p.id)} className="text-xs tracking-widest2 text-red-600 border-b border-red-600">DELETE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {confirmId && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center px-6">
          <div className="bg-white p-6 max-w-sm w-full">
            <h3 className="font-display text-xl tracking-wide mb-2">DELETE PRODUCT?</h3>
            <p className="text-sm text-graphite mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 border border-ink py-2.5 text-xs tracking-widest2">CANCEL</button>
              <button
                disabled={deleting}
                onClick={() => handleDelete(products.find((p) => p.id === confirmId))}
                className="flex-1 bg-red-600 text-white py-2.5 text-xs tracking-widest2 disabled:opacity-50"
              >
                {deleting ? 'DELETING…' : 'DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

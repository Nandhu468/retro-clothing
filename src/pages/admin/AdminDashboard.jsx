import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: all } = await supabase.from('products').select('id, stock, featured, new_arrival, name, updated_at, created_at').order('created_at', { ascending: false })
      const list = all || []
      setStats({
        total: list.length,
        newArrival: list.filter((p) => p.new_arrival).length,
        featured: list.filter((p) => p.featured).length,
        lowStock: list.filter((p) => p.stock > 0 && p.stock <= 5).length,
        outOfStock: list.filter((p) => p.stock === 0).length,
      })
      setRecent(list.slice(0, 5))
      setLowStock(list.filter((p) => p.stock <= 5).slice(0, 5))
      setLoading(false)
    }
    load()
  }, [])

  const cards = stats
    ? [
        { label: 'TOTAL PRODUCTS', value: stats.total },
        { label: 'NEW ARRIVALS', value: stats.newArrival },
        { label: 'FEATURED', value: stats.featured },
        { label: 'LOW STOCK', value: stats.lowStock },
        { label: 'OUT OF STOCK', value: stats.outOfStock },
      ]
    : []

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide mb-6">DASHBOARD</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24" />)
          : cards.map((c) => (
              <div key={c.label} className="bg-white border border-bone p-4">
                <p className="text-[10px] tracking-widest2 text-graphite mb-2">{c.label}</p>
                <p className="text-3xl font-display">{c.value}</p>
              </div>
            ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link to="/admin/products/new" className="bg-ink text-mist px-5 py-2.5 text-xs tracking-widest2">ADD PRODUCT</Link>
        <Link to="/admin/products" className="border border-ink px-5 py-2.5 text-xs tracking-widest2">MANAGE PRODUCTS</Link>
        <Link to="/admin/stock" className="border border-ink px-5 py-2.5 text-xs tracking-widest2">UPDATE STOCK</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xs tracking-widest2 text-graphite mb-3">RECENT PRODUCTS</h2>
          <div className="border border-bone divide-y divide-bone bg-white">
            {recent.length === 0 && <p className="p-4 text-sm text-graphite">No products found</p>}
            {recent.map((p) => (
              <Link key={p.id} to={`/admin/products/${p.id}/edit`} className="flex justify-between px-4 py-3 text-sm hover:bg-mist">
                <span>{p.name}</span>
                <span className="text-graphite">Stock: {p.stock}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs tracking-widest2 text-graphite mb-3">LOW STOCK</h2>
          <div className="border border-bone divide-y divide-bone bg-white">
            {lowStock.length === 0 && <p className="p-4 text-sm text-graphite">Nothing running low</p>}
            {lowStock.map((p) => (
              <Link key={p.id} to={`/admin/products/${p.id}/edit`} className="flex justify-between px-4 py-3 text-sm hover:bg-mist">
                <span>{p.name}</span>
                <span className={p.stock === 0 ? 'text-red-600' : 'text-amber-700'}>{p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} left`}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

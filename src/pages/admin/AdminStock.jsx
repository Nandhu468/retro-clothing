import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStock(product, newStock) {
    const clamped = Math.max(0, newStock)
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: clamped } : p)))
    setSavingId(product.id)
    await supabase.from('products').update({ stock: clamped }).eq('id', product.id)
    setSavingId(null)
  }

  function statusFor(stock) {
    if (stock === 0) return { label: 'OUT OF STOCK', className: 'text-red-600' }
    if (stock <= 5) return { label: 'LOW STOCK', className: 'text-amber-700' }
    return { label: 'IN STOCK', className: 'text-green-700' }
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide mb-6">STOCK MANAGEMENT</h1>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>
      ) : (
        <div className="border border-bone bg-white divide-y divide-bone">
          {products.map((p) => {
            const status = statusFor(p.stock)
            return (
              <div key={p.id} className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-[160px]">
                  <div className="w-10 h-12 bg-bone overflow-hidden shrink-0">
                    {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-sm">{p.name}</span>
                </div>
                <span className={`text-[11px] tracking-widest2 ${status.className}`}>{status.label}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateStock(p, p.stock - 1)} className="w-8 h-8 border border-bone flex items-center justify-center">
                    <Minus size={12} />
                  </button>
                  <input
                    type="number" min="0" value={p.stock}
                    onChange={(e) => updateStock(p, Number(e.target.value))}
                    className="w-16 text-center border border-bone py-1.5 text-sm"
                  />
                  <button onClick={() => updateStock(p, p.stock + 1)} className="w-8 h-8 border border-bone flex items-center justify-center">
                    <Plus size={12} />
                  </button>
                  {savingId === p.id && <span className="text-[10px] text-graphite">Saving…</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

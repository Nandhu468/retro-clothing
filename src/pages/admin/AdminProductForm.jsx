import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, GripVertical, Star } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const MAX_MB = 4

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function compressImage(file) {
  // Downscale to max 1600px on the longest side and re-encode as WEBP where supported.
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = () => { img.src = reader.result }
    reader.onerror = reject
    img.onload = () => {
      const maxDim = 1600
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/webp',
        0.82
      )
    }
    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', category: 'shirts', price: '', description: '',
    sizes: [], stock: 0, featured: false, new_arrival: false, published: true,
    fabric: '', fit: '', care: '', sku: '',
  })
  const [images, setImages] = useState([]) // {url, path, is_primary}
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [showOptional, setShowOptional] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    async function load() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        setForm({
          name: data.name, category: data.category, price: data.price, description: data.description || '',
          sizes: data.sizes || [], stock: data.stock, featured: data.featured, new_arrival: data.new_arrival,
          published: data.published, fabric: data.fabric || '', fit: data.fit || '', care: data.care || '',
          sku: data.sku || '',
        })
        setImages(data.images || [])
        if (data.fabric || data.fit || data.care || data.sku) setShowOptional(true)
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleSize(s) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }))
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    setError('')

    for (const file of files) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Unsupported image format.')
        continue
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError('Image too large.')
        continue
      }
      setUploading(true)
      try {
        const compressed = await compressImage(file)
        const path = `products/${crypto.randomUUID()}.webp`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, compressed, { contentType: 'image/webp', upsert: false })

        if (uploadError) {
          setError('Upload failed.')
          continue
        }
        const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(path)
        setImages((prev) => [...prev, { url: publicUrl.publicUrl, path, is_primary: prev.length === 0 }])
      } catch {
        setError('Upload failed.')
      } finally {
        setUploading(false)
      }
    }
  }

  async function removeImage(idx) {
    const img = images[idx]
    if (img.path) await supabase.storage.from('product-images').remove([img.path])
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (next.length && !next.some((i) => i.is_primary)) next[0].is_primary = true
      return next
    })
  }

  function setPrimary(idx) {
    setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === idx })))
  }

  function moveImage(idx, dir) {
    setImages((prev) => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.price || form.sizes.length === 0) {
      setError('Please fill in name, price, and at least one size.')
      return
    }

    setSaving(true)
    const orderedImages = images.map((img, i) => ({ ...img, sort: i }))
    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      category: form.category,
      price: Number(form.price),
      description: form.description || null,
      images: orderedImages,
      sizes: form.sizes,
      stock: Number(form.stock) || 0,
      featured: form.featured,
      new_arrival: form.new_arrival,
      published: form.published,
      fabric: form.fabric || null,
      fit: form.fit || null,
      care: form.care || null,
      sku: form.sku || null,
    }

    const query = isEdit
      ? supabase.from('products').update(payload).eq('id', id)
      : supabase.from('products').insert(payload)

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) {
      setError(saveError.message.includes('duplicate') ? 'A product with a similar name already exists.' : 'Could not save product.')
      return
    }
    navigate('/admin/products')
  }

  if (loading) return <div className="skeleton h-96" />

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl tracking-wide mb-6">{isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Product Name">
          <input value={form.name} onChange={(e) => update('name', e.target.value)} className="input" required />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input">
              <option value="shirts">Shirts</option>
              <option value="t-shirts">T-Shirts</option>
              <option value="pants">Pants</option>
            </select>
          </Field>
          <Field label="Price (₹)">
            <input type="number" min="0" step="1" value={form.price} onChange={(e) => update('price', e.target.value)} className="input" required />
          </Field>
        </div>

        <Field label="Description">
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="input" />
        </Field>

        <Field label="Product Images">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {images.map((img, i) => (
              <div key={img.path || i} className="relative aspect-square bg-bone border border-bone group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-ink text-mist text-[9px] px-1.5 py-0.5 flex items-center gap-1">
                    <Star size={9} className="fill-mist" /> PRIMARY
                  </span>
                )}
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/90 rounded-full p-1">
                  <X size={12} />
                </button>
                <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => moveImage(i, -1)} className="bg-white/90 rounded p-1"><GripVertical size={10} /></button>
                  {!img.is_primary && (
                    <button type="button" onClick={() => setPrimary(i)} className="bg-white/90 text-[9px] px-1.5 rounded">Set primary</button>
                  )}
                </div>
              </div>
            ))}
            <label className="aspect-square border border-dashed border-graphite flex items-center justify-center text-xs text-graphite cursor-pointer hover:border-ink">
              {uploading ? 'Uploading…' : '+ Upload'}
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleFiles} />
            </label>
          </div>
        </Field>

        <Field label="Sizes">
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <button key={s} type="button" onClick={() => toggleSize(s)}
                className={`w-11 h-11 text-xs border ${form.sizes.includes(s) ? 'bg-ink text-mist border-ink' : 'border-bone'}`}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Stock">
          <input type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input w-32" />
        </Field>

        <div className="flex flex-wrap gap-6">
          <Toggle label="Featured" checked={form.featured} onChange={(v) => update('featured', v)} />
          <Toggle label="New Arrival" checked={form.new_arrival} onChange={(v) => update('new_arrival', v)} />
          <Toggle label="Published" checked={form.published} onChange={(v) => update('published', v)} />
        </div>

        <button type="button" onClick={() => setShowOptional((v) => !v)} className="text-xs tracking-widest2 border-b border-ink w-fit">
          {showOptional ? 'HIDE' : 'SHOW'} OPTIONAL DETAILS
        </button>

        {showOptional && (
          <div className="grid sm:grid-cols-2 gap-4 border-t border-bone pt-6">
            <Field label="Fabric"><input value={form.fabric} onChange={(e) => update('fabric', e.target.value)} className="input" /></Field>
            <Field label="Fit"><input value={form.fit} onChange={(e) => update('fit', e.target.value)} className="input" /></Field>
            <Field label="Care Instructions"><input value={form.care} onChange={(e) => update('care', e.target.value)} className="input" /></Field>
            <Field label="SKU"><input value={form.sku} onChange={(e) => update('sku', e.target.value)} className="input" /></Field>
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="bg-ink text-mist px-6 py-3 text-xs tracking-widest2 disabled:opacity-50">
            {saving ? 'SAVING…' : 'SAVE PRODUCT'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="border border-ink px-6 py-3 text-xs tracking-widest2">
            CANCEL
          </button>
        </div>
      </form>

      <style>{`.input { width: 100%; border: 1px solid #eae7e0; background: white; padding: 0.65rem 0.9rem; font-size: 0.875rem; }`}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs tracking-widest2 text-graphite block mb-2">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-ink" />
      {label}
    </label>
  )
}

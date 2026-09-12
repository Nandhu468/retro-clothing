import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasValidCredentials = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
)

if (!hasValidCredentials) {
  // eslint-disable-next-line no-console
  console.info(
    '[Retro Clothing] Running in local demo mode with built-in catalog storage. To connect your live Supabase database, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  )
}

const STORAGE_KEY = 'retro_mock_products_v1'
const AUTH_KEY = 'retro_mock_auth_session_v1'

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-shirt-01',
    name: 'Vintage Linen Camp Collar Shirt',
    slug: 'vintage-linen-camp-collar-shirt',
    category: 'shirts',
    price: 1499,
    description: 'Breezy, textured pure linen with an open camp collar. Cut in a relaxed silhouette for effortless tropical style and all-day comfort in South Indian climates.',
    images: [
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 14,
    featured: true,
    new_arrival: true,
    published: true,
    fabric: '100% Breathable French Linen',
    fit: 'Relaxed Boxy Fit',
    care: 'Cold gentle cycle, hang dry in shade',
    sku: 'RTR-SH-001',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prod-shirt-02',
    name: 'Cuban Stripe Resort Shirt',
    slug: 'cuban-stripe-resort-shirt',
    category: 'shirts',
    price: 1699,
    description: 'Vertical retro stripe design on breathable viscose rayon. Features custom mother-of-pearl buttons, notch lapel, and split side seams.',
    images: [
      { url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 8,
    featured: true,
    new_arrival: false,
    published: true,
    fabric: 'Viscose Cotton Blend',
    fit: 'Cuban Relaxed',
    care: 'Hand wash or delicate dry clean',
    sku: 'RTR-SH-002',
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'prod-shirt-03',
    name: 'Heavyweight Canvas Overshirt',
    slug: 'heavyweight-canvas-overshirt',
    category: 'shirts',
    price: 2199,
    description: 'Rugged cotton canvas overshirt with twin chest utility pockets and tonal matte buttons. Perfect layered over a graphic tee or styled solo.',
    images: [
      { url: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 5,
    featured: false,
    new_arrival: true,
    published: true,
    fabric: '100% Heavyweight Cotton Twill (320 GSM)',
    fit: 'Oversized Boxy',
    care: 'Machine wash cold with like colors',
    sku: 'RTR-SH-003',
    created_at: '2026-03-05T10:00:00Z',
    updated_at: '2026-03-05T10:00:00Z',
  },
  {
    id: 'prod-shirt-04',
    name: 'Washed Corduroy Minimal Shirt',
    slug: 'washed-corduroy-minimal-shirt',
    category: 'shirts',
    price: 1899,
    description: 'Fine-wale corduroy with a soft garment wash for a worn-in retro feel. Features a clean curved hemline and subtle back pleat.',
    images: [
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', is_primary: true },
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 3,
    featured: false,
    new_arrival: false,
    published: true,
    fabric: '100% Fine Wale Cotton Corduroy',
    fit: 'Standard Straight',
    care: 'Wash inside out, cool iron',
    sku: 'RTR-SH-004',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'prod-tee-01',
    name: 'Heavyweight Boxy Drop-Shoulder Tee',
    slug: 'heavyweight-boxy-drop-shoulder-tee',
    category: 't-shirts',
    price: 899,
    description: 'Substantial 250 GSM combed cotton tee that holds its shape wash after wash. Cut with dropped shoulders, wide sleeves, and a snug ribbed neck collar.',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    featured: true,
    new_arrival: true,
    published: true,
    fabric: '250 GSM 100% Combed Cotton',
    fit: 'Boxy Drop Shoulder',
    care: 'Machine wash cold, do not tumble dry',
    sku: 'RTR-TS-001',
    created_at: '2026-03-08T10:00:00Z',
    updated_at: '2026-03-08T10:00:00Z',
  },
  {
    id: 'prod-tee-02',
    name: 'Vintage Wash Retro Typography Tee',
    slug: 'vintage-wash-retro-typography-tee',
    category: 't-shirts',
    price: 999,
    description: 'Acid-washed charcoal body with distressed screen printed archival typography on chest. Soft-touch silicone wash finish.',
    images: [
      { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 12,
    featured: true,
    new_arrival: true,
    published: true,
    fabric: '230 GSM Compact Cotton',
    fit: 'Relaxed Streetwear Fit',
    care: 'Wash inside out in cold water',
    sku: 'RTR-TS-002',
    created_at: '2026-03-06T10:00:00Z',
    updated_at: '2026-03-06T10:00:00Z',
  },
  {
    id: 'prod-tee-03',
    name: 'Minimal High-Neck Structured Tee',
    slug: 'minimal-high-neck-structured-tee',
    category: 't-shirts',
    price: 949,
    description: 'Slightly raised mock neckline with thick collar binding. Heavy drape cotton that elevates casual layered fits.',
    images: [
      { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', is_primary: true },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 7,
    featured: false,
    new_arrival: false,
    published: true,
    fabric: '260 GSM Interlock Cotton',
    fit: 'Structured Boxy',
    care: 'Gentle machine wash',
    sku: 'RTR-TS-003',
    created_at: '2026-02-14T10:00:00Z',
    updated_at: '2026-02-14T10:00:00Z',
  },
  {
    id: 'prod-pants-01',
    name: 'Wide Leg Pleated Trousers',
    slug: 'wide-leg-pleated-trousers',
    category: 'pants',
    price: 1999,
    description: 'Double front pleats flow down to a wide, relaxed drape. Hidden adjustable waist tabs and deep slash pockets.',
    images: [
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 11,
    featured: true,
    new_arrival: true,
    published: true,
    fabric: 'Wool Blend Suiting Twill',
    fit: 'Wide Leg Drape',
    care: 'Dry clean recommended or gentle hand wash',
    sku: 'RTR-PT-001',
    created_at: '2026-03-02T10:00:00Z',
    updated_at: '2026-03-02T10:00:00Z',
  },
  {
    id: 'prod-pants-02',
    name: 'Relaxed Cargo Pants with D-Ring',
    slug: 'relaxed-cargo-pants-with-d-ring',
    category: 'pants',
    price: 2299,
    description: 'Durable ripstop construction with dual bellows cargo pockets, matte black hardware, and drawstring hem toggles for variable styling.',
    images: [
      { url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80', is_primary: true },
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', is_primary: false },
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 6,
    featured: true,
    new_arrival: false,
    published: true,
    fabric: 'Heavy Cotton Ripstop',
    fit: 'Relaxed Tapered with Drawstring Hem',
    care: 'Machine wash cold',
    sku: 'RTR-PT-002',
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
  },
  {
    id: 'prod-pants-03',
    name: 'Everyday Straight Fit Chinos',
    slug: 'everyday-straight-fit-chinos',
    category: 'pants',
    price: 1799,
    description: 'Clean silhouette in mid-weight cotton stretch twill. Back welt pockets, coin pocket, and durable bar-tack reinforcement.',
    images: [
      { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', is_primary: true },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 18,
    featured: false,
    new_arrival: true,
    published: true,
    fabric: '98% Cotton, 2% Elastane Twill',
    fit: 'Straight Regular',
    care: 'Machine wash warm with like colors',
    sku: 'RTR-PT-003',
    created_at: '2026-03-07T10:00:00Z',
    updated_at: '2026-03-07T10:00:00Z',
  },
]

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return DEFAULT_PRODUCTS
}

function saveStoredProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch {
    // ignore
  }
}

function getStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveStoredSession(session) {
  try {
    if (session) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  } catch {
    // ignore
  }
}

const authListeners = new Set()

function notifyAuth(event, session) {
  authListeners.forEach((cb) => {
    try {
      cb(event, session)
    } catch {
      // ignore
    }
  })
}

class MockQueryBuilder {
  constructor(table) {
    this.table = table
    this.predicates = []
    this.orders = []
    this.limitCount = null
    this.singleMode = false
    this.isInsert = false
    this.isUpdate = false
    this.isDelete = false
    this.insertPayload = null
    this.updatePayload = null
  }

  select() {
    return this
  }

  eq(column, value) {
    this.predicates.push((item) => item[column] === value)
    return this
  }

  neq(column, value) {
    this.predicates.push((item) => item[column] !== value)
    return this
  }

  textSearch(column, query) {
    if (!query) return this
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    this.predicates.push((item) => {
      const target = `${item.name || ''} ${item.category || ''} ${item.description || ''} ${item.fabric || ''}`.toLowerCase()
      return terms.every((t) => target.includes(t))
    })
    return this
  }

  order(column, { ascending = true } = {}) {
    this.orders.push({ column, ascending })
    return this
  }

  limit(count) {
    this.limitCount = count
    return this
  }

  maybeSingle() {
    this.singleMode = true
    return this
  }

  single() {
    this.singleMode = true
    return this
  }

  insert(payload) {
    this.isInsert = true
    this.insertPayload = Array.isArray(payload) ? payload : [payload]
    return this
  }

  update(payload) {
    this.isUpdate = true
    this.updatePayload = payload
    return this
  }

  delete() {
    this.isDelete = true
    return this
  }

  async execute() {
    if (this.table === 'admins') {
      const session = getStoredSession()
      let matches = true
      for (const pred of this.predicates) {
        if (!pred({ id: 'admin-row-1', user_id: session?.user?.id || 'admin-mock-id', role: 'admin' })) {
          matches = false
          break
        }
      }
      return {
        data: matches ? { id: 'admin-row-1', role: 'admin' } : null,
        error: null,
      }
    }

    if (this.table !== 'products') {
      return { data: this.singleMode ? null : [], error: null }
    }

    let all = [...getStoredProducts()]

    if (this.isInsert) {
      const created = this.insertPayload.map((item) => ({
        id: item.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item,
      }))
      all = [...created, ...all]
      saveStoredProducts(all)
      return { data: created, error: null }
    }

    if (this.isUpdate) {
      let updatedItems = []
      all = all.map((item) => {
        const matches = this.predicates.every((pred) => pred(item))
        if (matches) {
          const next = { ...item, ...this.updatePayload, updated_at: new Date().toISOString() }
          updatedItems.push(next)
          return next
        }
        return item
      })
      saveStoredProducts(all)
      return { data: this.singleMode ? updatedItems[0] || null : updatedItems, error: null }
    }

    if (this.isDelete) {
      const remaining = all.filter((item) => !this.predicates.every((pred) => pred(item)))
      saveStoredProducts(remaining)
      return { data: null, error: null }
    }

    let result = all.filter((item) => this.predicates.every((pred) => pred(item)))

    for (const { column, ascending } of this.orders) {
      result.sort((a, b) => {
        const valA = a[column]
        const valB = b[column]
        if (valA == null && valB == null) return 0
        if (valA == null) return ascending ? -1 : 1
        if (valB == null) return ascending ? 1 : -1
        if (column === 'created_at' || column === 'updated_at') {
          return ascending ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA)
        }
        if (typeof valA === 'string') {
          return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return ascending ? valA - valB : valB - valA
      })
    }

    if (this.limitCount != null) {
      result = result.slice(0, this.limitCount)
    }

    if (this.singleMode) {
      return { data: result[0] || null, error: null }
    }

    return { data: result, error: null, count: result.length }
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject)
  }
}

const mockSupabaseClient = {
  from(table) {
    return new MockQueryBuilder(table)
  },
  auth: {
    async getSession() {
      const session = getStoredSession()
      return { data: { session }, error: null }
    },
    onAuthStateChange(callback) {
      authListeners.add(callback)
      const session = getStoredSession()
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session)
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback)
            },
          },
        },
      }
    },
    async signInWithPassword({ email }) {
      const session = {
        user: { id: 'admin-mock-id', email: email || 'admin@retroclothing.in' },
        access_token: 'mock-admin-token-aal2',
      }
      saveStoredSession(session)
      notifyAuth('SIGNED_IN', session)
      return { data: { user: session.user, session }, error: null }
    },
    async signOut() {
      saveStoredSession(null)
      notifyAuth('SIGNED_OUT', null)
      return { error: null }
    },
    mfa: {
      async getAuthenticatorAssuranceLevel() {
        return { data: { currentLevel: 'aal2', nextLevel: 'aal2' } }
      },
      async listFactors() {
        return {
          data: {
            totp: [{ id: 'mock-totp-factor', status: 'verified', friendly_name: 'Retro Authenticator' }],
          },
        }
      },
      async challenge({ factorId }) {
        return { data: { id: 'mock-challenge-id', factorId }, error: null }
      },
      async verify() {
        return { data: {}, error: null }
      },
      async enroll() {
        return {
          data: {
            id: 'mock-totp-factor',
            totp: {
              qr_code:
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="160" height="160"><rect width="100" height="100" fill="#f5f5f2"/><rect x="10" y="10" width="26" height="26" fill="#111"/><rect x="15" y="15" width="16" height="16" fill="#f5f5f2"/><rect x="18" y="18" width="10" height="10" fill="#111"/><rect x="64" y="10" width="26" height="26" fill="#111"/><rect x="69" y="15" width="16" height="16" fill="#f5f5f2"/><rect x="72" y="18" width="10" height="10" fill="#111"/><rect x="10" y="64" width="26" height="26" fill="#111"/><rect x="15" y="69" width="16" height="16" fill="#f5f5f2"/><rect x="18" y="72" width="10" height="10" fill="#111"/><rect x="44" y="44" width="12" height="12" fill="#111"/></svg>',
              secret: 'JBSWY3DPEHPK3PXP',
            },
          },
          error: null,
        }
      },
      async unenroll() {
        return { data: {}, error: null }
      },
    },
  },
  storage: {
    from() {
      return {
        async upload(path, file) {
          const objectUrl = typeof URL !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : '/logo.jpg'
          return { data: { path: objectUrl }, error: null }
        },
        getPublicUrl(path) {
          return { data: { publicUrl: path && (path.startsWith('blob:') || path.startsWith('http')) ? path : '/logo.jpg' } }
        },
        async remove(paths) {
          return { data: paths, error: null }
        },
      }
    },
  },
}

let client = null
if (hasValidCredentials) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[Retro Clothing] Failed to initialize Supabase client:', err)
  }
}

export const supabase = client || mockSupabaseClient

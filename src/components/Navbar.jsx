import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const links = [
  { to: '/', label: 'HOME' },
  { to: '/shop', label: 'ALL COLLECTION' },
  { to: '/new-arrivals', label: 'NEW ARRIVALS' },
  { to: '/about', label: 'OUR STORY' },
]

const mobileLinks = [
  ...links,
  { to: '/shop/shirts', label: 'SHIRTS' },
  { to: '/shop/t-shirts', label: 'TEES' },
  { to: '/shop/pants', label: 'PANTS' },
  { to: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { count } = useCart()
  const { items: wishItems } = useWishlist()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function submitSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchOpen(false)
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
        isHomePage && !scrolled
          ? 'bg-transparent py-5'
          : 'bg-ink/95 backdrop-blur-sm py-2 shadow-lg shadow-black/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 focus-ring rounded-sm logo-pulse">
          <img src="/logo.jpg" alt="Retro Clothing" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover" />
          <span className="text-mist font-display text-xl sm:text-2xl tracking-widest2 leading-none">
            RETRO
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-xs tracking-widest2 transition-colors duration-250 focus-ring ${
                  isActive ? 'text-mist' : 'text-silver hover:text-mist'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-4 text-mist">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="min-w-9 min-h-9 sm:min-w-11 sm:min-h-11 flex items-center justify-center hover:text-silver transition-colors focus-ring rounded-sm"
          >
            <Search size={18} />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative min-w-9 min-h-9 sm:min-w-11 sm:min-h-11 flex items-center justify-center hover:text-silver transition-colors focus-ring rounded-sm"
          >
            <Heart size={18} />
            {wishItems.length > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-mist text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishItems.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            data-cart-icon
            className="relative min-w-9 min-h-9 sm:min-w-11 sm:min-h-11 flex items-center justify-center hover:text-silver transition-colors focus-ring rounded-sm"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-mist text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden min-w-9 min-h-9 flex items-center justify-center hover:text-silver transition-colors focus-ring rounded-sm"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="mobile-menu fixed inset-0 bg-ink z-50 flex flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <img src="/logo.jpg" alt="Retro Clothing" className="h-9 w-9 rounded-full object-cover" />
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="text-mist focus-ring rounded-sm">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-5 px-8 mt-8 overflow-y-auto pb-8">
            {mobileLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className="text-mist text-3xl sm:text-4xl font-display tracking-wide py-1"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-ink z-[60] flex flex-col px-6 pt-8">
          <div className="flex items-center justify-between max-w-2xl w-full mx-auto">
            <form onSubmit={submitSearch} className="flex-1 flex items-center gap-3 border-b border-silver/40 pb-3">
              <Search className="text-silver" size={20} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent flex-1 text-mist text-lg outline-none placeholder:text-silver/60"
              />
            </form>
            <button aria-label="Close search" onClick={() => setSearchOpen(false)} className="text-mist ml-4 focus-ring rounded-sm">
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

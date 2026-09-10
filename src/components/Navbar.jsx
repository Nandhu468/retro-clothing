import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const links = [
  { to: '/', label: 'HOME' },
  { to: '/shop', label: 'SHOP' },
  { to: '/new-arrivals', label: 'NEW ARRIVALS' },
  { to: '/about', label: 'ABOUT' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { count } = useCart()
  const { items: wishItems } = useWishlist()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        scrolled ? 'bg-ink/95 backdrop-blur-sm py-2 shadow-lg shadow-black/20' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 focus-ring rounded-sm logo-pulse">
          <img src="/logo.jpg" alt="Retro Clothing" className="h-10 w-10 rounded-full object-cover" />
          <span className="hidden sm:block text-mist font-display text-2xl tracking-widest2 leading-none">
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

        <div className="flex items-center gap-4 sm:gap-5 text-mist">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="hover:text-silver transition-colors focus-ring rounded-sm"
          >
            <Search size={19} />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative hover:text-silver transition-colors focus-ring rounded-sm">
            <Heart size={19} />
            {wishItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-mist text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-silver transition-colors focus-ring rounded-sm">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-mist text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden hover:text-silver transition-colors focus-ring rounded-sm"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-ink z-50 flex flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <img src="/logo.jpg" alt="Retro Clothing" className="h-9 w-9 rounded-full object-cover" />
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="text-mist focus-ring rounded-sm">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-8 px-8 mt-10">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className="text-mist text-3xl font-display tracking-wide"
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
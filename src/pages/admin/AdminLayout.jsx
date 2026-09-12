import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, PlusCircle, Boxes, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
  { to: '/admin/stock', label: 'Stock', icon: Boxes },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { signOut } = useAdminAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-mist flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-60 shrink-0 bg-ink text-mist flex-col py-6 px-4">
        <SidebarContent signOut={signOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-ink text-mist flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-sm tracking-widest2">RETRO ADMIN</span>
        </div>
        <button onClick={() => setOpen(true)} className="focus-ring"><Menu size={22} /></button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-full bg-ink text-mist flex flex-col py-6 px-4">
            <button onClick={() => setOpen(false)} className="self-end mb-4 focus-ring"><X size={22} /></button>
            <SidebarContent signOut={signOut} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 pt-16 md:pt-0 px-4 sm:px-8 py-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  )
}

function SidebarContent({ signOut, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-2 px-2 mb-10">
        <img src="/logo.jpg" alt="" className="h-9 w-9 rounded-full object-cover" />
        <span className="font-display text-lg tracking-widest2">RETRO ADMIN</span>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${
                isActive ? 'bg-mist text-ink' : 'text-silver hover:bg-charcoal'
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={signOut}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-silver hover:bg-charcoal rounded-sm mt-6"
      >
        <LogOut size={16} /> Logout
      </button>
    </>
  )
}

import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import About from './pages/About'
import Contact from './pages/Contact'
import NewArrivals from './pages/NewArrivals'

import AdminLogin from './pages/admin/AdminLogin'
import AdminMFASetup from './pages/admin/AdminMFASetup'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminStock from './pages/admin/AdminStock'
import AdminSettings from './pages/admin/AdminSettings'

function StorefrontLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Storefront */}
        <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
        <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
        <Route path="/shop/:category" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
        <Route path="/new-arrivals" element={<StorefrontLayout><NewArrivals /></StorefrontLayout>} />
        <Route path="/product/:slug" element={<StorefrontLayout><ProductPage /></StorefrontLayout>} />
        <Route path="/wishlist" element={<StorefrontLayout><Wishlist /></StorefrontLayout>} />
        <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
        <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
        <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/mfa-setup" element={<AdminMFASetup />} />

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="stock" element={<AdminStock />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="*"
          element={
            <StorefrontLayout>
              <div className="max-w-xl mx-auto px-6 pt-40 pb-24 text-center">
                <h1 className="font-display text-4xl tracking-wide mb-3">PAGE NOT FOUND</h1>
              </div>
            </StorefrontLayout>
          }
        />
      </Routes>
    </>
  )
}

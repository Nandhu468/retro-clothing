import { Link } from 'react-router-dom'
import { Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink text-mist pt-16 pb-8 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.jpg" alt="Retro Clothing" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-xl tracking-widest2">RETRO</span>
          </div>
          <p className="text-silver text-sm leading-relaxed max-w-xs">
            Men's fashion designed for confidence, comfort and individuality.
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-silver mb-4">SHOP</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop/shirts" className="hover:text-silver">Shirts</Link></li>
            <li><Link to="/shop/t-shirts" className="hover:text-silver">T-Shirts</Link></li>
            <li><Link to="/shop/pants" className="hover:text-silver">Pants</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-silver">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-silver mb-4">COMPANY</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-silver">About</Link></li>
            <li><Link to="/contact" className="hover:text-silver">Contact</Link></li>
            <li>
              <a href="https://www.instagram.com/retroclothing_.in?stkn=Z2Vndnh0dXhyb3Rl" target="_blank" rel="noreferrer" className="hover:text-silver">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-silver mb-4">HELP</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={14} /> <a href="tel:7358274739" className="hover:text-silver">7358274739</a></li>
            <li className="flex items-center gap-2"><Mail size={14} /> <a href="mailto:retroclothingtvl@gmail.com" className="hover:text-silver break-all">retroclothingtvl@gmail.com</a></li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> <span>33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Tirunelveli, TN – 627006</span></li>
            <li className="flex items-center gap-2"><Instagram size={14} /> <a href="https://www.instagram.com/retroclothing_.in?stkn=Z2Vndnh0dXhyb3Rl" target="_blank" rel="noreferrer" className="hover:text-silver">@retroclothing_.in</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-graphite mt-12 pt-6 text-xs text-silver/70">
        © 2026 Retro Clothing. All rights reserved.
      </div>
    </footer>
  )
}

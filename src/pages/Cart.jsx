import { Link } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { buildCartMessage, whatsappLink } from '../lib/whatsapp'

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl tracking-wide mb-3">YOUR CART IS EMPTY</h1>
        <Link to="/shop" className="text-xs tracking-widest2 border-b border-ink pb-0.5">CONTINUE SHOPPING</Link>
      </div>
    )
  }

  const message = buildCartMessage(items)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
      <h1 className="font-display text-4xl tracking-wide mb-8">YOUR CART</h1>
      <div className="divide-y divide-bone border-t border-b border-bone">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex gap-4 py-5">
            <div className="w-20 h-24 bg-bone shrink-0 overflow-hidden">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-graphite mt-1">Size: {item.size || '-'}</p>
                </div>
                <button onClick={() => removeItem(item.id, item.size)} className="text-graphite hover:text-ink focus-ring">
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-bone">
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center focus-ring">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center focus-ring">
                    <Plus size={12} />
                  </button>
                </div>
                <span className="text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-lg">
        <span className="font-display tracking-wide">SUBTOTAL</span>
        <span>₹{subtotal.toFixed(0)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noreferrer"
          className="bg-ink text-mist text-center py-3.5 text-xs tracking-widest2 hover:bg-graphite transition-colors focus-ring"
        >
          ORDER VIA WHATSAPP
        </a>
        <Link to="/shop" className="text-center text-xs tracking-widest2 border-b border-ink pb-0.5 w-fit mx-auto">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  )
}

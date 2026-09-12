import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '../lib/whatsapp'

export default function MobileCommerceActions() {
  const message = 'Hello Retro Clothing,\n\nI would like help placing an order.'

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noreferrer"
      className="mobile-whatsapp-cta focus-ring"
      aria-label="Order through WhatsApp"
    >
      <MessageCircle size={17} />
      <span>ORDER ON WHATSAPP</span>
    </a>
  )
}


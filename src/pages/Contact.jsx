import { Clock3, Phone, Mail, Instagram, MapPin, MessageCircle } from 'lucide-react'

const actions = [
  { label: 'CALL', href: 'tel:7358274739', icon: Phone },
  { label: 'WHATSAPP', href: 'https://wa.me/918667873216', icon: MessageCircle },
  { label: 'EMAIL', href: 'mailto:retroclothingtvl@gmail.com', icon: Mail },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/retroclothing_.in?stkn=Z2Vndnh0dXhyb3Rl', icon: Instagram },
  { label: 'DIRECTIONS', href: 'https://maps.app.goo.gl/86kZcDQkkMHZznqq7?g_st=ac', icon: MapPin },
]

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-5xl tracking-wide mb-4">GET IN TOUCH</h1>
      <p className="text-graphite mb-10">
        33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Tirunelveli, Tamil Nadu – 627006
      </p>

      <div className="space-y-3 mb-10 text-sm text-graphite">
        <p>Phone: 7358274739</p>
        <p>WhatsApp: +91 86678 73216</p>
        <p>Email: retroclothingtvl@gmail.com</p>
        <p>Instagram: @retroclothing_.in</p>
        <p className="flex items-center gap-2"><Clock3 size={15} /> Store hours: Saturday &amp; Sunday, 6 PM – 10 PM</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="border border-ink py-4 flex flex-col items-center gap-2 text-[11px] tracking-widest2 hover:bg-ink hover:text-mist transition-colors focus-ring"
          >
            <Icon size={18} />
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918667873216'

export function buildSingleProductMessage({ name, size, quantity, price }) {
  const lines = [
    'Hello Retro Clothing,',
    '',
    'I would like to order:',
    '',
    `Product: ${name}`,
    `Size: ${size || '-'}`,
    `Quantity: ${quantity}`,
    `Price: ₹${price}`,
    '',
    'Please confirm availability and order details.',
    '',
    'Thank you.',
  ]
  return lines.join('\n')
}

export function buildCartMessage(items) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const lines = ['Hello Retro Clothing,', '', 'I would like to place an order:', '']
  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.name}`)
    lines.push(`   Size: ${item.size || '-'}`)
    lines.push(`   Quantity: ${item.quantity}`)
    lines.push('')
  })
  lines.push(`Total: ₹${total.toFixed(2)}`)
  lines.push('')
  lines.push('Please confirm the order.')
  return lines.join('\n')
}

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

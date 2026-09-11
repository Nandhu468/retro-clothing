const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Creates a short-lived visual copy of a product image and sends it to the
 * persistent cart control. It does not participate in cart state.
 */
export function animateItemToCart({ sourceElement, imageSrc }) {
  const cartElement = document.querySelector('[data-cart-icon]')
  if (!sourceElement || !imageSrc || !cartElement || prefersReducedMotion()) return

  const source = sourceElement.getBoundingClientRect()
  const cart = cartElement.getBoundingClientRect()
  if (!source.width || !source.height) return

  const size = Math.min(72, Math.max(42, source.width * 0.22))
  const startX = source.left + source.width / 2 - size / 2
  const startY = source.top + source.height / 2 - size / 2
  const endX = cart.left + cart.width / 2 - size / 2
  const endY = cart.top + cart.height / 2 - size / 2
  const arcY = Math.min(startY, endY) - 72

  const flyingImage = document.createElement('img')
  flyingImage.src = imageSrc
  flyingImage.alt = ''
  flyingImage.className = 'cart-flying-image'
  Object.assign(flyingImage.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${startX}px`,
    top: `${startY}px`,
  })
  document.body.appendChild(flyingImage)

  const flight = flyingImage.animate(
    [
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 0.96 },
      {
        transform: `translate3d(${(endX - startX) * 0.52}px, ${arcY - startY}px, 0) scale(0.78)`,
        opacity: 1,
        offset: 0.52,
      },
      {
        transform: `translate3d(${endX - startX}px, ${endY - startY}px, 0) scale(0.22)`,
        opacity: 0.12,
      },
    ],
    { duration: 680, easing: 'cubic-bezier(0.22, 0.9, 0.32, 1)', fill: 'forwards' }
  )

  flight.finished
    .catch(() => {})
    .finally(() => {
      flyingImage.remove()
      cartElement.classList.remove('cart-icon-bounce')
      // Restart the keyframe cleanly when products are added quickly.
      void cartElement.offsetWidth
      cartElement.classList.add('cart-icon-bounce')
      cartElement.addEventListener('animationend', () => cartElement.classList.remove('cart-icon-bounce'), { once: true })
    })
}
